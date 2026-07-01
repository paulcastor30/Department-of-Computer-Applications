from django.db import models
from apps.core.base_models import PublishableModel, TimeStampedModel
from apps.quality.models import EvidenceDocument

class Program(PublishableModel):
    DEGREE_LEVELS = [
        ("UNDERGRAD", "Undergraduate"),
        ("GRAD", "Graduate"),
    ]

    code = models.CharField(max_length=20, unique=True)
    degree_level = models.CharField(max_length=20, choices=DEGREE_LEVELS)
    overview = models.TextField()
    formal_description = models.TextField(blank=True)
    academic_orientation = models.CharField(max_length=255, blank=True)
    intended_learners = models.TextField(blank=True)
    culminating_requirement = models.CharField(max_length=255, blank=True)
    duration = models.CharField(max_length=255, blank=True)
    curriculum_load = models.CharField(max_length=255, blank=True)
    recognition = models.CharField(max_length=255, blank=True)
    program_goals = models.TextField(blank=True, help_text="Enter one program goal per line.")
    program_educational_objectives = models.TextField(blank=True, help_text="Enter one program educational objective per line.")
    outcomes = models.TextField(blank=True, help_text="Enter one program outcome per line.")
    academic_areas = models.TextField(blank=True, help_text="Enter one academic or research area per line.")
    specialization_tracks = models.TextField(blank=True, help_text="Enter one specialization track, focus area, or track course per line.")
    curriculum_structure = models.TextField(blank=True, help_text="Enter one curriculum structure item per line.")
    thesis_information = models.TextField(blank=True, help_text="Enter thesis information using official Department terminology.")
    student_support = models.TextField(blank=True, help_text="Enter one student support or facility item per line.")
    contact_information = models.TextField(blank=True)
    curriculum_evidence = models.TextField(blank=True, help_text="Enter one curriculum feature or evidence item per line.")
    quality_evidence = models.TextField(blank=True, help_text="Enter one accreditation evidence item per line.")
    career_opportunities = models.TextField(blank=True)
    admission_requirements = models.TextField(blank=True)
    progression_requirements = models.TextField(blank=True, help_text="Enter one progression or retention requirement per line.")
    historical_notes = models.TextField(blank=True, help_text="Enter historical notes, linkages, or dated curriculum notes. Avoid presenting expired linkages as current offers.")
    faq_intro = models.TextField(blank=True)
    curriculum_pdf = models.FileField(upload_to="programs/curricula/", blank=True, null=True)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)

    evidence_documents = models.ManyToManyField(
        EvidenceDocument,
        blank=True,
        related_name="programs"
    )

    def __str__(self):
        return self.code


class ProgramDocument(TimeStampedModel):
    DOCUMENT_TYPES = [
        ("CURRICULUM", "Curriculum"),
        ("ADMISSION", "Admission guide"),
        ("BROCHURE", "Program brochure"),
        ("HANDBOOK", "Student handbook or advising guide"),
        ("OTHER", "Other"),
    ]

    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPES, default="OTHER")
    file = models.FileField(upload_to="programs/documents/", blank=True, null=True)
    url = models.URLField(blank=True)
    note = models.CharField(max_length=255, blank=True, default="To be provided by the Department.")
    is_public = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "title"]

    def __str__(self):
        return f"{self.program.code} - {self.title}"
