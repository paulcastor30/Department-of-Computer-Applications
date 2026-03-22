from rest_framework import serializers
from .models import Program

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            "id",
            "code",
            "title",
            "slug",
            "degree_level",
            "overview",
            "career_opportunities",
            "admission_requirements",
            "faq_intro",
            "featured",
            "updated_at",
        ]