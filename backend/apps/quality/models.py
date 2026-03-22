from django.db import models

class EvidenceDocument(models.Model):
    FRAMEWORK_CHOICES = [
        ("AACCUP", "AACCUP"),
        ("AUN_QA", "AUN QA"),
        ("CHED_COPC", "CHED COPC"),
        ("CHED_COE", "CHED COE"),
    ]

    framework = models.CharField(max_length=20, choices=FRAMEWORK_CHOICES)
    area_code = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="evidence/")
    last_updated = models.DateField()
    is_public_placeholder = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.framework} | {self.area_code} | {self.title}"