import json
from pathlib import Path
from django.db import migrations


def seed_reference(apps, schema_editor):
    Guide = apps.get_model("academics", "SOJTGuide")
    content = json.loads((Path(__file__).resolve().parent.parent / "data" / "sojt-guide-v1.json").read_text())
    # Never publish the draft or replace an editor's existing document.
    Guide.objects.get_or_create(slug="bsca", defaults={"content": content, "is_published": False})


class Migration(migrations.Migration):
    dependencies = [("academics", "0022_sojtguide")]
    operations = [migrations.RunPython(seed_reference, migrations.RunPython.noop)]
