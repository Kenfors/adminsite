from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def tools(request):


    HttpResponse(render(request, "Hello Tools!"))

def ews(request):


    return HttpResponse(render(request, "Hello EWS!"))