from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
# Create your views here.

def tools(request):


    HttpResponse(render(request, "Hello Tools!"))

def ews(request):
    response = loader.get_template('ntiadmin/ews/ews_table.html')

    return HttpResponse(response.render())

