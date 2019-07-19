from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse

# Create your views here.



def classview(request):
    template = loader.get_template('ntiadmin/classtracker/classindex.html')


    return HttpResponse(template.render({}, request))