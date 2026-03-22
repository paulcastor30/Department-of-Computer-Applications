from rest_framework import generics
from .models import EvidenceDocument
from .serializers import EvidenceDocumentSerializer


class EvidenceDocumentListView(generics.ListAPIView):
    serializer_class = EvidenceDocumentSerializer

    def get_queryset(self):
        queryset = EvidenceDocument.objects.filter(is_public_placeholder=True).order_by(
            "framework", "area_code", "title"
        )

        framework = self.request.query_params.get("framework")
        area_code = self.request.query_params.get("area_code")

        if framework:
            queryset = queryset.filter(framework=framework)
        if area_code:
            queryset = queryset.filter(area_code__icontains=area_code)

        return queryset


class EvidenceDocumentDetailView(generics.RetrieveAPIView):
    queryset = EvidenceDocument.objects.filter(is_public_placeholder=True)
    serializer_class = EvidenceDocumentSerializer
    lookup_field = "pk"