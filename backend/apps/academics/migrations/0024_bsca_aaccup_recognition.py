from django.db import migrations


# Accreditation statement supplied by the Department website owner.
RECOGNITION = "BS in Computer Applications is AACCUP Level III Re-accredited for October 16, 2025 to October 15, 2029"


def update_recognition(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    Program.objects.using(schema_editor.connection.alias).filter(code="BSCA").update(
        recognition=RECOGNITION,
    )


class Migration(migrations.Migration):
    dependencies = [("academics", "0023_sojt_guide_reference")]
    operations = [migrations.RunPython(update_recognition, migrations.RunPython.noop)]
