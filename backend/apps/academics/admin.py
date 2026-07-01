from django.contrib import admin
from .models import Program, ProgramDocument


@admin.action(description="Mark selected programs as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


class ProgramDocumentInline(admin.TabularInline):
    model = ProgramDocument
    extra = 1
    fields = ("title", "document_type", "file", "url", "note", "is_public", "sort_order")


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "degree_level", "culminating_requirement", "is_published", "featured", "sort_order", "updated_at")
    list_filter = ("degree_level", "is_published", "featured")
    search_fields = ("code", "title", "overview", "formal_description", "academic_orientation", "culminating_requirement")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    inlines = [ProgramDocumentInline]
    actions = [mark_published]
    fieldsets = (
        ("Program Identity", {
            "fields": (
                "code",
                "title",
                "slug",
                "degree_level",
                "overview",
                "formal_description",
                "academic_orientation",
                "intended_learners",
                "culminating_requirement",
                "duration",
                "curriculum_load",
                "recognition",
            )
        }),
        ("Academic Content", {
            "fields": (
                "program_goals",
                "program_educational_objectives",
                "outcomes",
                "academic_areas",
                "specialization_tracks",
                "curriculum_structure",
                "thesis_information",
                "student_support",
            ),
            "description": "Use one item per line so the public website can display formal academic program information.",
        }),
        ("Student Pathway", {
            "fields": (
                "admission_requirements",
                "progression_requirements",
                "career_opportunities",
                "contact_information",
                "faq_intro",
            ),
            "description": "Use one item per line for admissions, progression, and career entries.",
        }),
        ("Quality Assurance Records", {
            "fields": (
                "curriculum_evidence",
                "quality_evidence",
            ),
            "description": "Keep detailed evidence records restrained on public Program pages; detailed QA material belongs in quality-assurance records.",
        }),
        ("Documents and Historical Notes", {
            "fields": (
                "curriculum_pdf",
                "evidence_documents",
                "historical_notes",
            ),
            "description": "Put expired or previous affiliations here as historical evidence only, not as current offers.",
        }),
        ("Publishing", {
            "fields": (
                "is_published",
                "featured",
                "sort_order",
                "last_updated_note",
                "created_at",
                "updated_at",
            )
        }),
        ("SEO Metadata", {
            "fields": (
                "seo_title",
                "seo_description",
                "og_title",
                "og_description",
                "canonical_url",
            )
        }),
    )


@admin.register(ProgramDocument)
class ProgramDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "program", "document_type", "is_public", "sort_order", "updated_at")
    list_filter = ("document_type", "is_public", "program")
    search_fields = ("title", "program__title", "program__code", "note")
    ordering = ("program", "sort_order", "title")
