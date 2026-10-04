from datetime import date
from importlib import import_module
from django.db import migrations

GUIDANCE = {'BSCA': {'completion_requirements': 'Undergraduate Thesis: BCA199 is listed as a three-unit '
                                     'course, following Research Methods.\n'
                                     'On-the-job training: BCA197 is listed as six units and 700 '
                                     'hours in the final semester.',
          'curriculum_evidence': 'Source: department-supplied BSCA prospectus, citing BOR '
                                 'Resolution No. 129, Series of 2018.',
          'study_plan_guidance': 'Units: the credit assigned to a course. The total describes the '
                                 'study load, not the number of courses.\n'
                                 'NSTP (National Service Training Program): the two first-year '
                                 'subjects shown separately in parentheses in the prospectus. They '
                                 'add six units to the 147-unit total.'},
 'MSCA': {'completion_requirements': 'Master’s Thesis: MCA300 is listed as a six-unit course.\n'
                                     'Comprehensive examination: the prospectus lists this '
                                     'examination after the required core study. Ask the '
                                     'department about scheduling and preparation.\n'
                                     'Publication: the prospectus specifies at least one published '
                                     'article in a refereed journal or juried creative-work '
                                     'outlet. Ask the department about the applicable submission '
                                     'and assessment process.',
          'curriculum_evidence': 'Source: department-supplied MSCA prospectus, citing BOR '
                                 'Resolution No. 128, Series of 2023.',
          'study_plan_guidance': 'Units: the credit assigned to a course. Different study plans '
                                 'have different total units.\n'
                                 'Non-scholar plan: the 31-unit study sequence labelled “A. '
                                 'Non-Scholar” in the prospectus.\n'
                                 'ERDT (Engineering Research and Development for Technology): the '
                                 'scholarship program named in the 34-unit study plan, which '
                                 'includes Technology Entrepreneurship.\n'
                                 'Bridging courses: additional foundational subjects used to '
                                 'prepare a student for advanced study. The prospectus shows a '
                                 '43-unit plan with bridging courses, with subjects selected '
                                 'through the adviser’s evaluation of the study plan.'}}


def add_program_guidance(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    ProgramDocument = apps.get_model("academics", "ProgramDocument")
    prior = import_module("apps.academics.migrations.0010_department_prospectuses").PROSPECTUS_FIELDS
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code__in=GUIDANCE):
        updates = {}
        for field, value in GUIDANCE[program.code].items():
            current = (getattr(program, field) or "").strip()
            missing = current.rstrip(".").casefold() in ("", "to be provided by the department", "to be validated by the department")
            if missing or (field == "curriculum_evidence" and current == prior[program.code][field]):
                updates[field] = value
        if program.content_reviewed_on is None:
            updates["content_reviewed_on"] = date(2026, 10, 5)
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)
        ProgramDocument.objects.using(alias).filter(
            program_id=program.pk,
            title=f"{program.code} prospectus (PDF, {5 if program.code == 'BSCA' else 4} pages)",
            note="Department-supplied prospectus. Confirm the study plan applicable to you before enrolling.",
        ).update(note="Department-supplied prospectus.")


class Migration(migrations.Migration):
    dependencies = [("academics", "0011_program_completion_requirements_and_more")]
    operations = [migrations.RunPython(add_program_guidance, migrations.RunPython.noop)]
