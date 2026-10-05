from django.urls import path
from .views import ResearchProjectListView

urlpatterns = [path("projects/", ResearchProjectListView.as_view(), name="research-projects")]
