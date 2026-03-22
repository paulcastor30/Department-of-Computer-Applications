from django.urls import path
from .views import FacultyListView, FacultyDetailView

urlpatterns = [
    path("faculty/", FacultyListView.as_view(), name="faculty-list"),
    path("faculty/<slug:slug>/", FacultyDetailView.as_view(), name="faculty-detail"),
]