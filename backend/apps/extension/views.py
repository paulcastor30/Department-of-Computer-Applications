from rest_framework import generics
from .models import ExtensionProject
from .serializers import ExtensionProjectSerializer


class ExtensionProjectListView(generics.ListAPIView):
    queryset = ExtensionProject.objects.filter(is_published=True)
    serializer_class = ExtensionProjectSerializer
