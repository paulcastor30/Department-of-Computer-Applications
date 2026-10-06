from rest_framework import generics
from .models import Program
from .serializers import ProgramSerializer

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
    queryset = SOJTGuide.objects.filter(is_published=True)
    serializer_class = SOJTGuideSerializer
    lookup_field = "slug"
