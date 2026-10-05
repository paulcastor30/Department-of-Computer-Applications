from rest_framework import serializers
from .models import ExtensionProject


class ExtensionProjectSerializer(serializers.ModelSerializer):
    participant_groups = serializers.SerializerMethodField()

    class Meta:
        model = ExtensionProject
        fields = ["id", "slug", "title", "reporting_year", "extension_leader", "participant_groups"]

    def get_participant_groups(self, obj):
        groups = []
        for field, label in [("faculty_members", "MSU-IIT faculty"), ("lecturers", "Lecturers"), ("staff", "Staff"), ("research_assistants", "Research assistants"), ("students", "Students")]:
            members = list(dict.fromkeys(name.strip() for name in getattr(obj, field).splitlines() if name.strip()))
            if members:
                groups.append({"label": label, "members": members})
        return groups
