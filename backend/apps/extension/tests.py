from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import ExtensionProject


class ExtensionProjectTests(TransactionTestCase):
    def setUp(self):
        ExtensionProject.objects.all().delete()

    def test_import_preserves_reporting_categories_and_department_edits(self):
        migration = import_module("apps.extension.migrations.0002_department_extension")
        with connection.schema_editor() as editor:
            migration.add_extension_projects(apps, editor)
        self.assertEqual(ExtensionProject.objects.count(), 13)
        self.assertEqual(ExtensionProject.objects.filter(reporting_year=2026).count(), 5)
        self.assertEqual(ExtensionProject.objects.filter(title__icontains="TechBehindBars").count(), 1)
        response = self.client.get("/api/extension/projects/")
        self.assertEqual(response.status_code, 200)
        rows = response.json()
        self.assertEqual(len(rows), 13)
        quantum = next(row for row in rows if row["title"].startswith("my.Quantum"))
        self.assertEqual([group["label"] for group in quantum["participant_groups"]], ["MSU-IIT faculty", "Students"])
        self.assertEqual(len(quantum["participant_groups"][1]["members"]), 4)
        self.assertNotIn("source_note", rows[0])
        entry = ExtensionProject.objects.first()
        entry.extension_leader = "Department-reviewed leader"
        entry.is_published = False
        entry.save()
        with connection.schema_editor() as editor:
            migration.add_extension_projects(apps, editor)
        entry.refresh_from_db()
        self.assertEqual(entry.extension_leader, "Department-reviewed leader")
        self.assertEqual(len(self.client.get("/api/extension/projects/").json()), 12)
