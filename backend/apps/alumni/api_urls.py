from django.urls import path
from .views import AccessAlumniView, RegisterAlumniView, AlumniConfigurationView, RequestUpdateLinkView, VerifyUpdateLinkView, SaveAlumniProfileView, AlumniOpportunityListView

urlpatterns = [
    path("register/", RegisterAlumniView.as_view(), name="alumni-register"),
    path("access/", AccessAlumniView.as_view(), name="alumni-access"),
    path("configuration/", AlumniConfigurationView.as_view(), name="alumni-configuration"),
    path("request-link/", RequestUpdateLinkView.as_view(), name="alumni-request-link"),
    path("verify-link/", VerifyUpdateLinkView.as_view(), name="alumni-verify-link"),
    path("profile/", SaveAlumniProfileView.as_view(), name="alumni-save-profile"),
    path("opportunities/", AlumniOpportunityListView.as_view(), name="alumni-opportunities"),
]
