from django import forms
from .models import User

class FormLogin(forms.Form):
    username = forms.CharField(max_length=64, widget=forms.TextInput(attrs={'placeholder':'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))

class FromCreateUser(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))
    repeat_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Repeat Password'}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'placeholder': 'Username'})
        self.fields['email'].widget.attrs.update({'placeholder': 'Email'})
        self.fields['latitude'].widget.attrs.update({'placeholder': 'Lat.'})
        self.fields['longitude'].widget.attrs.update({'placeholder': 'Long.'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'latitude', 'longitude', 'photo')