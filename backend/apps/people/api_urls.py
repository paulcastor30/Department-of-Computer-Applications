from django.urls import path
from .views import DepartmentOrganizationView, FacultyListView, FacultyDetailView

urlpatterns = [
    path("organization/", DepartmentOrganizationView.as_view(), name="department-organization"),
    path("faculty/", FacultyListView.as_view(), name="faculty-list"),
    path("faculty/<slug:slug>/", FacultyDetailView.as_view(), name="faculty-detail"),
]
