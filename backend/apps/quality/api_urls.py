from django.urls import path
from .views import EvidenceDocumentListView, EvidenceDocumentDetailView

urlpatterns = [
    path("evidence/", EvidenceDocumentListView.as_view(), name="evidence-list"),
    path("evidence/<int:pk>/", EvidenceDocumentDetailView.as_view(), name="evidence-detail"),
]