from django.urls import path
from .views import ProgramListView, ProgramDetailView, SOJTGuideDetailView

urlpatterns = [
    path("sojt-guide/<slug:slug>/", SOJTGuideDetailView.as_view(), name="sojt-guide"),
    path("programs/", ProgramListView.as_view(), name="program-list"),
    path("programs/<slug:slug>/", ProgramDetailView.as_view(), name="program-detail"),
]