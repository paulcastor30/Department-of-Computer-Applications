from django.contrib import admin
from .models import Program


@admin.action(description="Mark selected programs as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "degree_level", "is_published", "featured", "updated_at")
    list_filter = ("degree_level", "is_published", "featured")
    search_fields = ("code", "title", "overview")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    actions = [mark_published]