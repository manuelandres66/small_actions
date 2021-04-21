from django import forms
from .models import Organization

class NewOrganization(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['name'].widget.attrs.update({'placeholder': 'Nombre de la organización'})
        self.fields['phone_number'].widget.attrs.update({'placeholder': 'Teléfono de la organización'})
        self.fields['contact_name'].widget.attrs.update({'placeholder': 'Nombre de la persona a cargo'})
        self.fields['contact_phone_number'].widget.attrs.update({'placeholder': 'Teléfono de la persona a cargo'})
        self.fields['short_description'].widget.attrs.update({'placeholder': 'Descripción de la organización'})
        self.fields['quote'].widget.attrs.update({'placeholder': 'Lema de la organización sin comillas'})

        for field in self.fields.keys():
            self.fields[field].required = True
     
    class Meta:
        model = Organization
        exclude = ('user','instagram_photos','see')
