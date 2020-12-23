from django import forms
from django.forms import ModelForm

class FormLogin(forms.Form):
    username = forms.CharField(max_length=64, widget=forms.TextInput(attrs={'placeholder':'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))

