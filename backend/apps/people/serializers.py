from rest_framework import serializers
from .models import FacultyMember


class FacultyMemberSerializer(serializers.ModelSerializer):
    evidence_documents = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = FacultyMember
        fields = [
            "id",
            "title",
            "slug",
            "position",
            "email",
            "phone",
            "photo",
            "educational_background",
            "research_interests",
            "courses_taught",
            "certifications",
            "awards",
            "office",
            "featured",
            "is_published",
            "updated_at",
            "evidence_documents",
        ]