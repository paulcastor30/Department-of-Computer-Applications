from django.db.models import Count, Prefetch, Q
from rest_framework import generics
from .models import (
    FacultyContribution,
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
from .serializers import FacultyDirectorySerializer, FacultyMemberSerializer


CLASSIFICATION_ORDER = {
    FacultyMember.ServiceClassification.ACTIVE_DCA_FACULTY: 1,
    FacultyMember.ServiceClassification.AFFILIATED_MSCA_FACULTY: 2,
    FacultyMember.ServiceClassification.RETIRED_DCA_FACULTY: 3,
    FacultyMember.ServiceClassification.RESIGNED_DCA_FACULTY: 3.5,
    FacultyMember.ServiceClassification.ACADEMIC_STAFF: 4,
    FacultyMember.ServiceClassification.LABORATORY_PERSONNEL: 5,
}


def published_faculty_queryset():
    return FacultyMember.objects.filter(is_published=True).annotate(
        supervised_works_count=Count("supervised_works", filter=Q(supervised_works__is_published=True), distinct=True),
        publications_count=Count("publications", filter=Q(publications__is_published=True), distinct=True),
        research_projects_count=Count("research_projects", filter=Q(research_projects__is_published=True), distinct=True),
        extension_projects_count=Count(
            "extension_projects",
            filter=Q(extension_projects__is_published=True),
            distinct=True,
        ),
    )


class FacultyListView(generics.ListAPIView):
    serializer_class = FacultyDirectorySerializer

    def get_queryset(self):
        queryset = published_faculty_queryset()
        classification = self.request.query_params.get("classification")
        program = self.request.query_params.get("program")
        expertise = self.request.query_params.get("expertise")

        if classification:
            queryset = queryset.filter(service_classification=classification)
        if program:
            queryset = queryset.filter(supporting_programs__icontains=program)
        if expertise:
            queryset = queryset.filter(
                Q(specialization_areas__icontains=expertise)
                | Q(research_interests__icontains=expertise)
                | Q(teaching_areas__icontains=expertise)
                | Q(expertise_records__title__icontains=expertise, expertise_records__is_published=True)
            ).distinct()

        return sorted(
            queryset.order_by("sort_order", "title"),
            key=lambda faculty: (CLASSIFICATION_ORDER.get(faculty.service_classification, 99), faculty.sort_order, faculty.title),
        )


class FacultyDetailView(generics.RetrieveAPIView):
    serializer_class = FacultyMemberSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return published_faculty_queryset().prefetch_related(
            "evidence_documents",
            Prefetch("department_contributions", queryset=FacultyContribution.objects.filter(is_published=True).select_related("research", "publication", "conference", "extension")),
            Prefetch("education_records", queryset=FacultyEducation.objects.filter(is_published=True)),
            Prefetch("expertise_records", queryset=FacultyExpertise.objects.filter(is_published=True)),
            Prefetch("supervised_works", queryset=FacultySupervisedWork.objects.filter(is_published=True)),
            Prefetch("publications", queryset=FacultyPublication.objects.filter(is_published=True)),
            Prefetch("conferences", queryset=FacultyConference.objects.filter(is_published=True)),
            Prefetch("research_projects", queryset=FacultyResearchProject.objects.filter(is_published=True)),
            Prefetch("extension_projects", queryset=FacultyExtensionProject.objects.filter(is_published=True)),
            Prefetch("creative_works", queryset=FacultyCreativeWork.objects.filter(is_published=True)),
            Prefetch("training_seminars", queryset=FacultyTrainingSeminar.objects.filter(is_published=True)),
            Prefetch("achievements", queryset=FacultyAchievement.objects.filter(is_published=True)),
        )
