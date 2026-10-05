from django.contrib import admin
from .models import ResearchProject


@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "reporting_year", "research_leader", "funding", "is_published")
    list_filter = ("reporting_year", "funding", "is_published")
    search_fields = ("title", "research_leader", "team_members")
    prepopulated_fields = {"slug": ("title",)}
