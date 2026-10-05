from django.db import models
from apps.core.base_models import PublishableModel


class ResearchProject(PublishableModel):
    reporting_year = models.CharField(max_length=20, help_text="Reporting year or range; not project status or confirmed start/end dates.")
    research_leader = models.CharField(max_length=255)
    team_members = models.TextField(blank=True, help_text="One additional team member per line. Do not infer employment roles from project membership.")
    funding = models.CharField(max_length=20, choices=[("INTERNAL", "Internally funded research"), ("EXTERNAL", "Externally funded research")])
    source_note = models.TextField(blank=True, help_text="Internal provenance and points requiring confirmation.")

    class Meta:
        ordering = ["-reporting_year", "sort_order", "title"]

    def __str__(self):
        return self.title
