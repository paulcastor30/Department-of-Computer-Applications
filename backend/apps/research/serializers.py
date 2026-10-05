from rest_framework import serializers
from .models import ResearchProject, ConferenceRecord, PublicationRecord


class ResearchProjectSerializer(serializers.ModelSerializer):
    team_members = serializers.SerializerMethodField()
    funding_display = serializers.CharField(source="get_funding_display", read_only=True)

    class Meta:
        model = ResearchProject
        fields = ["id", "slug", "title", "reporting_year", "research_leader", "team_members", "funding_display"]

    def get_team_members(self, obj):
        return list(dict.fromkeys(name.strip() for name in obj.team_members.splitlines() if name.strip()))


class ConferenceRecordSerializer(serializers.ModelSerializer):
    scope_display = serializers.CharField(source="get_scope_display", read_only=True)

    class Meta:
        model = ConferenceRecord
        fields = ["id", "slug", "title", "year", "authors", "conference", "date_label", "starts_on", "ends_on", "location", "scope_display", "withdrawn"]


class PublicationRecordSerializer(serializers.ModelSerializer):
    kind_display = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = PublicationRecord
        fields = ["id", "slug", "title", "year", "authors", "venue", "kind", "kind_display", "citation_details", "date_label", "publisher", "doi", "source_url"]
