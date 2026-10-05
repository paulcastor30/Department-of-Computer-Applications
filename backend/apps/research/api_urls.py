from django.urls import path
from .views import ResearchProjectListView, ConferenceRecordListView, PublicationRecordListView

urlpatterns = [
    path("publications/", PublicationRecordListView.as_view(), name="research-publications"),
    path("projects/", ResearchProjectListView.as_view(), name="research-projects"),
    path("conferences/", ConferenceRecordListView.as_view(), name="research-conferences"),
]
