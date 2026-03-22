from rest_framework import serializers
from .models import SiteSetting, DepartmentProfile, HeroSection, QuickStat


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            "id",
            "site_name",
            "short_name",
            "primary_email",
            "primary_phone",
            "address",
            "facebook_url",
            "youtube_url",
            "linkedin_url",
            "updated_at",
        ]


class DepartmentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentProfile
        fields = [
            "id",
            "title",
            "overview",
            "vision",
            "mission",
            "goals",
            "outcomes_mapping_note",
            "updated_at",
        ]


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = [
            "id",
            "title",
            "slug",
            "eyebrow",
            "subtitle",
            "primary_cta_label",
            "primary_cta_url",
            "secondary_cta_label",
            "secondary_cta_url",
            "background_image",
            "featured",
            "is_published",
            "sort_order",
            "updated_at",
        ]


class QuickStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickStat
        fields = [
            "id",
            "label",
            "value",
            "note",
            "sort_order",
            "updated_at",
        ]