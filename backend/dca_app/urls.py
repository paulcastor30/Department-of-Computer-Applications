from django.urls import path
from .views import department_info

urlpatterns = [
    path("department/", department_info),
]
