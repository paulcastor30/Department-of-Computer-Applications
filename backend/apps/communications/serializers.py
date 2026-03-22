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
            "featured_image",
            "published_at",
            "featured",
            "is_published",
            "updated_at",
            "evidence_documents",
        ]