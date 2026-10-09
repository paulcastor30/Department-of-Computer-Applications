from django.db import migrations


def set_contact(apps, schema_editor):
    Settings = apps.get_model("alumni", "AlumniSettings")
    Settings.objects.using(schema_editor.connection.alias).update_or_create(pk=1, defaults={
        "contact_label": "Paul Rodolf P. Castor, Department chairperson",
        "contact_email": "paulrodolf.castor@g.msuiit.edu.ph",
    })


class Migration(migrations.Migration):
    dependencies = [("alumni", "0003_alter_alumnisettings_options")]
    operations = [migrations.RunPython(set_contact, migrations.RunPython.noop)]
