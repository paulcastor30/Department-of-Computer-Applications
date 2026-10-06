from django.contrib import admin
from apps.people.models import FacultyContribution
from .models import ResearchProject, ConferenceRecord, PublicationRecord




class ResearchProjectContributionInline(admin.TabularInline):
    model = FacultyContribution
    fk_name = "research"
    fields = ("faculty", "role", "credited_name", "is_published")
    autocomplete_fields = ("faculty",)
    extra = 0
    verbose_name_plural = "Faculty contributions — enter only evidence-supported roles"


@admin.register(ResearchProject)
class ResearchProjectAdmin(admin.ModelAdmin):
    inlines = [ResearchProjectContributionInline]
    list_display = ("title", "reporting_year", "research_leader", "funding", "is_published")
    list_filter = ("reporting_year", "funding", "is_published")
    search_fields = ("title", "plain_language_summary", "intended_audience", "research_leader", "team_members")
    prepopulated_fields = {"slug": ("title",)}




class ConferenceRecordContributionInline(admin.TabularInline):
    model = FacultyContribution
    fk_name = "conference"
    fields = ("faculty", "role", "credited_name", "is_published")
    autocomplete_fields = ("faculty",)
    extra = 0
    verbose_name_plural = "Faculty contributions — enter only evidence-supported roles"


@admin.register(ConferenceRecord)
class ConferenceRecordAdmin(admin.ModelAdmin):
    inlines = [ConferenceRecordContributionInline]
    list_display = ("title", "year", "conference", "starts_on", "scope", "withdrawn", "is_published")
    list_filter = ("year", "scope", "withdrawn", "is_published")
    search_fields = ("title", "authors", "conference", "location")
    prepopulated_fields = {"slug": ("title",)}




class PublicationRecordContributionInline(admin.TabularInline):
    model = FacultyContribution
    fk_name = "publication"
    fields = ("faculty", "role", "credited_name", "is_published")
    autocomplete_fields = ("faculty",)
    extra = 0
    verbose_name_plural = "Faculty contributions — enter only evidence-supported roles"


@admin.register(PublicationRecord)
class PublicationRecordAdmin(admin.ModelAdmin):
    inlines = [PublicationRecordContributionInline]
    list_display = ("title", "year", "kind", "doi", "is_published")
    list_filter = ("year", "kind", "is_published")
    search_fields = ("title", "authors", "venue", "doi")
    prepopulated_fields = {"slug": ("title",)}
