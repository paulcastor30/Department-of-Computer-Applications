from django.utils import timezone
from rest_framework import serializers
from .models import AlumniProfile, AlumniOpportunity


class EmailInput(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return value.strip().lower()


class TokenInput(serializers.Serializer):
    token = serializers.RegexField(r"^[A-Za-z0-9_-]{40,100}$", max_length=100)


class ProfileInput(serializers.ModelSerializer):
    consent = serializers.BooleanField(write_only=True)
    receive_updates = serializers.BooleanField(default=False)
    willing_to_mentor = serializers.BooleanField(default=False)
    bsca_year = serializers.IntegerField(required=False, allow_null=True, min_value=1900)
    msca_year = serializers.IntegerField(required=False, allow_null=True, min_value=1900)

    class Meta:
        model = AlumniProfile
        fields = ("full_name", "bsca_year", "msca_year", "career_status", "employer", "job_title", "interests", "preferred_contact", "phone", "receive_updates", "willing_to_mentor", "notice_version", "consent")

    def validate(self, data):
        if not data.get("consent"):
            raise serializers.ValidationError({"consent": "Please read and accept the privacy notice to save your details."})
        if not data.get("bsca_year") and not data.get("msca_year"):
            raise serializers.ValidationError({"bsca_year": "Enter a graduation year for BSCA, MSCA, or both."})
        for field in ("bsca_year", "msca_year"):
            if data.get(field) and data[field] > timezone.localdate().year:
                raise serializers.ValidationError({field: "Use a graduation year up to the current year."})
        if data.get("preferred_contact", "EMAIL") == "PHONE" and not data.get("phone", "").strip():
            raise serializers.ValidationError({"phone": "Enter a phone number or choose email."})
        if data.get("career_status") not in {"EMPLOYED", "SELF_EMPLOYED"}:
            data["employer"] = ""
            data["job_title"] = ""
        data.pop("consent")
        return data


class ProfileOutput(serializers.ModelSerializer):
    class Meta:
        model = AlumniProfile
        fields = ("email", "full_name", "bsca_year", "msca_year", "career_status", "employer", "job_title", "interests", "preferred_contact", "phone", "receive_updates", "willing_to_mentor", "alumni_updated_at")


class OpportunitySerializer(serializers.ModelSerializer):
    kind_label = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = AlumniOpportunity
        fields = ("slug", "title", "kind_label", "description", "provider", "url", "closes_on")
