from django.db import migrations


def settings_record(apps, schema_editor):
    apps.get_model("alumni", "AlumniSettings").objects.using(schema_editor.connection.alias).get_or_create(pk=1, defaults={"contact_label": "Department chairperson", "accepting_updates": False})


class Migration(migrations.Migration):
    dependencies = [("alumni", "0001_initial")]
    operations = [migrations.RunPython(settings_record, migrations.RunPython.noop)]
