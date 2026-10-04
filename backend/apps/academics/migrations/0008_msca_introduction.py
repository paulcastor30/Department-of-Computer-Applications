"""MSCA introduction based on the department owner's clarification."""
from django.db import migrations


INTRODUCTION = 'MSCA offers advanced study in Computer Applications, building on the software, firmware, and hardware foundations introduced in BSCA. Computer Applications bridges computing and the physical world.'


def add_msca_introduction(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code="MSCA"):
        updates = {}
        for field in ("overview", "formal_description"):
            current = (getattr(program, field) or "").strip().rstrip(".").casefold()
            if current in ("", "to be provided by the department"):
                updates[field] = INTRODUCTION
        if updates:
            Program.objects.using(alias).filter(pk=program.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("academics", "0007_bsca_reference_introduction")]
    operations = [migrations.RunPython(add_msca_introduction, migrations.RunPython.noop)]
