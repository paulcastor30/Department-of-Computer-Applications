"""Use the department-supplied public prospectuses instead of review-document extracts."""
from importlib import import_module
from django.db import migrations


PROSPECTUS_FIELDS = {'BSCA': {'duration': 'Four-year study sequence shown in the supplied prospectus.',
          'curriculum_load': '147 units excluding NSTP; 153 units including the six NSTP units.',
          'curriculum_evidence': 'Based on the department-supplied BSCA prospectus, which cites '
                                 'BOR Resolution No. 129, Series of 2018. Confirm the applicable '
                                 'curriculum with the department before enrolling.'},
 'MSCA': {'duration': 'Two-year study sequence shown in the supplied prospectus.',
          'curriculum_load': '31 units for the non-scholar plan; 34 for the ERDT scholarship plan; '
                             '43 for the plan with bridging courses. Confirm your applicable plan '
                             'with the department.',
          'curriculum_evidence': 'Based on the department-supplied MSCA prospectus, which cites BOR Resolution No. 128, Series of 2023. It shows separate non-scholar, ERDT scholarship, and bridging study plans. Confirm your applicable plan with the department before enrolling.'}}


def use_prospectuses(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    ProgramDocument = apps.get_model("academics", "ProgramDocument")
    prior = import_module("apps.academics.migrations.0009_curriculum_reference_content").REFERENCE_FIELDS
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code__in=PROSPECTUS_FIELDS):
        updates = {}
        for field, value in PROSPECTUS_FIELDS[program.code].items():
            current = (getattr(program, field) or "").strip()
            missing = current.rstrip(".").casefold() in ("", "to be provided by the department", "to be validated by the department")
            if missing or current == prior[program.code].get(field):
                updates[field] = value
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)
        pages = 5 if program.code == "BSCA" else 4
        ProgramDocument.objects.using(alias).get_or_create(
            program_id=program.pk, title=f"{program.code} prospectus (PDF, {pages} pages)",
            defaults={"document_type": "CURRICULUM", "url": f"https://msuiit-comapps.vercel.app/curricula/{program.code.lower()}-prospectus.pdf",
                      "note": "Department-supplied prospectus. Confirm the study plan applicable to you before enrolling.",
                      "is_public": True, "sort_order": 0},
        )


class Migration(migrations.Migration):
    dependencies = [("academics", "0009_curriculum_reference_content")]
    operations = [migrations.RunPython(use_prospectuses, migrations.RunPython.noop)]
