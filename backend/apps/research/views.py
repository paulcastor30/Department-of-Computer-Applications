from rest_framework import generics
from .models import ResearchProject, ConferenceRecord
from .serializers import ResearchProjectSerializer, ConferenceRecordSerializer


class ResearchProjectListView(generics.ListAPIView):
    queryset = ResearchProject.objects.filter(is_published=True)
    serializer_class = ResearchProjectSerializer


class ConferenceRecordListView(generics.ListAPIView):
    queryset = ConferenceRecord.objects.filter(is_published=True)
    serializer_class = ConferenceRecordSerializer
