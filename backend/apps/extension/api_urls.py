from django.urls import path
from .views import ExtensionProjectListView

urlpatterns = [path("projects/", ExtensionProjectListView.as_view(), name="extension-projects")]
