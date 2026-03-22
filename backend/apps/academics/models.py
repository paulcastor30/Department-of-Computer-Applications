from django.db import models
from apps.core.base_models import PublishableModel
from apps.quality.models import EvidenceDocument

class Program(PublishableModel):
    DEGREE_LEVELS = [
        ("UNDERGRAD", "Undergraduate"),
        ("GRAD", "Graduate"),
    ]

    code = models.CharField(max_length=20, unique=True)
    degree_level = models.CharField(max_length=20, choices=DEGREE_LEVELS)
    overview = models.TextField()
    career_opportunities = models.TextField(blank=True)
    admission_requirements = models.TextField(blank=True)
    faq_intro = models.TextField(blank=True)
    curriculum_pdf = models.FileField(upload_to="programs/curricula/", blank=True, null=True)

    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="programs"
    )

    def __str__(self):
        return self.code