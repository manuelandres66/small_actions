from django import forms

class FromCode(forms.Form):
    first = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'XXX'}))
    second = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'000'}))
    third = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'XXX'}))