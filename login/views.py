from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.models import Group

from .forms import FormLogin, FromCreateUser
from .models import User
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
                if 'next' in request.POST:
                    return redirect(request.POST.get('next'))
                return redirect(reverse('index'))
            else:
                error = "The username and password you entered don't match"

    return render(request, 'login/login.html', {'form' : form, 'error' : error})

def out(request):
    logout(request)
    return redirect(reverse('index'))

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