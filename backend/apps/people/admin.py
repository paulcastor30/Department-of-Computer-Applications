from django.contrib import admin
from .models import (
    DepartmentRole,
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


@admin.register(DepartmentRole)
class DepartmentRoleAdmin(admin.ModelAdmin):
    list_display = ("person", "role", "is_published", "sort_order")
    list_filter = ("role", "is_published")
    search_fields = ("person__title", "person__email")
    autocomplete_fields = ("person",)
    readonly_fields = ("created_at", "updated_at")


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
        "academic_status",
        "verification_reference",
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


class HistoricalActivityInline(admin.StackedInline):
    extra = 0
    show_change_link = True
    verbose_name_plural = "Historical activities — deprecated for new institutional entries; use Faculty Contributions"

    def has_add_permission(self, request, obj=None):
        return False


class FacultyContributionInline(admin.TabularInline):
    model = FacultyContribution
    extra = 0
    autocomplete_fields = ("research", "publication", "conference", "extension")
    fields = ("research", "publication", "conference", "extension", "role", "is_published")
    verbose_name_plural = "Department contributions — select exactly one shared institutional record"


class FacultyPublicationInline(HistoricalActivityInline):
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


class FacultyConferenceInline(HistoricalActivityInline):
    model = FacultyConference
    extra = 0


class FacultyResearchProjectInline(HistoricalActivityInline):
    model = FacultyResearchProject
    extra = 0


class FacultyExtensionProjectInline(HistoricalActivityInline):
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
        FacultyContributionInline,
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
    list_display = ("faculty", "degree_level", "degree_name", "institution", "year_completed", "academic_status", "is_published", "sort_order")
    list_filter = ("degree_level", "academic_status", "year_completed", "is_published")
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


class HistoricalActivityAdmin(FacultyRecordAdmin):
    autocomplete_fields = ("faculty", "reconciled_contribution")
    list_filter = ("is_published", ("reconciled_contribution", admin.EmptyFieldListFilter))

    def has_add_permission(self, request):
        return False

    def change_view(self, request, object_id, form_url="", extra_context=None):
        self.message_user(request, "Historical activity: deprecated for new institutional entries. Correct the authoritative record in Research or Extension and link it through Faculty Contributions. Existing historical content remains editable.", level="warning")
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(FacultyPublication)
class FacultyPublicationAdmin(HistoricalActivityAdmin):
    list_display = ("title", "faculty", "publication_type", "year", "publication_date", "is_published", "sort_order")
    list_filter = ("publication_type", "year", "is_published", ("reconciled_contribution", admin.EmptyFieldListFilter))
    search_fields = ("title", "faculty__title", "authors", "venue", "doi", "indexing_note")


@admin.register(FacultyConference)
class FacultyConferenceAdmin(HistoricalActivityAdmin):
    list_display = ("title", "faculty", "conference_name", "year", "event_date", "role", "is_published", "sort_order")
    list_filter = ("year", "role", "is_published", ("reconciled_contribution", admin.EmptyFieldListFilter))
    search_fields = ("title", "faculty__title", "conference_name", "location", "role")


@admin.register(FacultyResearchProject)
class FacultyResearchProjectAdmin(HistoricalActivityAdmin):
    list_display = ("title", "faculty", "funding_type", "funding_source", "status", "end_year", "is_published", "sort_order")
    list_filter = ("funding_type", "status", "start_year", "end_year", "is_published", ("reconciled_contribution", admin.EmptyFieldListFilter))
    search_fields = ("title", "faculty__title", "funding_source", "role", "status")


@admin.register(FacultyExtensionProject)
class FacultyExtensionProjectAdmin(HistoricalActivityAdmin):
    list_display = ("title", "faculty", "partner_community", "status", "end_year", "is_published", "sort_order")
    list_filter = ("status", "start_year", "end_year", "is_published", ("reconciled_contribution", admin.EmptyFieldListFilter))
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


class ContributionKindFilter(admin.SimpleListFilter):
    title = "contribution type"
    parameter_name = "kind"

    def lookups(self, request, model_admin):
        return [(kind, kind.title()) for kind in ("research", "publication", "conference", "extension")]

    def queryset(self, request, queryset):
        if self.value() in ("research", "publication", "conference", "extension"):
            return queryset.filter(**{self.value() + "__isnull": False})
        return queryset


@admin.register(FacultyContribution)
class FacultyContributionAdmin(admin.ModelAdmin):
    list_display = ("faculty", "contribution_kind", "source_title", "source_year", "role", "credited_name", "is_published", "source_published")
    list_filter = ("role", "is_published", ContributionKindFilter, "research__is_published", "publication__is_published", "conference__is_published", "extension__is_published")
    search_fields = ("faculty__title", "credited_name", "research__title", "publication__title", "conference__title", "extension__title")
    autocomplete_fields = ("faculty", "research", "publication", "conference", "extension")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("faculty", "research", "publication", "conference", "extension")

    @admin.display(description="Type")
    def contribution_kind(self, obj):
        return next(kind for kind in ("research", "publication", "conference", "extension") if getattr(obj, kind + "_id"))

    def source(self, obj):
        return getattr(obj, self.contribution_kind(obj))

    @admin.display(description="Institutional record")
    def source_title(self, obj):
        return self.source(obj).title

    @admin.display(description="Year")
    def source_year(self, obj):
        record = self.source(obj)
        return getattr(record, "reporting_year", getattr(record, "year", ""))

    @admin.display(boolean=True, description="Source published")
    def source_published(self, obj):
        return self.source(obj).is_published
