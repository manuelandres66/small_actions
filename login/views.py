from django.shortcuts import render, redirect, reverse
from django.http import JsonResponse
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key

from .forms import FormLogin, FromCreateUser, ChangeUser, FormPassword, ResetPassword, FormForgot
from .models import User

import json
import random
import string
from datetime import timedelta

# Create your views here.

def entry(request):
    form = FormLogin()
    error = ""

    if request.method == "POST":
        form = FormLogin(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                #Cleand Nav Cache
                cache.delete(make_template_fragment_key('navbar'))

                if 'next' in request.POST and request.POST['next'] != '':
                    return redirect(request.POST['next'])
                return redirect(reverse('index'))
            else:
                error = "El usuario o contraseña son incorrectos"

    return render(request, 'login/login.html', {'form' : form, 'error' : error})

def out(request):
    logout(request)
    #Cleand Nav Cache
    cache.delete(make_template_fragment_key('navbar'))

    return redirect(reverse('index'))

@login_required(login_url='/account/login')
def account(request):
    user = User.objects.get(username=request.user)
    index = list(User.objects.order_by('-points')).index(user) + 1
    form = ChangeUser()

    if request.method == "POST":
        form = ChangeUser(request.POST, request.FILES)
        if form.is_valid():
            cache.delete(make_template_fragment_key('navbar')) #Cleand Nav Cache
            user.username =  form.cleaned_data['username']
            user.email =     form.cleaned_data['email']
            user.latitude =  form.cleaned_data['latitude']
            user.longitude = form.cleaned_data['longitude']
            if form.cleaned_data['photo'] != None:
                user.photo = form.cleaned_data['photo']
                
            try:
                user.save()
            except:
                pass

            return redirect(reverse('account'))

    #Achivments
    volunteer = len(user.visited.filter(mayor_category='V'))
    donate = len(user.visited.filter(mayor_category='D'))
    comments = len(user.comments.all())

    ctx = {'user' : user, 'index' : index, 'form' : form, 'volunteer' : volunteer, \
        'donate' : donate, 'comments' : comments}
    return render(request, 'login/account.html', ctx)

@login_required(login_url='/account/login')
def dark_mode(request):
    user = User.objects.get(username=request.user)
    user.dark_mode = not user.dark_mode
    user.save()
    return redirect(reverse('account'))

@login_required(login_url='/account/login')
def repassword(request, re): 
    form = FormPassword()
    error = ''

    if request.method == 'POST':
        form = FormPassword(request.POST)
        if form.is_valid():
            user = authenticate(username=request.user.username, password=form.cleaned_data['password'])
            if user is not None:
                user = User.objects.get(username=request.user.username)
                user.can_change = True
                user.save()
                return redirect(reverse('eliminate' if re == 2 else 'reset_password'))
            else:
                error = "No coincide con tu contraseña"

    return render(request, 'login/repassword.html', {'form' : form, 'error' : error})

@login_required(login_url='/account/login')
def reset_password(request):
    if request.user.can_change:
        form = ResetPassword()
        error = ''

        if request.method == 'POST':
            form = ResetPassword(request.POST)
            if form.is_valid():
                if form.cleaned_data['password'] == form.cleaned_data['repeat_password']:
                    user = User.objects.get(username=request.user)
                    user.set_password(form.cleaned_data['password'])
                    user.can_change = False
                    user.save()

                    return redirect(reverse('account'))
                else:
                    error = "Las contraseñas no coinciden"

        return render(request, 'login/reset_password.html', {'form' : form, 'error' : error})
    else:
        return redirect(reverse('password', kwargs={'re' : 1})) 

@login_required(login_url='/account/login')
def eliminate(request):
    if request.user.can_change:
        if request.method == 'POST':
            user = User.objects.get(username=request.user)
            if request.POST['answer'] == 'no':
                user.can_change = False
                user.save()
                return redirect(reverse('account'))
            elif request.POST['answer'] == 'yes':
                user.delete()
                return redirect(reverse('index'))

        return render(request, 'login/eliminate.html')
    else:
        return redirect(reverse('password', kwargs={'re' : 2})) 

def register(request):
    form = FromCreateUser()
    error = ""

    if request.method == "POST":
        form = FromCreateUser(request.POST, request.FILES)
        if form.is_valid():
            if form.cleaned_data['password'] == form.cleaned_data['repeat_password']:
                new_user = User.objects.create_user(
                    username=   form.cleaned_data['username'],
                    password=   form.cleaned_data['password'],
                    email=      form.cleaned_data['email'],
                    latitude=   form.cleaned_data['latitude'],
                    longitude = form.cleaned_data['longitude'],
                    photo =     form.cleaned_data['photo']
                )

                group = Group.objects.get(name='Client')
                new_user.groups.add(group)
                new_user.save()
                
                if 'next' in request.POST:
                    next_f = request.POST['next']
                    return redirect(reverse('login') + f'?next={next_f}')

                return redirect(reverse('login'))
            else:
                error = "Las contraseñas no coinciden"

    return render(request, 'login/register.html', {'form' : form, 'error':error})


@login_required(login_url='/account/login')
def ranking(request):
    user = User.objects.get(username=request.user)
    all_ranking = User.objects.all().order_by('-points')
    ranking = list(all_ranking).index(user)

    ctx = {'frist' : all_ranking[:3], 'ranking' : ranking}
    return render(request, 'login/ranking.html', ctx)


def ranking_api(request):
    if request.method != "POST":
        return JsonResponse({'error' : 'The request must be POST'}, status=400)
 
    data = json.loads(request.body)

    if 'start' in data and 'end' in data:
        start = int(data['start'])
        end = int(data['end'])
        if start == 0:
            return JsonResponse({'error' : 'Start cant be cero'})
        
        users = User.objects.all()
        if end > len(users) + 20:
            return JsonResponse({'last' : 'No more elements'})

        results = users.order_by('-points')[start - 1 : end]
        response = {'people' : []}
        for i in range(len(results)):
            response['people'].append({
                'ranking' : start + i,
                'username' : results[i].username,
                'points' : results[i].points
            })
        return JsonResponse(response, status=200)

    else:
        return JsonResponse({'error' : 'please provide start and end'}, status=400)


def forgot_password(request):
    form = FormForgot()
    succes = False
    if request.method == 'POST':
        form = FormForgot(request.POST)
        if form.is_valid():
            results = User.objects.filter(email=form.cleaned_data['email'])
            if len(results) > 0:
                #Configure for url
                user = results[0]

                user.date_forgot = timezone.now() + timedelta(minutes=15)
                letters = string.ascii_letters
                user.random_string = ''.join(random.choice(letters) for i in range(20))
                user.save()
                
                #Send Email
                link = 'http://127.0.0.1:8000' + reverse('emailink', kwargs={'random_string' : user.random_string})
                html_message = render_to_string('login/email.html', {'link': link})

                send_mail('¿Olvidaste tu contraseña?',
                f"Por favor ingresa a este link: {link}",
                settings.EMAIL_HOST_USER,
                [user.email],
                html_message=html_message)

        succes = True #For not telling if a email exist, always succes no matter the email

    return render(request, 'login/forgot.html', {'form' : form, 'succes' : succes})

def email_link(request, random_string):
    users = User.objects.filter(random_string=random_string) #Check if user
    if len(users) > 0:
        user = users[0]
        if timezone.now() <= user.date_forgot: #Chek if link is not expired
            form = ResetPassword()
            error = ''

            if request.method == 'POST':
                form = ResetPassword(request.POST)
                if form.is_valid():
                    if form.cleaned_data['password'] == form.cleaned_data['repeat_password']:
                        user.set_password(form.cleaned_data['password'])
                        letters = string.ascii_letters
                        user.random_string = ''.join(random.choice(letters) for i in range(20)) #Change random string for secure
                        user.save()
                        return redirect(reverse('account'))
                    else:
                        error = "Las contraseñas no coinciden"

            return render(request, 'login/reset_password.html', {'form' : form, 'error' : error})

    return redirect(reverse('account'))

@login_required(login_url='/account/login')
def api_places(request):
    if request.method != "GET":
        return JsonResponse({'error' : 'The request must be GET'}, status=400)
    
    user = User.objects.get(username=request.user.username)
    response = {'places' : []}
    for place in user.visited.all():
        response['places'].append({
            'name' : place.name,
            'latitude' : place.latitude,
            'longitude' : place.longitude,
            'url' : reverse('info', kwargs={'uuid' : place.uuid})
        })

    return JsonResponse(response, status=200)

def another_account(request, username):
    user = User.objects.get(username=username)
    place = user.get_ranking() + 1
    return render(request, 'login/another.html', {'user' : user, 'place' : place})
    