from django.contrib import admin
from apps.people.models import FacultyContribution
from .models import ExtensionProject




class ExtensionProjectContributionInline(admin.TabularInline):
    model = FacultyContribution
    fk_name = "extension"
    fields = ("faculty", "role", "credited_name", "is_published")
    autocomplete_fields = ("faculty",)
    extra = 0
    verbose_name_plural = "Faculty contributions — enter only evidence-supported roles"


@admin.register(ExtensionProject)
class ExtensionProjectAdmin(admin.ModelAdmin):
    inlines = [ExtensionProjectContributionInline]
    list_display = ("title", "reporting_year", "extension_leader", "is_published")
    list_filter = ("reporting_year", "is_published")
    search_fields = ("title", "plain_language_summary", "intended_audience", "extension_leader", "faculty_members", "lecturers", "staff", "research_assistants", "students")
    prepopulated_fields = {"slug": ("title",)}
