from django.db import models
from apps.core.base_models import PublishableModel
from apps.quality.models import EvidenceDocument

class NewsPost(PublishableModel):
    CATEGORY_CHOICES = [
        ("NEWS", "News"),
        ("ANNOUNCEMENT", "Announcement"),
        ("EVENT", "Event"),
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    summary = models.TextField(blank=True)
    body = models.TextField()
    source_url = models.URLField(blank=True, help_text="Official source supporting this report.")
    featured_image = models.ImageField(upload_to="news/", blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)

    starts_on = models.DateField(null=True, blank=True, help_text="Actual activity date; never use the announcement publication date.")
    ends_on = models.DateField(null=True, blank=True)
    starts_at = models.TimeField(null=True, blank=True, help_text="Optional activity time in Philippine time.")
    deadline_on = models.DateField(null=True, blank=True, help_text="Actual submission or participation deadline, if supplied.")
    location = models.CharField(max_length=255, blank=True)
    event_status = models.CharField(max_length=16, blank=True, choices=[("SCHEDULED", "Scheduled"), ("CANCELLED", "Cancelled"), ("POSTPONED", "Postponed")])

    def clean(self):
        from django.core.exceptions import ValidationError
        super().clean()
        errors = {}
        if self.ends_on and not self.starts_on:
            errors["starts_on"] = "Enter the activity start date before its end date."
        if self.starts_on and self.ends_on and self.ends_on < self.starts_on:
            errors["ends_on"] = "The end date cannot be before the start date."
        if self.starts_at and not self.starts_on:
            errors["starts_at"] = "An activity time requires an activity date."
        if errors:
            raise ValidationError(errors)

    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="news_posts"
    )
    class Meta:
        ordering = ["-published_at", "-updated_at"]

    def __str__(self):
        return self.title