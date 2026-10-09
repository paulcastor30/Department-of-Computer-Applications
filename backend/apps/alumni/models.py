from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator
from django.db import models
from django.utils import timezone
from apps.core.base_models import PublishableModel, TimeStampedModel


class AlumniSettings(TimeStampedModel):
    accepting_updates = models.BooleanField(default=False)
    contact_label = models.CharField(max_length=150, default="Department chairperson")
    contact_email = models.EmailField(blank=True)
    privacy_notice = models.TextField(blank=True, help_text="Department-approved purpose, access, correction/deletion process, and retention notice.")
    notice_version = models.CharField(max_length=80, blank=True)
    retention_days = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(36500)], help_text="Delete records after this many days without an alumni update, using the purge command.")

    class Meta:
        verbose_name = "alumni update settings"
        verbose_name_plural = "alumni update settings"

    def clean(self):
        if self.accepting_updates and not all((self.contact_email, self.privacy_notice.strip(), self.notice_version.strip(), self.retention_days)):
            raise ValidationError("Provide the contact mailbox, approved privacy notice/version, and retention period before opening updates.")

    def save(self, *args, **kwargs):
        self.pk = 1
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return "Alumni update settings"


class AlumniProfile(TimeStampedModel):
    STATUS_CHOICES = [("EMPLOYED", "Employed"), ("SELF_EMPLOYED", "Self-employed"), ("FURTHER_STUDY", "Further study"), ("SEEKING_WORK", "Seeking work"), ("OTHER", "Other activities"), ("PREFER_NOT_TO_SAY", "Prefer not to say")]
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    bsca_year = models.PositiveIntegerField(null=True, blank=True)
    msca_year = models.PositiveIntegerField(null=True, blank=True)
    career_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="PREFER_NOT_TO_SAY")
    employer = models.CharField(max_length=150, blank=True)
    job_title = models.CharField(max_length=150, blank=True)
    interests = models.CharField(max_length=500, blank=True)
    preferred_contact = models.CharField(max_length=10, choices=[("EMAIL", "Email"), ("PHONE", "Phone")], default="EMAIL")
    phone = models.CharField(max_length=40, blank=True)
    receive_updates = models.BooleanField(default=False)
    willing_to_mentor = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField()
    consented_at = models.DateTimeField()
    notice_version = models.CharField(max_length=80)
    alumni_updated_at = models.DateTimeField(default=timezone.now)
    verification_status = models.CharField(max_length=20, choices=[("PENDING", "Pending affiliation review"), ("VERIFIED", "Alumni affiliation verified"), ("UNCONFIRMED", "Affiliation unconfirmed")], default="PENDING")
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.full_name


class AlumniEmailLink(models.Model):
    email = models.EmailField()
    token_hash = models.CharField(max_length=64, unique=True)
    request_hash = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)


class AlumniUpdateSession(models.Model):
    email = models.EmailField()
    token_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)


class AlumniOpportunity(PublishableModel):
    kind = models.CharField(max_length=20, choices=[("JOB", "Career opportunity"), ("STUDY", "Further study"), ("TRAINING", "Training"), ("EVENT", "Event"), ("MENTORING", "Mentoring")])
    description = models.TextField()
    provider = models.CharField(max_length=150)
    url = models.URLField(max_length=1000, validators=[URLValidator(schemes=["https", "http"])])
    closes_on = models.DateField(null=True, blank=True)
    source_note = models.TextField(blank=True, help_text="Internal verification notes; not shown publicly.")
