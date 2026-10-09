from django.utils import timezone
from .models import AlumniProfile, AlumniCareerEntry, CAREER_FIELDS


def record_update(profile, values, *, email_verified=False):
    """Save current details and append career snapshots without overwriting history."""
    values = dict(values)
    mode = values.pop("career_entry_mode", "CURRENT")
    if profile.pk and any(getattr(profile, key) != values.get(key) for key in ("full_name", "bsca_year", "msca_year", "student_id", "family_name", "first_name", "middle_name") if key in values):
        profile.verification_status = "PENDING"
        profile.reviewed_by = None
        profile.reviewed_at = None
    baseline = AlumniProfile() if mode == "HISTORICAL" else profile
    career = {key: values.get(key, getattr(baseline, key)) for key in CAREER_FIELDS}
    changed = not profile.pk or any(getattr(profile, key) != value for key, value in career.items())
    for key, value in values.items():
        if key not in CAREER_FIELDS or mode == "CURRENT":
            setattr(profile, key, value)
    now = timezone.now()
    if email_verified:
        profile.email_verified_at = now
    profile.consented_at = now
    profile.alumni_updated_at = now
    profile.save()
    if mode == "HISTORICAL" or (mode == "CURRENT" and (changed or not profile.career_history.exists())):
        AlumniCareerEntry.objects.create(profile=profile, reported_at=now, entry_kind=mode, **career)
    return profile
