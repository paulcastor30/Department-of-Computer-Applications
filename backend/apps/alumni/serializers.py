from django.utils import timezone
from rest_framework import serializers
from .models import AlumniCareerEntry, AlumniProfile, AlumniOpportunity, CAREER_FIELDS


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
    career_entry_mode = serializers.ChoiceField(choices=["CURRENT", "HISTORICAL", "NO_CHANGE"], default="CURRENT", write_only=True)

    class Meta:
        model = AlumniProfile
        fields = ("full_name", "bsca_year", "msca_year", "interests", "preferred_contact", "phone", "receive_updates", "willing_to_mentor", "notice_version", "consent", "student_id", "family_name", "first_name", "middle_name", "permanent_address", "landline", "bsca_period", "msca_period", "sex", "residence_city", "residence_country", "network_interests", "professional_url", "career_entry_mode", *CAREER_FIELDS)

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
        start, end = data.get("career_start"), data.get("career_end")
        today = timezone.localdate()
        if (start and start > today) or (end and end > today):
            raise serializers.ValidationError({"career_start": "Use dates up to today for recorded career history."})
        if start and end and end < start:
            raise serializers.ValidationError({"career_end": "The end date must be on or after the start date."})
        if data.get("career_entry_mode") == "HISTORICAL" and not (data.get("job_title") or data.get("employer") or data.get("study_program") or data.get("duties")):
            raise serializers.ValidationError({"career_entry_mode": "Describe the previous role or activity before adding it to your history."})
        data.pop("consent")
        return data


class CareerEntryOutput(serializers.ModelSerializer):
    class Meta:
        model = AlumniCareerEntry
        fields = ("id", "reported_at", "entry_kind", *CAREER_FIELDS)


class ProfileOutput(serializers.ModelSerializer):
    career_history = CareerEntryOutput(many=True, read_only=True)

    class Meta:
        model = AlumniProfile
        fields = ("email", "full_name", "bsca_year", "msca_year", "interests", "preferred_contact", "phone", "receive_updates", "willing_to_mentor", "alumni_updated_at", "email_verified_at", "student_id", "family_name", "first_name", "middle_name", "permanent_address", "landline", "bsca_period", "msca_period", "sex", "residence_city", "residence_country", "network_interests", "professional_url", "career_history", *CAREER_FIELDS)


class AccessKeyInput(EmailInput):
    access_key = serializers.RegexField(r"^[A-Za-z0-9_-]{40,100}$", max_length=100, write_only=True)


class RegistrationInput(ProfileInput):
    email = serializers.EmailField(max_length=254)

    class Meta(ProfileInput.Meta):
        fields = ("email", *ProfileInput.Meta.fields)

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, data):
        data = super().validate(data)
        if data.get("career_entry_mode") != "CURRENT":
            raise serializers.ValidationError({"career_entry_mode": "Start with your current activity. You can add past roles after registering."})
        return data


class OpportunitySerializer(serializers.ModelSerializer):
    kind_label = serializers.CharField(source="get_kind_display", read_only=True)

    class Meta:
        model = AlumniOpportunity
        fields = ("slug", "title", "kind_label", "description", "provider", "url", "closes_on")
