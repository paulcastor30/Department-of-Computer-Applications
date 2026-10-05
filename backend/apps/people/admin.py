from django.contrib import admin
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


@admin.action(description="Mark selected faculty members as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.action(description="Mark selected faculty members as unpublished")
def mark_unpublished(modeladmin, request, queryset):
    queryset.update(is_published=False)


class PublishedRecordInline(admin.TabularInline):
    extra = 0
    show_change_link = True
    fields = ("title", "is_published", "sort_order")


class FacultyEducationInline(admin.StackedInline):
    model = FacultyEducation
    extra = 0
    fields = (
        "degree_level",
        "degree_name",
        "field_or_specialization",
        "institution",
        "year_completed",
        "notes",
        "is_published",
        "sort_order",
    )


class FacultyExpertiseInline(admin.TabularInline):
    model = FacultyExpertise
    extra = 0
    fields = ("expertise_type", "title", "description", "is_published", "sort_order")


class FacultySupervisedWorkInline(admin.StackedInline):
    model = FacultySupervisedWork
    extra = 0
    fields = (
        "program_level",
        "title",
        "researchers",
        "adviser",
        "co_adviser",
        "abstract",
        "award",
        "academic_year",
        "completion_year",
        "faculty_role",
        "evidence_url",
        "is_published",
        "sort_order",
    )


class FacultyPublicationInline(admin.StackedInline):
    model = FacultyPublication
    extra = 0
    fields = (
        "title",
        "authors",
        "venue",
        "publication_type",
        "publication_date",
        "year",
        "doi",
        "url",
        "indexing_note",
        "citation_text",
        "is_published",
        "sort_order",
    )


class FacultyConferenceInline(admin.StackedInline):
    model = FacultyConference
    extra = 0


class FacultyResearchProjectInline(admin.StackedInline):
    model = FacultyResearchProject
    extra = 0


class FacultyExtensionProjectInline(admin.StackedInline):
    model = FacultyExtensionProject
    extra = 0


class FacultyCreativeWorkInline(admin.StackedInline):
    model = FacultyCreativeWork
    extra = 0


class FacultyTrainingSeminarInline(admin.StackedInline):
    model = FacultyTrainingSeminar
    extra = 0


class FacultyAchievementInline(admin.StackedInline):
    model = FacultyAchievement
    extra = 0


@admin.register(FacultyMember)
class FacultyMemberAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "service_classification",
        "faculty_status",
        "transferred_from_dca",
        "position",
        "home_unit",
        "supporting_programs",
        "email",
        "is_published",
        "featured",
        "sort_order",
        "updated_at",
    )
    list_filter = (
        "is_published",
        "featured",
        "personnel_type",
        "transferred_from_dca",
        "service_classification",
        "faculty_status",
        "position",
        "employment_classification",
        "faculty_category",
        "home_unit",
        "supporting_programs",
    )
    search_fields = (
        "title",
        "position",
        "highest_degree",
        "email",
        "home_unit",
        "supporting_programs",
        "msca_roles",
        "profile_summary",
        "specialization_areas",
        "research_interests",
        "educational_background",
        "courses_taught",
        "advising_areas",
    )
    ordering = ("sort_order", "title")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    actions = [mark_published, mark_unpublished]
    inlines = [
        FacultyEducationInline,
        FacultyExpertiseInline,
        FacultySupervisedWorkInline,
        FacultyPublicationInline,
        FacultyConferenceInline,
        FacultyResearchProjectInline,
        FacultyExtensionProjectInline,
        FacultyCreativeWorkInline,
        FacultyTrainingSeminarInline,
        FacultyAchievementInline,
    ]
    fieldsets = (
        (
            "Identity and Classification",
            {
                "fields": (
                    "title",
                    "slug",
                    "personnel_type",
                    "service_classification",
                    "faculty_status",
                    "position",
                    "employment_classification",
                    "faculty_category",
                    "highest_degree",
                    "prc_license_number",
                    "photo",
                    "active_affiliation",
                    "transferred_from_dca",
                    "start_year",
                    "end_year",
                )
            },
        ),
        (
            "Public Contact",
            {
                "fields": (
                    "email",
                    "phone",
                    "office",
                )
            },
        ),
        (
            "Affiliation and MSCA Support",
            {
                "fields": (
                    "home_unit",
                    "supporting_programs",
                    "msca_roles",
                    "appointment_or_assignment_note",
                )
            },
        ),
        (
            "Academic and Professional Profile Summary",
            {
                "fields": (
                    "profile_summary",
                    "educational_background",
                    "specialization_areas",
                    "research_interests",
                    "courses_taught",
                    "teaching_areas",
                    "advising_areas",
                    "certifications",
                    "awards",
                )
            },
        ),
        (
            "Evidence Documents",
            {
                "fields": ("evidence_documents",),
            },
        ),
        (
            "Publishing and Display",
            {
                "fields": (
                    "is_published",
                    "featured",
                    "sort_order",
                    "last_updated_note",
                )
            },
        ),
        (
            "SEO Metadata",
            {
                "classes": ("collapse",),
                "fields": (
                    "seo_title",
                    "seo_description",
                    "og_title",
                    "og_description",
                ),
            },
        ),
        (
            "System",
            {
                "classes": ("collapse",),
                "fields": ("created_at", "updated_at"),
            },
        ),
    )


