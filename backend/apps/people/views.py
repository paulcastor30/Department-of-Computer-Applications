from rest_framework import generics
from .models import FacultyMember
from .serializers import FacultyMemberSerializer


class FacultyListView(generics.ListAPIView):
    queryset = FacultyMember.objects.filter(is_published=True).order_by("sort_order", "title")
    serializer_class = FacultyMemberSerializer


class FacultyDetailView(generics.RetrieveAPIView):
    queryset = FacultyMember.objects.filter(is_published=True)
    serializer_class = FacultyMemberSerializer
    lookup_field = "slug"