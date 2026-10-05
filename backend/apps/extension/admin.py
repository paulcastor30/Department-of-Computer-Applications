from django.contrib import admin
from .models import ExtensionProject


@admin.register(ExtensionProject)
class ExtensionProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "reporting_year", "extension_leader", "is_published")
    list_filter = ("reporting_year", "is_published")
    search_fields = ("title", "extension_leader", "faculty_members", "lecturers", "staff", "research_assistants", "students")
    prepopulated_fields = {"slug": ("title",)}
