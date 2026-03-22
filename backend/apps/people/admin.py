from django.contrib import admin
from .models import FacultyMember


@admin.action(description="Mark selected faculty members as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.register(FacultyMember)
class FacultyMemberAdmin(admin.ModelAdmin):
    list_display = ("title", "position", "email", "is_published", "featured", "updated_at")
    list_filter = ("is_published", "featured", "position")
    search_fields = (
        "title",
        "position",
        "email",
        "research_interests",
        "educational_background",
        "courses_taught",
    )
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    actions = [mark_published]