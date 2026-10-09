from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator
from django.db import models
from django.utils import timezone
from apps.core.base_models import PublishableModel, TimeStampedModel


class AlumniSettings(TimeStampedModel):
    accepting_updates = models.BooleanField(default=False)
    access_keys_enabled = models.BooleanField(default=False, help_text="Allow alumni to register and return with a private access key. Affiliation is reviewed separately.")
    retain_indefinitely = models.BooleanField(default=False, help_text="Keep alumni accounts and career history without automatic expiry. Correction/deletion requests remain available.")
    contact_label = models.CharField(max_length=150, default="Department chairperson")
    contact_email = models.EmailField(blank=True)
    privacy_notice = models.TextField(blank=True, help_text="Department-approved purpose, access, correction/deletion process, and retention notice.")
    notice_version = models.CharField(max_length=80, blank=True)
    retention_days = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(36500)], help_text="Delete records after this many days without an alumni update, using the purge command.")

    class Meta:
        verbose_name = "alumni update settings"
        verbose_name_plural = "alumni update settings"

    def clean(self):
        if self.accepting_updates and not all((self.contact_email, self.privacy_notice.strip(), self.notice_version.strip(), self.retain_indefinitely or self.retention_days)):
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
    student_id = models.CharField(max_length=40, blank=True)
    family_name = models.CharField(max_length=150, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    middle_name = models.CharField(max_length=150, blank=True)
    permanent_address = models.TextField(blank=True, max_length=1500)
    landline = models.CharField(max_length=40, blank=True)
    bsca_period = models.CharField(max_length=100, blank=True)
    msca_period = models.CharField(max_length=100, blank=True)
    sex = models.CharField(max_length=20, choices=[("", "Not provided"), ("M", "Male"), ("F", "Female"), ("OTHER", "Another description"), ("UNDISCLOSED", "Prefer not to say")], blank=True)
    residence_city = models.CharField(max_length=150, blank=True)
    residence_country = models.CharField(max_length=100, blank=True)
    industry = models.CharField(max_length=150, blank=True)
    work_city = models.CharField(max_length=150, blank=True)
    work_country = models.CharField(max_length=100, blank=True)
    work_arrangement = models.CharField(max_length=20, choices=[("", "Not provided"), ("ONSITE", "On-site"), ("REMOTE", "Remote"), ("HYBRID", "Hybrid")], blank=True)
    duties = models.TextField(blank=True, max_length=3000)
    skills_used = models.CharField(max_length=1000, blank=True)
    work_alignment = models.CharField(max_length=20, choices=[("", "Not provided"), ("ALIGNED", "Aligned"), ("PARTLY", "Partly aligned"), ("NOT_ALIGNED", "Not aligned"), ("UNSURE", "Unsure / not applicable")], blank=True)
    alignment_explanation = models.TextField(blank=True, max_length=1500)
    career_start = models.DateField(null=True, blank=True)
    career_end = models.DateField(null=True, blank=True)
    further_study = models.BooleanField(default=False)
    study_program = models.CharField(max_length=200, blank=True)
    study_institution = models.CharField(max_length=200, blank=True)
    exam_status = models.CharField(max_length=20, choices=[("", "Not provided"), ("PASSED", "Passed"), ("NOT_PASSED", "Not passed"), ("NOT_TAKEN", "Not taken / not applicable")], blank=True)
    exam_details = models.CharField(max_length=500, blank=True)
    program_feedback = models.TextField(blank=True, max_length=3000)
    network_interests = models.CharField(max_length=1000, blank=True)
    professional_url = models.URLField(max_length=500, blank=True)
    access_key_hash = models.CharField(max_length=256, blank=True)
    receive_updates = models.BooleanField(default=False)
    willing_to_mentor = models.BooleanField(default=False)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    consented_at = models.DateTimeField()
    notice_version = models.CharField(max_length=80)
    alumni_updated_at = models.DateTimeField(default=timezone.now)
    verification_status = models.CharField(max_length=20, choices=[("PENDING", "Pending affiliation review"), ("VERIFIED", "Alumni affiliation verified"), ("UNCONFIRMED", "Affiliation unconfirmed")], default="PENDING")
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        permissions = [("reset_alumni_access", "Reset an alumni access key after confirming identity")]

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
    email_verified = models.BooleanField(default=True)
    token_hash = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)


CAREER_FIELDS = ("career_status", "employer", "job_title", "industry", "work_city", "work_country", "work_arrangement", "duties", "skills_used", "work_alignment", "alignment_explanation", "career_start", "career_end", "further_study", "study_program", "study_institution", "exam_status", "exam_details", "program_feedback")


