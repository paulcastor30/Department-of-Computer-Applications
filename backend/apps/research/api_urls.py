from django.urls import path
from .views import ResearchProjectListView, ConferenceRecordListView

urlpatterns = [
    path("projects/", ResearchProjectListView.as_view(), name="research-projects"),
    path("conferences/", ConferenceRecordListView.as_view(), name="research-conferences"),
]
