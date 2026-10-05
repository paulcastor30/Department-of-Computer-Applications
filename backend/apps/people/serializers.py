from rest_framework import serializers
from .models import (
    FacultyAchievement,
    FacultyConference,
    FacultyCreativeWork,
    FacultyEducation,
    FacultyExpertise,
    FacultyExtensionProject,
    FacultyMember,
    FacultyPublication,
    FacultyResearchProject,
    FacultySupervisedWork,
    FacultyTrainingSeminar,
)


class FacultyDirectorySerializer(serializers.ModelSerializer):
    personnel_type_display = serializers.CharField(source="get_personnel_type_display", read_only=True)
    faculty_status_display = serializers.CharField(source="get_faculty_status_display", read_only=True)
    service_classification_display = serializers.CharField(source="get_service_classification_display", read_only=True)
    supervised_works_count = serializers.IntegerField(read_only=True)
    publications_count = serializers.IntegerField(read_only=True)
    research_projects_count = serializers.IntegerField(read_only=True)
    extension_projects_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = FacultyMember
        fields = [
            "id",
            "title",
            "slug",
            "personnel_type",
            "personnel_type_display",
            "service_classification",
            "service_classification_display",
            "faculty_status",
            "faculty_status_display",
            "prc_license_number",
            "position",
            "employment_classification",
            "faculty_category",
            "highest_degree",
            "profile_summary",
            "email",
            "phone",
            "photo",
            "specialization_areas",
            "research_interests",
            "courses_taught",
            "teaching_areas",
            "office",
            "home_unit",
            "supporting_programs",
            "msca_roles",
            "active_affiliation",
            "transferred_from_dca",
            "seo_title",
            "seo_description",
            "og_title",
            "og_description",
            "featured",
            "is_published",
            "sort_order",
            "updated_at",
            "last_updated_note",
            "supervised_works_count",
            "publications_count",
            "research_projects_count",
            "extension_projects_count",
        ]


class FacultyEducationSerializer(serializers.ModelSerializer):
    degree_level_display = serializers.CharField(source="get_degree_level_display", read_only=True)

    class Meta:
        model = FacultyEducation
        exclude = ["faculty"]


class FacultyExpertiseSerializer(serializers.ModelSerializer):
    expertise_type_display = serializers.CharField(source="get_expertise_type_display", read_only=True)

    class Meta:
        model = FacultyExpertise
        exclude = ["faculty"]


class FacultySupervisedWorkSerializer(serializers.ModelSerializer):
    program_level_display = serializers.CharField(source="get_program_level_display", read_only=True)

    class Meta:
        model = FacultySupervisedWork
        exclude = ["faculty"]


class FacultyPublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyPublication
        exclude = ["faculty"]


class FacultyConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyConference
        exclude = ["faculty"]


class FacultyResearchProjectSerializer(serializers.ModelSerializer):
    funding_type_display = serializers.CharField(source="get_funding_type_display", read_only=True)

    class Meta:
        model = FacultyResearchProject
        exclude = ["faculty"]


class FacultyExtensionProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyExtensionProject
        exclude = ["faculty"]


class FacultyCreativeWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyCreativeWork
        exclude = ["faculty"]


class FacultyTrainingSeminarSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyTrainingSeminar
        exclude = ["faculty"]


class FacultyAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyAchievement
        exclude = ["faculty"]


class FacultyMemberSerializer(FacultyDirectorySerializer):
    department_contributions = serializers.SerializerMethodField()

    def get_department_contributions(self, member):
        result = []
        paths = {"research": "/research", "publication": "/research/publications", "conference": "/research/conferences", "extension": "/extension"}
        for credit in member.department_contributions.all():
            for kind, path in paths.items():
                record = getattr(credit, kind)
                if record is not None and credit.is_published and record.is_published:
                    result.append({"id": credit.pk, "kind": kind, "title": record.title, "year": str(getattr(record, "reporting_year", getattr(record, "year", ""))), "role": credit.role, "href": path + "#" + record.slug, "withdrawn": getattr(record, "withdrawn", False), "doi": getattr(record, "doi", "")})
        return sorted(result, key=lambda item: (item["year"], item["title"]), reverse=True)

    evidence_documents = serializers.StringRelatedField(many=True, read_only=True)
    education_records = FacultyEducationSerializer(many=True, read_only=True)
    expertise_records = FacultyExpertiseSerializer(many=True, read_only=True)
    supervised_works = FacultySupervisedWorkSerializer(many=True, read_only=True)
    publications = FacultyPublicationSerializer(many=True, read_only=True)
    conferences = FacultyConferenceSerializer(many=True, read_only=True)
    research_projects = FacultyResearchProjectSerializer(many=True, read_only=True)
    extension_projects = FacultyExtensionProjectSerializer(many=True, read_only=True)
    creative_works = FacultyCreativeWorkSerializer(many=True, read_only=True)
    training_seminars = FacultyTrainingSeminarSerializer(many=True, read_only=True)
    achievements = FacultyAchievementSerializer(many=True, read_only=True)

    class Meta(FacultyDirectorySerializer.Meta):
        fields = FacultyDirectorySerializer.Meta.fields + [
            "educational_background",
            "advising_areas",
            "certifications",
            "awards",
            "appointment_or_assignment_note",
            "start_year",
            "end_year",
            "evidence_documents",
            "education_records",
            "department_contributions",
            "expertise_records",
            "supervised_works",
            "publications",
            "conferences",
            "research_projects",
            "extension_projects",
            "creative_works",
            "training_seminars",
            "achievements",
        ]
