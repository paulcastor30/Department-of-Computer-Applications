from django.db import migrations


NOTICE = """The Department of Computer Applications collects BSCA and MSCA graduate identity and contact details, locations, work and study activities, career history, degree alignment, exam information, skills, and program feedback to evaluate graduate outcomes, improve its programs, and establish its alumni network.

Participation is voluntary. Optional questions may be left blank. Your personal record and career history are private and accessible only to authorized department staff. The department may use summarized results for program evaluation. Your individual information, contact details, or story will not be published through this service. Career information is self-reported and alumni affiliation is reviewed separately against department records.

Under the department's selected long-term policy, your account and career history have no automatic expiry. Adding a new role retains earlier entries. Imported graduate rosters and tracing observations are held separately for department review; an imported record does not create your account or subscribe you to messages. Access-key registration does not verify email ownership.

Keep your private access key secure. Anyone with your registered email and key can access your account. Lost-key recovery requires staff identity confirmation. For correction, deletion, account recovery, or questions, contact Paul Rodolf P. Castor, Department chairperson, at paulrodolf.castor@g.msuiit.edu.ph. Requests are reviewed by the department; this service does not automatically erase records solely because they are old.

Permission to contact you about opportunities and permission to approach you about mentoring are separate optional choices. You may change them later. Public profiles, stories, and disclosure to partners require separate permission."""


FIELDS = ("career_status", "employer", "job_title", "industry", "work_city", "work_country", "work_arrangement", "duties", "skills_used", "work_alignment", "alignment_explanation", "career_start", "career_end", "further_study", "study_program", "study_institution", "exam_status", "exam_details", "program_feedback")


def activate_tracing(apps, schema_editor):
    db = schema_editor.connection.alias
    Profile = apps.get_model("alumni", "AlumniProfile")
    Entry = apps.get_model("alumni", "AlumniCareerEntry")
    for profile in Profile.objects.using(db).all().iterator():
        if not Entry.objects.using(db).filter(profile_id=profile.pk).exists():
            Entry.objects.using(db).create(profile_id=profile.pk, reported_at=profile.alumni_updated_at, **{field: getattr(profile, field) for field in FIELDS})
    apps.get_model("alumni", "AlumniSettings").objects.using(db).update_or_create(pk=1, defaults={
        "accepting_updates": True, "access_keys_enabled": True, "retain_indefinitely": True, "retention_days": None,
        "contact_label": "Paul Rodolf P. Castor, Department chairperson", "contact_email": "paulrodolf.castor@g.msuiit.edu.ph",
        "notice_version": "dca-alumni-long-term-2026-10-09", "privacy_notice": NOTICE,
    })


class Migration(migrations.Migration):
    dependencies = [("alumni", "0006_alter_alumniprofile_options_and_more")]
    operations = [migrations.RunPython(activate_tracing, migrations.RunPython.noop)]
