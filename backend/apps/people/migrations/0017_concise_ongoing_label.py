"""Shorten the existing ongoing note without reclassifying any education record."""
from django.db import migrations


def shorten_ongoing_note(apps, schema_editor):
    Education = apps.get_model("people", "FacultyEducation")
    Education.objects.using(schema_editor.connection.alias).filter(
        notes="Ongoing study; degree not yet completed."
    ).update(notes="Ongoing")


class Migration(migrations.Migration):
    dependencies = [("people", "0016_alce_confirmed_education_and_expertise")]
    operations = [migrations.RunPython(shorten_ongoing_note, migrations.RunPython.noop)]
