from django import forms
from .models import Comment

class FromCode(forms.Form):
    first = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'XXX'}))
    second = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'000'}))
    third = forms.CharField(max_length=3, widget=forms.TextInput(attrs={'placeholder':'XXX'}))

class CommentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['comment'].widget.attrs.update({'placeholder': 'Agrega un comentario'})

    class Meta:
        model = Comment
        fields = ('comment', ) 