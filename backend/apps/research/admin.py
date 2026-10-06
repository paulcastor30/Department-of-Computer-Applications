from django.contrib import admin
from .models import ResearchProject, ConferenceRecord, PublicationRecord


@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "reporting_year", "research_leader", "funding", "is_published")
    list_filter = ("reporting_year", "funding", "is_published")
    search_fields = ("title", "plain_language_summary", "intended_audience", "research_leader", "team_members")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ConferenceRecord)
class ConferenceRecordAdmin(admin.ModelAdmin):
    list_display = ("title", "year", "conference", "starts_on", "scope", "withdrawn", "is_published")
    list_filter = ("year", "scope", "withdrawn", "is_published")
    search_fields = ("title", "authors", "conference", "location")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(PublicationRecord)
class PublicationRecordAdmin(admin.ModelAdmin):
    list_display = ("title", "year", "kind", "doi", "is_published")
    list_filter = ("year", "kind", "is_published")
    search_fields = ("title", "authors", "venue", "doi")
    prepopulated_fields = {"slug": ("title",)}