class FacultyRecordAdmin(admin.ModelAdmin):
    list_display = ("title", "faculty", "is_published", "sort_order", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "faculty__title")
    ordering = ("faculty__title", "sort_order", "title")
    readonly_fields = ("created_at", "updated_at")


@admin.register(FacultyEducation)
class FacultyEducationAdmin(admin.ModelAdmin):
    list_display = ("faculty", "degree_level", "degree_name", "institution", "year_completed", "is_published", "sort_order")
    list_filter = ("degree_level", "year_completed", "is_published")
    search_fields = ("faculty__title", "degree_name", "field_or_specialization", "institution")
    ordering = ("faculty__title", "sort_order", "degree_level")
    readonly_fields = ("created_at", "updated_at")


@admin.register(FacultyExpertise)
class FacultyExpertiseAdmin(FacultyRecordAdmin):
    list_filter = ("expertise_type", "is_published")


@admin.register(FacultySupervisedWork)
class FacultySupervisedWorkAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "program_level", "completion_year", "faculty_role", "is_published", "sort_order")
    list_filter = ("program_level", "completion_year", "faculty_role", "is_published")
    search_fields = ("title", "faculty__title", "researchers", "adviser", "co_adviser", "award")


@admin.register(FacultyPublication)
class FacultyPublicationAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "publication_type", "year", "publication_date", "is_published", "sort_order")
    list_filter = ("publication_type", "year", "is_published")
    search_fields = ("title", "faculty__title", "authors", "venue", "doi", "indexing_note")


@admin.register(FacultyConference)
class FacultyConferenceAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "conference_name", "year", "event_date", "role", "is_published", "sort_order")
    list_filter = ("year", "role", "is_published")
    search_fields = ("title", "faculty__title", "conference_name", "location", "role")


@admin.register(FacultyResearchProject)
class FacultyResearchProjectAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "funding_type", "funding_source", "status", "end_year", "is_published", "sort_order")
    list_filter = ("funding_type", "status", "start_year", "end_year", "is_published")
    search_fields = ("title", "faculty__title", "funding_source", "role", "status")


@admin.register(FacultyExtensionProject)
class FacultyExtensionProjectAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "partner_community", "status", "end_year", "is_published", "sort_order")
    list_filter = ("status", "start_year", "end_year", "is_published")
    search_fields = ("title", "faculty__title", "funding_source", "partner_community", "role")


@admin.register(FacultyCreativeWork)
class FacultyCreativeWorkAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "category", "year", "work_date", "role", "is_published", "sort_order")
    list_filter = ("category", "year", "role", "is_published")


@admin.register(FacultyTrainingSeminar)
class FacultyTrainingSeminarAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "organizer", "year", "event_date", "role", "is_published", "sort_order")
    list_filter = ("year", "role", "is_published")
    search_fields = ("title", "faculty__title", "organizer", "venue", "role")


@admin.register(FacultyAchievement)
class FacultyAchievementAdmin(FacultyRecordAdmin):
    list_display = ("title", "faculty", "awarding_body", "level", "year", "achievement_date", "is_published", "sort_order")
    list_filter = ("level", "year", "is_published")
    search_fields = ("title", "faculty__title", "awarding_body", "description")


from .models import FacultyContribution

@admin.register(FacultyContribution)
class FacultyContributionAdmin(admin.ModelAdmin):
    list_display = ("faculty", "role", "credited_name", "is_published")
    list_filter = ("role", "is_published")
    search_fields = ("faculty__title", "credited_name", "research__title", "publication__title", "conference__title", "extension__title")
    autocomplete_fields = ("faculty", "research", "publication", "conference", "extension")
