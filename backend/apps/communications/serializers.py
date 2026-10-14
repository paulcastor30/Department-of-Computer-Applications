from rest_framework import serializers
from .models import NewsPost


class NewsPostSerializer(serializers.ModelSerializer):
    evidence_documents = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "summary",
            "body",
            "source_url",
            "featured_image",
            "published_at",
            "starts_on", "ends_on", "starts_at", "deadline_on", "location", "event_status",
            "featured",
            "is_published",
            "updated_at",
            "evidence_documents",
        ]