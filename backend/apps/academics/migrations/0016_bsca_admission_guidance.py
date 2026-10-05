from django.db import migrations

REQUIREMENTS_URL = "https://www.msuiit.edu.ph/offices/admissions/requirements.php"
PORTAL_URL = "https://admission.msuiit.edu.ph/"
GUIDANCE_TEXT = "\n".join([
    "Admission to BSCA follows MSU-IIT’s official admissions procedures. Review the current requirements, document checklist and application announcements before applying.",
    "Incoming first-year applicants should use the MSU-IIT Admission Portal when applications open. Transfer and second-degree applicants should follow the university’s applicable instructions and contact the department about program evaluation.",
    "Admission is subject to the university’s selection process and available program slots.",
])


def add_bsca_admissions(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code="BSCA"):
        updates = {}
        if not program.admissions_url:
            updates["admissions_url"] = REQUIREMENTS_URL
        if not program.admissions_portal_url:
            updates["admissions_portal_url"] = PORTAL_URL
        current = (program.admission_requirements or "").strip().rstrip(".").casefold()
        if current in ("", "to be provided by the department", "to be validated by the department"):
            updates["admission_requirements"] = GUIDANCE_TEXT
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0015_program_admissions_portal_url")]
    operations = [migrations.RunPython(add_bsca_admissions, migrations.RunPython.noop)]
