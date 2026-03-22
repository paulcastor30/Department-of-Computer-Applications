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
    featured_image = models.ImageField(upload_to="news/", blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)

    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="news_posts"
    )
    class Meta:
        ordering = ["-published_at", "-updated_at"]

    def __str__(self):
        return self.title