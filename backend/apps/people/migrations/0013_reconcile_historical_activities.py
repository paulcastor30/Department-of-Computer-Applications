from django.db import migrations
from apps.people.reconciliation_v1 import reconcile


def link_historical_records(apps, schema_editor):
    # No metadata is overwritten; uncertain records remain for the internal report.
    reconcile(apps, schema_editor.connection.alias, apply=True)


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0012_historical_activity_links"),
        ("research", "0007_project_explanations"),
        ("extension", "0003_project_explanations"),
    ]
    # Preserve established credits on reversal, including subsequent staff edits.
    operations = [migrations.RunPython(link_historical_records, migrations.RunPython.noop)]
