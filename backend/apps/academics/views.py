from rest_framework import generics
from django.conf import settings
from django.http import FileResponse, Http404
from django.views import View
from .models import Program, LearningResource
from .serializers import ProgramSerializer, LearningResourceSerializer


class LearningResourceListView(generics.ListAPIView):
    queryset = LearningResource.objects.filter(is_published=True)
    serializer_class = LearningResourceSerializer


class LearningCollectionDownloadView(View):
    """Serve the three public reuse files when Django serves the frontend."""
    def get(self, request, filename):
        if filename not in {"collection.json", "LICENSE.txt", "ATTRIBUTION.txt"}:
            raise Http404
        file = settings.REPO_DIR / "frontend" / "public" / "learning-resources" / filename
        if not file.is_file():
            raise Http404
        content_type = "application/json" if filename.endswith(".json") else "text/plain; charset=utf-8"
        return FileResponse(file.open("rb"), content_type=content_type)

class ProgramListView(generics.ListAPIView):
    queryset = Program.objects.filter(is_published=True).prefetch_related("documents").order_by("sort_order", "title")
    serializer_class = ProgramSerializer

class ProgramDetailView(generics.RetrieveAPIView):
    queryset = Program.objects.filter(is_published=True).prefetch_related("documents")
    serializer_class = ProgramSerializer
    lookup_field = "slug"


from .models import SOJTGuide
from .serializers import SOJTGuideSerializer


class SOJTGuideDetailView(generics.RetrieveAPIView):
    def get_object(self):
        from django.core.exceptions import ValidationError
        guide = super().get_object()
        try:
            guide.full_clean()
        except ValidationError:
            raise Http404("Internship guidance is unavailable.")
        return guide

    queryset = SOJTGuide.objects.filter(is_published=True)
    serializer_class = SOJTGuideSerializer
    lookup_field = "slug"
