from django.db import migrations

GUIDANCE_URL = "https://sites.google.com/g.msuiit.edu.ph/ccsg/applicationadmission"
GUIDANCE_TEXT = "MSCA applicants should follow the College of Computer Studies graduate application and admission procedures. Review the official guide for eligibility, required documents, program acceptance, university admission and enrolment steps."


def add_msca_admissions(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    for program in Program.objects.using(schema_editor.connection.alias).filter(code="MSCA"):
        updates = {}
        if not program.admissions_url:
            updates["admissions_url"] = GUIDANCE_URL
        current = (program.admission_requirements or "").strip().rstrip(".").casefold()
        if current in ("", "to be provided by the department", "to be validated by the department"):
            updates["admission_requirements"] = GUIDANCE_TEXT
        if updates:
            Program.objects.using(schema_editor.connection.alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0013_program_admissions_url")]
    operations = [migrations.RunPython(add_msca_admissions, migrations.RunPython.noop)]
