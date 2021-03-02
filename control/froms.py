from django import forms
from .models import Report

from maps.models import Help, HelpPhoto

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        exclude = ('user_that_report',)

class CreatePlace(forms.ModelForm):
    class Meta:
            model = Help
            exclude = ('organization','temporal_code','points_for_completed','comments')

class CreatePhoto(forms.ModelForm):
    class Meta:
        model = HelpPhoto
        fields = ('photo',)