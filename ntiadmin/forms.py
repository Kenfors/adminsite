from django import forms
from django.forms import ModelForm
from ntiadmin.models import EWSSubmission

class EWS_submissionForm(forms.ModelForm):
    
    class Meta:
        model = EWS_submission
        fields = ("",)
