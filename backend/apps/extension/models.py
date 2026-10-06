from django.db import models
from apps.core.base_models import PublishableModel


class ExtensionProject(PublishableModel):
    plain_language_summary = models.TextField(blank=True, help_text="Explain the intended focus in everyday language. Do not claim completed work or measured outcomes without evidence.")
    intended_audience = models.CharField(max_length=255, blank=True, help_text="Intended users or audience supported by the source. Leave blank when not established; not a count of people reached.")
    reporting_year = models.PositiveIntegerField(help_text="Reporting year; does not establish activity dates or completion status.")
    extension_leader = models.CharField(max_length=255)
    faculty_members = models.TextField(blank=True, help_text="One name per line; participant category as reported for this record.")
    lecturers = models.TextField(blank=True)
    staff = models.TextField(blank=True)
    research_assistants = models.TextField(blank=True)
    students = models.TextField(blank=True)
    source_note = models.TextField(blank=True, help_text="Internal source and name-variant notes; not published.")

    class Meta:
        ordering = ["-reporting_year", "sort_order", "title"]

    def __str__(self):
        return self.title