class AlumniCareerEntry(models.Model):
    profile = models.ForeignKey(AlumniProfile, related_name="career_history", on_delete=models.CASCADE)
    reported_at = models.DateTimeField(default=timezone.now)
    entry_kind = models.CharField(max_length=20, choices=[("CURRENT", "Current activity update"), ("HISTORICAL", "Previous role or activity")], default="CURRENT")
    # A complete, immutable snapshot; later roles append instead of replacing this record.
    career_status = models.CharField(max_length=30, choices=AlumniProfile.STATUS_CHOICES)
    employer = models.CharField(max_length=150, blank=True)
    job_title = models.CharField(max_length=150, blank=True)
    industry = models.CharField(max_length=150, blank=True)
    work_city = models.CharField(max_length=150, blank=True)
    work_country = models.CharField(max_length=100, blank=True)
    work_arrangement = models.CharField(max_length=20, blank=True)
    duties = models.TextField(blank=True)
    skills_used = models.CharField(max_length=1000, blank=True)
    work_alignment = models.CharField(max_length=20, blank=True)
    alignment_explanation = models.TextField(blank=True)
    career_start = models.DateField(null=True, blank=True)
    career_end = models.DateField(null=True, blank=True)
    further_study = models.BooleanField(default=False)
    study_program = models.CharField(max_length=200, blank=True)
    study_institution = models.CharField(max_length=200, blank=True)
    exam_status = models.CharField(max_length=20, blank=True)
    exam_details = models.CharField(max_length=500, blank=True)
    program_feedback = models.TextField(blank=True)

    class Meta:
        ordering = ["-reported_at", "-pk"]

    def __str__(self):
        return f"{self.profile} — {self.job_title or self.get_career_status_display()}"


class GraduateRecord(TimeStampedModel):
    source_key = models.CharField(max_length=64, unique=True)
    family_name = models.CharField(max_length=150)
    first_name = models.CharField(max_length=150)
    middle_name = models.CharField(max_length=150, blank=True)
    student_id = models.CharField(max_length=40, blank=True)
    program = models.CharField(max_length=4, choices=[("BSCA", "BSCA"), ("MSCA", "MSCA")])
    graduation_year = models.PositiveIntegerField()
    graduation_period = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=150, blank=True)
    landline = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    permanent_address = models.TextField(blank=True)
    sex = models.CharField(max_length=20, blank=True)
    alumni_profile = models.ForeignKey(AlumniProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name="graduate_records", help_text="Link only after staff confirms this account belongs to the graduate. Imported contact data do not verify account ownership.")

    class Meta:
        ordering = ["-graduation_year", "program", "family_name", "first_name"]

    def __str__(self):
        return f"{self.family_name}, {self.first_name} — {self.program} {self.graduation_year}"


class GraduateObservation(models.Model):
    graduate = models.ForeignKey(GraduateRecord, related_name="observations", on_delete=models.CASCADE)
    source_file = models.CharField(max_length=255)
    source_sheet = models.CharField(max_length=100)
    source_row = models.PositiveIntegerField()
    source_digest = models.CharField(max_length=64)
    reporting_period = models.CharField(max_length=100, blank=True)
    traced = models.BooleanField(null=True, blank=True)
    employed = models.BooleanField(null=True, blank=True)
    further_study = models.BooleanField(null=True, blank=True)
    unemployed = models.BooleanField(null=True, blank=True)
    aligned = models.BooleanField(null=True, blank=True)
    exam_passed = models.BooleanField(null=True, blank=True)
    remarks = models.TextField(blank=True)
    imported_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-imported_at", "-pk"]
        constraints = [models.UniqueConstraint(fields=["source_digest", "source_sheet", "source_row"], name="unique_graduate_source_row")]

    def __str__(self):
        return f"{self.graduate} — {self.reporting_period or self.source_file}"


class AlumniOpportunity(PublishableModel):
    kind = models.CharField(max_length=20, choices=[("JOB", "Career opportunity"), ("STUDY", "Further study"), ("TRAINING", "Training"), ("EVENT", "Event"), ("MENTORING", "Mentoring")])
    description = models.TextField()
    provider = models.CharField(max_length=150)
    url = models.URLField(max_length=1000, validators=[URLValidator(schemes=["https", "http"])])
    closes_on = models.DateField(null=True, blank=True)
    source_note = models.TextField(blank=True, help_text="Internal verification notes; not shown publicly.")
