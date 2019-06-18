from django import forms
from django.forms import ModelForm, CheckboxSelectMultiple, SelectMultiple, HiddenInput
from ntiadmin import metadata
from ntiadmin import models

OPT_COURSE  = 0
OPT_STUDENT = 1
OPT_TEACHER = 2

TABLE_CHOICE = [
    (-1, '-----'),
    (0, 'Kurs'),
    (1, 'Elev'),
    (2, 'Lärare')
]

class EWSChoiceForm(forms.Form):
    ewsoption_teacher = forms.ChoiceField(
        choices=TABLE_CHOICE, 
        label="Teacher:",
        initial=None, 
        required=True,  
        widget=forms.Select(attrs={'onchange': 'this.form.submit();'}))
    ewsoption_class = forms.ChoiceField(
        choices=metadata.CLASSES, 
        label="Class:",
        initial=-1,
        required=True,  
        widget=forms.Select(attrs={'onchange': 'this.form.submit();'}))
    ewsoption_course = forms.ChoiceField(
        choices=metadata.COURSES, 
        label="Course:",
        initial=-1,
        required=True,  
        widget=forms.Select(attrs={'onchange': 'this.form.submit();'}))

class EWSSubmissionForm(forms.Form):
    student = forms.CharField(disabled=True)
    course = forms.CharField(disabled=True)
    enroll = forms.IntegerField(widget=forms.HiddenInput())
    ewscolor = forms.ChoiceField(choices=metadata.EWS_VALUES, label="Färgmarkering", required=True, initial=0)
    ewshelper = forms.MultipleChoiceField(choices=metadata.EWS_ADAPTION,label="Extra anpassningar", required=False, widget=CheckboxSelectMultiple)    


class EWSSubmissionForm2(forms.Form):
    ewscolor = forms.ChoiceField(choices=metadata.EWS_VALUES, label="Färgmarkering", required=True, initial=0)
    ewshelper = forms.MultipleChoiceField(choices=metadata.EWS_ADAPTION,label="Extra anpassningar", required=False, widget=CheckboxSelectMultiple)
