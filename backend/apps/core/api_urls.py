from django.urls import path
from .views import SiteSettingsView, DepartmentProfileView, HomePayloadView

urlpatterns = [
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("department-profile/", DepartmentProfileView.as_view(), name="department-profile"),
    path("home/", HomePayloadView.as_view(), name="home-payload"),
]