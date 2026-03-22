from django.db import models
from django.utils.text import slugify

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class PublishableModel(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_published = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    last_updated_note = models.CharField(max_length=255, blank=True)

    class Meta:
        abstract = True
        ordering = ["sort_order", "title"]

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)