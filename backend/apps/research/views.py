from rest_framework import generics
from .models import ResearchProject
from .serializers import ResearchProjectSerializer


class ResearchProjectListView(generics.ListAPIView):
    queryset = ResearchProject.objects.filter(is_published=True)
    serializer_class = ResearchProjectSerializer
