from django.db import models
from .base_models import TimeStampedModel, PublishableModel

class SiteSetting(TimeStampedModel):
    site_name = models.CharField(max_length=255, default="Department of Computer Applications")
    short_name = models.CharField(max_length=50, default="DCA")
    primary_email = models.EmailField(blank=True)
    primary_phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return self.site_name

class DepartmentProfile(TimeStampedModel):
    title = models.CharField(max_length=255, default="About the Department")
    overview = models.TextField()
    vision = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    goals = models.TextField(blank=True)
    outcomes_mapping_note = models.TextField(blank=True)

    def __str__(self):
        return self.title

class HeroSection(PublishableModel):
    eyebrow = models.CharField(max_length=100, blank=True)
    subtitle = models.TextField(blank=True)
    primary_cta_label = models.CharField(max_length=100, blank=True)
    primary_cta_url = models.CharField(max_length=255, blank=True)
    secondary_cta_label = models.CharField(max_length=100, blank=True)
    secondary_cta_url = models.CharField(max_length=255, blank=True)
    background_image = models.ImageField(upload_to="heroes/", blank=True, null=True)

class QuickStat(TimeStampedModel):
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    note = models.CharField(max_length=255, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "label"]

    def __str__(self):
        return f"{self.label}: {self.value}"