from rest_framework import serializers
from .models import Program, ProgramDocument


class ProgramDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source="get_document_type_display", read_only=True)
    file_url = serializers.SerializerMethodField()
    href = serializers.SerializerMethodField()

    class Meta:
        model = ProgramDocument
        fields = [
            "id",
            "title",
            "document_type",
            "document_type_display",
            "file_url",
            "url",
            "href",
            "note",
            "sort_order",
            "updated_at",
        ]

    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get("request")
            url = obj.file.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_href(self, obj):
        return self.get_file_url(obj) or obj.url or ""

class ProgramSerializer(serializers.ModelSerializer):
    degree_level_display = serializers.CharField(source="get_degree_level_display", read_only=True)
    program_goals_list = serializers.SerializerMethodField()
    program_educational_objectives_list = serializers.SerializerMethodField()
    outcomes_list = serializers.SerializerMethodField()
    academic_areas_list = serializers.SerializerMethodField()
    specialization_tracks_list = serializers.SerializerMethodField()
    curriculum_structure_list = serializers.SerializerMethodField()
    thesis_information_list = serializers.SerializerMethodField()
    student_support_list = serializers.SerializerMethodField()
    curriculum_evidence_list = serializers.SerializerMethodField()
    quality_evidence_list = serializers.SerializerMethodField()
    career_opportunities_list = serializers.SerializerMethodField()
    admission_requirements_list = serializers.SerializerMethodField()
    progression_requirements_list = serializers.SerializerMethodField()
    historical_notes_list = serializers.SerializerMethodField()
    curriculum_pdf_url = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()

    class Meta:
        model = Program
        fields = [
            "id",
            "code",
            "title",
            "slug",
            "degree_level",
            "degree_level_display",
            "overview",
            "formal_description",
            "academic_orientation",
            "intended_learners",
            "culminating_requirement",
            "duration",
            "curriculum_load",
            "recognition",
            "program_goals",
            "program_goals_list",
            "program_educational_objectives",
            "program_educational_objectives_list",
            "outcomes",
            "outcomes_list",
            "academic_areas",
            "academic_areas_list",
            "specialization_tracks",
            "specialization_tracks_list",
            "curriculum_structure",
            "curriculum_structure_list",
            "thesis_information",
            "thesis_information_list",
            "student_support",
            "student_support_list",
            "contact_information",
            "curriculum_evidence",
            "curriculum_evidence_list",
            "quality_evidence",
            "quality_evidence_list",
            "career_opportunities",
            "career_opportunities_list",
            "admission_requirements",
            "admission_requirements_list",
            "progression_requirements",
            "progression_requirements_list",
            "historical_notes",
            "historical_notes_list",
            "faq_intro",
            "curriculum_pdf_url",
            "documents",
            "seo_title",
            "seo_description",
            "og_title",
            "og_description",
            "canonical_url",
            "is_published",
            "featured",
            "sort_order",
            "updated_at",
        ]

    def _lines(self, value):
        return [line.strip() for line in (value or "").splitlines() if line.strip()]

    def get_outcomes_list(self, obj):
        return self._lines(obj.outcomes)

    def get_program_goals_list(self, obj):
        return self._lines(obj.program_goals)

    def get_program_educational_objectives_list(self, obj):
        return self._lines(obj.program_educational_objectives)

    def get_academic_areas_list(self, obj):
        return self._lines(obj.academic_areas)

    def get_specialization_tracks_list(self, obj):
        return self._lines(obj.specialization_tracks)

    def get_curriculum_structure_list(self, obj):
        return self._lines(obj.curriculum_structure)

    def get_thesis_information_list(self, obj):
        return self._lines(obj.thesis_information)

    def get_student_support_list(self, obj):
        return self._lines(obj.student_support)

    def get_curriculum_evidence_list(self, obj):
        return self._lines(obj.curriculum_evidence)

    def get_quality_evidence_list(self, obj):
        return self._lines(obj.quality_evidence)

    def get_career_opportunities_list(self, obj):
        return self._lines(obj.career_opportunities)

    def get_admission_requirements_list(self, obj):
        return self._lines(obj.admission_requirements)

    def get_progression_requirements_list(self, obj):
        return self._lines(obj.progression_requirements)

    def get_historical_notes_list(self, obj):
        return self._lines(obj.historical_notes)

    def get_curriculum_pdf_url(self, obj):
        if obj.curriculum_pdf:
            request = self.context.get("request")
            url = obj.curriculum_pdf.url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_documents(self, obj):
        documents = obj.documents.filter(is_public=True)
        return ProgramDocumentSerializer(documents, many=True, context=self.context).data
