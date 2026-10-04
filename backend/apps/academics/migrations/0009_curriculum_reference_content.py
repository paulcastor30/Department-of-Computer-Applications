"""Study overview based on supplied curricula; current requirements need validation.
Sources: BSCA revision and MSCA June 30, 2023 revision. This migration does
not add public documents or publish PDF extracts.
"""
from django.db import migrations


REFERENCE_FIELDS = {'BSCA': {'duration': 'The supplied revision outlines four years of study. Current duration is To '
                      'be validated by the Department.',
          'curriculum_load': 'To be validated by the Department.',
          'curriculum_evidence': 'This study overview is based on the supplied BSCA revision and '
                                 'department presentation. The current approved curriculum and '
                                 'unit total are To be validated by the Department.'},
 'MSCA': {'overview': 'MSCA advances the study of Computer Applications through specialized study '
                      'and research in embedded and connected systems. It builds on software, '
                      'firmware, and hardware foundations to address real-world computing '
                      'problems.',
          'formal_description': 'MSCA advances the study of Computer Applications through '
                                'specialized study and research in embedded and connected systems. '
                                'It builds on software, firmware, and hardware foundations to '
                                'address real-world computing problems.',
          'academic_areas': 'Advanced embedded systems: computing built into devices, including '
                            'how software and hardware work together.\n'
                            'Internet of Things (IoT): connected devices, their networks, and '
                            'device security.\n'
                            'Machine learning and computer vision: methods that help systems learn '
                            'from data and interpret images.\n'
                            'Cloud computing and IoT data analytics: services and methods for '
                            'managing and analyzing data from connected systems.',
          'curriculum_structure': 'Core study: advanced computer organization, advanced operating '
                                  'systems, research methods, and system development with emerging '
                                  'technologies.\n'
                                  'Specialized study: subjects selected in relation to the '
                                  'student’s research interests, including embedded systems and '
                                  'IoT.\n'
                                  'Research preparation: systematic review and a research seminar '
                                  'in ICT.\n'
                                  'Independent research: the Master’s Thesis.',
          'outcomes': 'Demonstrate mastery of advanced knowledge in Computer Applications to solve '
                      'complex computing problems and apply relevant approaches, resources, and '
                      'emerging technologies.\n'
                      'Apply practical skills, ideas, and related technologies to new problems and '
                      'societal issues in Computer Applications.\n'
                      'Conduct research, collaborate, and communicate results in written work and '
                      'presentations.',
          'duration': 'The supplied revision outlines a two-year study sequence. Current duration '
                      'is To be validated by the Department.',
          'curriculum_load': 'To be validated by the Department.',
          'curriculum_evidence': 'This study overview is based on the supplied MSCA revision dated '
                                 'June 30, 2023. The current approved curriculum and unit totals, '
                                 'including bridging requirements, are To be validated by the '
                                 'Department.'}}
PRIOR_MSCA_INTRODUCTION = "MSCA offers advanced study in Computer Applications, building on the software, firmware, and hardware foundations introduced in BSCA. Computer Applications bridges computing and the physical world."


def add_curriculum_reference(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code__in=REFERENCE_FIELDS):
        updates = {}
        for field, value in REFERENCE_FIELDS[program.code].items():
            current = (getattr(program, field) or "").strip()
            missing = current.rstrip(".").casefold() in ("", "to be provided by the department")
            previous_reference = program.code == "MSCA" and field in ("overview", "formal_description") and current == PRIOR_MSCA_INTRODUCTION
            if missing or previous_reference:
                updates[field] = value
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0008_msca_introduction")]
    operations = [migrations.RunPython(add_curriculum_reference, migrations.RunPython.noop)]
