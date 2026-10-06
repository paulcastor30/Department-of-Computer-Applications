from django.db import models
from apps.core.base_models import PublishableModel


class ResearchProject(PublishableModel):
    plain_language_summary = models.TextField(blank=True, help_text="Explain the intended focus in everyday language. Do not claim completed work or measured outcomes without evidence.")
    intended_audience = models.CharField(max_length=255, blank=True, help_text="Intended users or audience supported by the source. Leave blank when not established; not a count of people reached.")
    reporting_year = models.CharField(max_length=20, help_text="Reporting year or range; not project status or confirmed start/end dates.")
    research_leader = models.CharField(max_length=255)
    team_members = models.TextField(blank=True, help_text="One additional team member per line. Do not infer employment roles from project membership.")
    funding = models.CharField(max_length=20, choices=[("INTERNAL", "Internally funded research"), ("EXTERNAL", "Externally funded research")])
    source_note = models.TextField(blank=True, help_text="Internal provenance and points requiring confirmation.")

    class Meta:
        ordering = ["-reporting_year", "sort_order", "title"]

    def __str__(self):
        return self.title


class ConferenceRecord(PublishableModel):
    year = models.PositiveIntegerField()
    authors = models.TextField(help_text="Authors in the supplied order; includes faculty, students and collaborators.")
    conference = models.CharField(max_length=500)
    date_label = models.CharField(max_length=100)
    starts_on = models.DateField()
    ends_on = models.DateField()
    location = models.CharField(max_length=255)
    scope = models.CharField(max_length=20, choices=[("LOCAL", "Local"), ("REGIONAL", "Regional"), ("NATIONAL", "National"), ("INTERNATIONAL", "International")])
    withdrawn = models.BooleanField(default=False, help_text="Explicit withdrawal recorded in the department source.")
    source_note = models.TextField(blank=True)

    class Meta:
        ordering = ["-year", "-starts_on", "sort_order", "title"]

    def __str__(self):
        return self.title


class PublicationRecord(PublishableModel):
    year = models.PositiveIntegerField(help_text="First online year where confirmed; otherwise proceedings or citation year.")
    authors = models.TextField(help_text="Complete author list in publisher order, separated by semicolons.")
    venue = models.TextField(help_text="Journal, proceedings or preprint repository.")
    kind = models.CharField(max_length=20, choices=[("JOURNAL", "Journal article"), ("PROCEEDINGS", "Conference paper"), ("PREPRINT", "Preprint")])
    citation_details = models.CharField(max_length=255, blank=True)
    date_label = models.CharField(max_length=255, help_text="Use only the precision supported by the publisher; distinguish online and citation dates.")
    publisher = models.CharField(max_length=255, blank=True)
    doi = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(max_length=500)
    source_note = models.TextField(blank=True, help_text="Internal verification notes and provenance.")

    class Meta:
        ordering = ["-year", "sort_order", "title"]

    def __str__(self):
        return self.title
