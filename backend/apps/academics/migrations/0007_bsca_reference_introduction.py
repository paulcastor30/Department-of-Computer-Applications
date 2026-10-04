"""BSCA reference: BS of Computer Applications.pptx, slides 5–6, 9 and 14.
Learning areas describe the supplied presentation, not an official course catalog.
"""
from django.db import migrations


REFERENCE_FIELDS = {'overview': 'Computer Applications bridges computing and the physical world. BSCA brings together '
             'software, firmware, and hardware to develop embedded, connected, and intelligent '
             'systems for real-world applications.',
 'formal_description': 'Computer Applications bridges computing and the physical world. BSCA '
                       'brings together software, firmware, and hardware to develop embedded, '
                       'connected, and intelligent systems for real-world applications.',
 'academic_orientation': 'Software, firmware, and hardware integration',
 'academic_areas': 'Software: the programs, logic, and interfaces people use.\n'
                   'Firmware: software that controls electronic devices.\n'
                   'Hardware: the physical components of a computer or electronic system.\n'
                   'Embedded and connected systems: computing built into devices, including '
                   'devices that exchange information over a network.',
 'curriculum_structure': 'Foundations: programming, mathematics, digital systems, and computer '
                         'architecture.\n'
                         'Core development: microcontrollers, operating systems, embedded systems, '
                         'and software and firmware.\n'
                         'System integration: the Internet of Things (IoT), connected systems, '
                         'embedded intelligence, and hardware–software integration.\n'
                         'Application: technical projects, research, Undergraduate Thesis, and '
                         'industry training.',
 'outcomes': 'Apply knowledge of mathematics and sciences to solve computer electronics problems.\n'
             'Analyze a problem, formulate and identify solutions for computer applications and '
             'technology problems using analytical tools appropriate to areas of specialization.\n'
             'Apply design principle using software and firmware for broadly defined computer '
             'applications.\n'
             'Implement and evaluate computer application systems, components or processes to meet '
             'specific needs.\n'
             'Select and apply appropriate techniques, resources and modern computing and ICT '
             'tools necessary for computer applications practices.\n'
             'Function effectively as a member or leader of a development team recognizing the '
             'different roles within a team to accomplish a common goal.\n'
             'Communicate effectively with the computer applications community and with society at '
             'large about complex computer application activities through logical writing, '
             'presentations, and clear instructions.\n'
             'Understand and commit to professional ethics and responsibilities and norms of '
             'computer and cyber technology practices.\n'
             'Recognize the need for and have the ability, to engage in independent learning for '
             'continual development as a technology specialist.'}


def add_bsca_reference(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code="BSCA"):
        updates = {}
        for field, value in REFERENCE_FIELDS.items():
            current = (getattr(program, field) or "").strip().rstrip(".").casefold()
            if current in ("", "to be provided by the department"):
                updates[field] = value
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0006_program_placeholder_readiness")]
    operations = [migrations.RunPython(add_bsca_reference, migrations.RunPython.noop)]
