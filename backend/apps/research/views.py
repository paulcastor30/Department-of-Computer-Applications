from rest_framework import generics
from .models import ResearchProject, ConferenceRecord, PublicationRecord
from .serializers import ResearchProjectSerializer, ConferenceRecordSerializer, PublicationRecordSerializer


class ResearchProjectListView(generics.ListAPIView):
    queryset = ResearchProject.objects.filter(is_published=True)
    serializer_class = ResearchProjectSerializer


class ConferenceRecordListView(generics.ListAPIView):
    queryset = ConferenceRecord.objects.filter(is_published=True)
    serializer_class = ConferenceRecordSerializer


class PublicationRecordListView(generics.ListAPIView):
    queryset = PublicationRecord.objects.filter(is_published=True)
    serializer_class = PublicationRecordSerializer
