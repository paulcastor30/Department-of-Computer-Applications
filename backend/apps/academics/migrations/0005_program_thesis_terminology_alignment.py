from django.db import migrations


def update_program_thesis_terminology(apps, schema_editor):
    Program = apps.get_model("academics", "Program")

    Program.objects.filter(code="BSCA").update(
        formal_description="To be provided by the Department.",
        culminating_requirement="Undergraduate Thesis",
        thesis_information="The culminating academic requirement is the Undergraduate Thesis.\nOfficial thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department.",
    )

    Program.objects.filter(code="MSCA").update(
        formal_description="To be provided by the Department.",
        culminating_requirement="Master’s Thesis or Graduate Thesis",
        thesis_information="The culminating academic requirement is the Master’s Thesis or Graduate Thesis.\nOfficial thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department.",
    )


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0004_program_academic_areas_program_academic_orientation_and_more"),
    ]

    operations = [
        migrations.RunPython(update_program_thesis_terminology, migrations.RunPython.noop),
    ]
