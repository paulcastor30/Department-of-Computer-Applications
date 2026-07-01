from django.db import migrations, models


BSCA = {
    "code": "BSCA",
    "title": "Bachelor of Science in Computer Applications",
    "slug": "bsca",
    "degree_level": "UNDERGRAD",
    "overview": "To be provided by the Department.",
    "duration": "To be provided by the Department.",
    "curriculum_load": "To be provided by the Department.",
    "recognition": "",
    "outcomes": "To be provided by the Department.",
    "curriculum_evidence": "",
    "quality_evidence": "",
    "admission_requirements": "To be provided by the Department.",
    "progression_requirements": "To be provided by the Department.",
    "career_opportunities": "To be provided by the Department.",
    "is_published": True,
    "featured": True,
    "sort_order": 10,
}


MSCA = {
    "code": "MSCA",
    "title": "Master of Science in Computer Applications",
    "slug": "msca",
    "degree_level": "GRAD",
    "overview": "To be provided by the Department.",
    "duration": "To be provided by the Department.",
    "curriculum_load": "To be provided by the Department.",
    "recognition": "",
    "outcomes": "To be provided by the Department.",
    "curriculum_evidence": "",
    "quality_evidence": "",
    "admission_requirements": "To be provided by the Department.",
    "progression_requirements": "To be provided by the Department.",
    "career_opportunities": "To be provided by the Department.",
    "historical_notes": "",
    "is_published": True,
    "featured": True,
    "sort_order": 20,
}


def seed_programs(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    for payload in (BSCA, MSCA):
        program, created = Program.objects.get_or_create(
            code=payload["code"],
            defaults=payload,
        )
        if created:
            continue

        changed = False
        for field, value in payload.items():
            current = getattr(program, field)
            if current in ("", None, False) and value not in ("", None):
                setattr(program, field, value)
                changed = True
        if changed:
            program.save()


class Migration(migrations.Migration):

    dependencies = [
        ("academics", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="program",
            name="curriculum_evidence",
            field=models.TextField(blank=True, help_text="Enter one curriculum feature or evidence item per line."),
        ),
        migrations.AddField(
            model_name="program",
            name="curriculum_load",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="program",
            name="duration",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="program",
            name="historical_notes",
            field=models.TextField(blank=True, help_text="Enter historical notes, linkages, or dated curriculum notes. Avoid presenting expired linkages as current offers."),
        ),
        migrations.AddField(
            model_name="program",
            name="outcomes",
            field=models.TextField(blank=True, help_text="Enter one program outcome per line."),
        ),
        migrations.AddField(
            model_name="program",
            name="progression_requirements",
            field=models.TextField(blank=True, help_text="Enter one progression or retention requirement per line."),
        ),
        migrations.AddField(
            model_name="program",
            name="quality_evidence",
            field=models.TextField(blank=True, help_text="Enter one accreditation evidence item per line."),
        ),
        migrations.AddField(
            model_name="program",
            name="recognition",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.RunPython(seed_programs, migrations.RunPython.noop),
    ]
