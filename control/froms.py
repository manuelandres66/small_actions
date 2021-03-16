from django import forms
from django.db import models
from django.db.models import fields
from .models import Report

from maps.models import Help, HelpPhoto
from info.models import Organization, InstagramPublication

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        exclude = ('user_that_report',)

class CreatePlace(forms.ModelForm):
    class Meta:
            model = Help
            exclude = ('organization','temporal_code','points_for_completed','comments','views')

class CreatePhoto(forms.ModelForm):
    class Meta:
        model = HelpPhoto
        fields = ('photo',)

class EditOrg(forms.ModelForm):
    class Meta:
        model = Organization
        exclude = ('user', 'see', 'instagram_photos', 'contact_name', 'contact_phone_number')

class EditInstagram(forms.ModelForm):
    class Meta:
        model = InstagramPublication
        fields = ('url',)