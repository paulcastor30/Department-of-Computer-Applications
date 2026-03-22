from django.db import models
from apps.core.base_models import PublishableModel
from apps.quality.models import EvidenceDocument

class FacultyMember(PublishableModel):
    position = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    photo = models.ImageField(upload_to="faculty/", blank=True, null=True)
    educational_background = models.TextField(blank=True)
    research_interests = models.TextField(blank=True)
    courses_taught = models.TextField(blank=True)
    certifications = models.TextField(blank=True)
    awards = models.TextField(blank=True)
    office = models.CharField(max_length=255, blank=True)
    
    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="faculty_members"
    )

    def __str__(self):
        return self.title