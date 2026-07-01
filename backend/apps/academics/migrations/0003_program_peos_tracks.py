from django.db import migrations, models


BSCA_PRESENTATION_CONTENT = {
    "overview": "To be provided by the Department.",
    "recognition": "",
    "program_educational_objectives": "",
    "outcomes": "To be provided by the Department.",
    "specialization_tracks": "",
    "curriculum_evidence": "",
    "career_opportunities": "To be provided by the Department.",
}


def add_bsca_presentation_content(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    try:
        program = Program.objects.get(code="BSCA")
    except Program.DoesNotExist:
        return

    for field, value in BSCA_PRESENTATION_CONTENT.items():
        current = getattr(program, field, "")
        if value and value not in (current or ""):
            setattr(program, field, value)
    program.save()


class Migration(migrations.Migration):

    dependencies = [
        ("academics", "0002_program_accreditation_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="program",
            name="program_educational_objectives",
            field=models.TextField(blank=True, help_text="Enter one program educational objective per line."),
        ),
        migrations.AddField(
            model_name="program",
            name="specialization_tracks",
            field=models.TextField(blank=True, help_text="Enter one specialization track, focus area, or track course per line."),
        ),
        migrations.RunPython(add_bsca_presentation_content, migrations.RunPython.noop),
    ]
