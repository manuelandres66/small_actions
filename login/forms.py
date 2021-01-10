from django import forms
from .models import User

class FormLogin(forms.Form):
    username = forms.CharField(max_length=32, widget=forms.TextInput(attrs={'placeholder':'Usuario'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Contraseña'}))

class FromCreateUser(forms.ModelForm):
    username = forms.CharField(max_length=32, widget=forms.TextInput(attrs={'placeholder':'Usuario'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Contraseña'}))
    repeat_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Repita la Contraseña'}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({'placeholder': 'Email'})
        self.fields['latitude'].widget.attrs.update({'placeholder': 'Lat.'})
        self.fields['longitude'].widget.attrs.update({'placeholder': 'Long.'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'latitude', 'longitude', 'photo')

class ChangeUser(forms.ModelForm):
    username = forms.CharField(max_length=32, widget=forms.TextInput(attrs={'placeholder':'Usuario'}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({'placeholder': 'Email'})
        self.fields['latitude'].widget.attrs.update({'placeholder': 'Lat.'})
        self.fields['longitude'].widget.attrs.update({'placeholder': 'Long.'})

    class Meta:
        model = User
        fields = ('email', 'latitude', 'longitude', 'photo', 'dark_mode')

class FormPassword(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Contraseña'}))

class FormForgot(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder':'Email'}))

class ResetPassword(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Nueva Contraseña'}))
    repeat_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Repita la Nueva Contraseña'}))