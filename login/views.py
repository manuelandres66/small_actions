from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse
from django.contrib.auth import logout, authenticate, login

from .forms import FormLogin

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