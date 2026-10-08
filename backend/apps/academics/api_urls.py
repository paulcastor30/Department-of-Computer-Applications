from django.urls import path
from .views import ProgramListView, ProgramDetailView, SOJTGuideDetailView

from .form_views import BSCAFormView, MSCAFormView, RegistrarFormListView, RegistrarFormView

urlpatterns = [
    path("forms/registrar/", RegistrarFormListView.as_view(), name="registrar-forms"),
    path("forms/registrar/<slug:form_id>/", RegistrarFormView.as_view(), name="registrar-form-fill"),
    path("forms/bsca/<slug:form_id>/", BSCAFormView.as_view(), name="bsca-form-fill"),
    path("forms/msca/<slug:form_id>/", MSCAFormView.as_view(), name="msca-form-fill"),
    path("sojt-guide/<slug:slug>/", SOJTGuideDetailView.as_view(), name="sojt-guide"),
    path("programs/", ProgramListView.as_view(), name="program-list"),
    path("programs/<slug:slug>/", ProgramDetailView.as_view(), name="program-detail"),
]
