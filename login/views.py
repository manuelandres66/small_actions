from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required

from .forms import FormLogin, FromCreateUser, ChangeUser
from .models import User

import json
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
                if 'next' in request.POST and request.POST['next'] != '':
                    return redirect(request.POST['next'])
                return redirect(reverse('index'))
            else:
                error = "The username and password you entered don't match"

    return render(request, 'login/login.html', {'form' : form, 'error' : error})

def out(request):
    logout(request)
    return redirect(reverse('index'))

@login_required(login_url='/account/login')
def account(request):
    user = User.objects.get(username=request.user)
    index = list(User.objects.order_by('-points')).index(user) + 1
    form = ChangeUser()

    if request.method == "POST":
        form = ChangeUser(request.POST)
        if form.is_valid():
            user.username =  form.cleaned_data['username']
            user.email =     form.cleaned_data['email']
            user.latitude =  form.cleaned_data['latitude']
            user.longitude = form.cleaned_data['longitude']
            user.save()

    ctx = {'user' : user, 'index' : index, 'form' : form}
    return render(request, 'login/account.html', ctx)

def register(request):
    form = FromCreateUser()
    error = ""

    if request.method == "POST":
        form = FromCreateUser(request.POST, request.FILES)
        if form.is_valid():
            if form.cleaned_data['password'] == form.cleaned_data['repeat_password']:
                print(form.cleaned_data['photo'])
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
    
                return redirect(reverse('login'))
            else:
                error = "Passwords don't match"

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