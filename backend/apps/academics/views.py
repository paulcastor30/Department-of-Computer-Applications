from rest_framework import generics
from .models import Program
from .serializers import ProgramSerializer

class ProgramListView(generics.ListAPIView):
    queryset = Program.objects.filter(is_published=True).order_by("sort_order", "title")
    serializer_class = ProgramSerializer

class ProgramDetailView(generics.RetrieveAPIView):
    queryset = Program.objects.filter(is_published=True)
    serializer_class = ProgramSerializer
    lookup_field = "slug"