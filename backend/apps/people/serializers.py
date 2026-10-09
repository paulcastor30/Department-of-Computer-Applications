from .institutions import normalize_education_institution
from rest_framework import serializers
from .models import (
    DepartmentRole,
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


class DepartmentRoleSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    name = serializers.CharField(source="person.title", read_only=True)
    slug = serializers.CharField(source="person.slug", read_only=True)
    email = serializers.EmailField(source="person.email", read_only=True)
    phone = serializers.CharField(source="person.phone", read_only=True)
    office = serializers.CharField(source="person.office", read_only=True)

    class Meta:
        model = DepartmentRole
        fields = ["id", "role", "role_display", "name", "slug", "email", "phone", "office"]


class FacultyDirectorySerializer(serializers.ModelSerializer):
    highest_degree = serializers.SerializerMethodField()
    specialization_areas = serializers.SerializerMethodField()

    def get_highest_degree(self, member):
        levels = {row.degree_level for row in member.education_records.all() if row.is_published and row.academic_status == "completed" and row.verification_reference.strip()}
        for level, label in [("doctorate", "Doctoral Degree"), ("masters", "Master’s Degree"), ("bachelors", "Bachelor’s Degree")]:
            if level in levels:
                return label
        return ""

    def get_specialization_areas(self, member):
        records = [row for row in member.expertise_records.all() if row.expertise_type == "expertise"]
        if records:
            return "\n".join(row.title for row in records if row.is_published)
        return member.specialization_areas

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in ("phone", "office"):
            if str(data.get(field, "")).strip().casefold() in {"n/a", "n/a n/a", "na", "---"}:
                data[field] = ""
        return data

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
            "supervised_works_count",
            "publications_count",
            "research_projects_count",
            "extension_projects_count",
        ]


class FacultyEducationSerializer(serializers.ModelSerializer):
    institution = serializers.SerializerMethodField()

    def get_institution(self, record):
        return normalize_education_institution(record.institution)

    degree_level_display = serializers.CharField(source="get_degree_level_display", read_only=True)

    class Meta:
        model = FacultyEducation
        fields = ["id", "degree_level", "degree_level_display", "degree_name", "field_or_specialization", "institution", "year_completed", "academic_status"]


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
        exclude = ["faculty", "reconciled_contribution"]


class FacultyConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyConference
        exclude = ["faculty", "reconciled_contribution"]


class FacultyResearchProjectSerializer(serializers.ModelSerializer):
    funding_type_display = serializers.CharField(source="get_funding_type_display", read_only=True)

    class Meta:
        model = FacultyResearchProject
        exclude = ["faculty", "reconciled_contribution"]


class FacultyExtensionProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyExtensionProject
        exclude = ["faculty", "reconciled_contribution"]


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
        paths = {"research": "/research/projects", "publication": "/research/publications", "conference": "/research/conferences", "extension": "/extension"}
        for credit in member.department_contributions.all():
            for kind, path in paths.items():
                record = getattr(credit, kind)
                if record is not None and credit.is_published and record.is_published:
                    result.append({"id": credit.pk, "kind": kind, "title": record.title, "year": str(getattr(record, "reporting_year", getattr(record, "year", ""))), "role": credit.role, "href": path + "#" + record.slug, "withdrawn": getattr(record, "withdrawn", False), "doi": getattr(record, "doi", "")})
        return sorted(result, key=lambda item: (item["year"], item["title"]), reverse=True)

    evidence_documents = serializers.StringRelatedField(many=True, read_only=True)
    education_records = FacultyEducationSerializer(many=True, read_only=True)
    educational_background = serializers.SerializerMethodField()
    expertise_records = serializers.SerializerMethodField()

    def get_educational_background(self, member):
        # Legacy free text cannot bypass the approved structured education boundary.
        return ""

    def get_expertise_records(self, member):
        records = [row for row in member.expertise_records.all() if row.is_published]
        return FacultyExpertiseSerializer(records, many=True, context=self.context).data
    supervised_works = FacultySupervisedWorkSerializer(many=True, read_only=True)
    publications = serializers.SerializerMethodField()

    def get_publications(self, member):
        records = [row for row in member.publications.all() if row.is_published and not row.reconciled_contribution_id]
        return FacultyPublicationSerializer(records, many=True, context=self.context).data
    conferences = serializers.SerializerMethodField()

    def get_conferences(self, member):
        records = [row for row in member.conferences.all() if row.is_published and not row.reconciled_contribution_id]
        return FacultyConferenceSerializer(records, many=True, context=self.context).data
    research_projects = serializers.SerializerMethodField()

    def get_research_projects(self, member):
        records = [row for row in member.research_projects.all() if row.is_published and not row.reconciled_contribution_id]
        return FacultyResearchProjectSerializer(records, many=True, context=self.context).data
    extension_projects = serializers.SerializerMethodField()

    def get_extension_projects(self, member):
        records = [row for row in member.extension_projects.all() if row.is_published and not row.reconciled_contribution_id]
        return FacultyExtensionProjectSerializer(records, many=True, context=self.context).data
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
