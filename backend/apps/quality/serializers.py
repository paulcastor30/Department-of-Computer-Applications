from rest_framework import serializers
from .models import EvidenceDocument


class EvidenceDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvidenceDocument
        fields = [
            "id",
            "framework",
            "area_code",
            "title",
            "description",
            "file",
            "last_updated",
            "is_public_placeholder",
        ]