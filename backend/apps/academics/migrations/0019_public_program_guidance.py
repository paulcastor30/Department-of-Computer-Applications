from importlib import import_module
from django.db import migrations

POLICY_URL = "https://msuiit.edu.ph/news/news-detail.php?id=2496"
PUBLICATION_TEXT = 'Publication requirement: follow the university’s revised graduate publication policy, approved in June 2026. Required evidence differs by graduate track. Ask the graduate coordinator which track and requirement apply to MSCA.'


def refine_program_guidance(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    Document = apps.get_model("academics", "ProgramDocument")
    alias = schema_editor.connection.alias
    prior = import_module("apps.academics.migrations.0012_program_study_guidance").GUIDANCE
    for program in Program.objects.using(alias).filter(code__in=("BSCA", "MSCA")):
        updates = {}
        degree = "Four" if program.code == "BSCA" else "Two"
        if program.duration == f"{degree}-year study sequence shown in the supplied prospectus.":
            updates["duration"] = f"{degree}-year study sequence in the {program.code} prospectus."
        if program.curriculum_evidence == prior[program.code]["curriculum_evidence"]:
            updates["curriculum_evidence"] = program.curriculum_evidence.replace("Source: department-supplied", "Curriculum source:")
        if program.code == "MSCA":
            old = prior["MSCA"]["completion_requirements"].splitlines()[-1]
            lines = (program.completion_requirements or "").splitlines()
            if old in lines:
                updates["completion_requirements"] = "\n".join(PUBLICATION_TEXT if line == old else line for line in lines)
            Document.objects.using(alias).get_or_create(
                program_id=program.pk,
                title="Revised university graduate publication policy (June 2026)",
                defaults={"document_type": "OTHER", "url": POLICY_URL, "note": "Confirm the graduate track and required evidence with your coordinator.", "is_public": True, "sort_order": 20},
            )
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0018_program_social_descriptions")]
    operations = [migrations.RunPython(refine_program_guidance, migrations.RunPython.noop)]
