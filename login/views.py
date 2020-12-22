from django.shortcuts import render, redirect
from django.http import HttpResponse

from .forms import FormLogin

# Create your views here.
def login(request):
    form = FormLogin()
    
    return render(request, 'login/login.html', {'form' : form})