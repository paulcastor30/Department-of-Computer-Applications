import json
from pathlib import Path
from django.db import migrations


def add_collection(apps, schema_editor):
    Resource = apps.get_model("academics", "LearningResource")
    collection = json.loads((Path(__file__).resolve().parents[1] / "data/learning-roadmap-v1.json").read_text())
    for resource in collection["resources"]:
        Resource.objects.using(schema_editor.connection.alias).get_or_create(
            slug=resource["slug"], defaults={key: value for key, value in resource.items() if key != "slug"})


class Migration(migrations.Migration):
    dependencies = [("academics", "0034_learningresource_source_collection_and_more")]
    operations = [migrations.RunPython(add_collection, migrations.RunPython.noop)]
