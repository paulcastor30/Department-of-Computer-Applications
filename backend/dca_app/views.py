from django.shortcuts import render

# Create your views here.
# dca_app/views.py
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.generic import TemplateView

@api_view(["GET"])
def department_info(request):
    return Response({"name": "Department of Computer Applications"})

class FrontendAppView(TemplateView):
    template_name = "index.html"
