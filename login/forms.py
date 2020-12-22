from django import forms
from django.forms import ModelForm

class FormLogin(forms.Form):
    user = forms.CharField(max_length=64)
    password = forms.CharField(widget=forms.PasswordInput())
