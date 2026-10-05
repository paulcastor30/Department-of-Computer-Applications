from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import ResearchProject


class ResearchProjectTests(TransactionTestCase):
    def setUp(self):
        ResearchProject.objects.all().delete()

    def test_import_preserves_edits_and_has_the_supplied_projects(self):
        migration = import_module("apps.research.migrations.0002_department_projects")
        with connection.schema_editor() as editor:
            migration.add_department_projects(apps, editor)
        self.assertEqual(ResearchProject.objects.count(), 15)
        self.assertEqual(ResearchProject.objects.filter(funding="EXTERNAL").count(), 1)
        project = ResearchProject.objects.get(slug="gakit")
        self.assertIn("Castor, Paul Rodolf P.", project.team_members)
        project.research_leader = "Department-reviewed leader"
        project.is_published = False
        project.save()
        with connection.schema_editor() as editor:
            migration.add_department_projects(apps, editor)
        project.refresh_from_db()
        self.assertEqual(project.research_leader, "Department-reviewed leader")
        response = self.client.get("/api/research/projects/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 14)
        self.assertNotIn("source_note", response.json()[0])
        self.assertEqual(ResearchProject.objects.get(slug="emerging-technology-prototypes").team_members.count("Apple Rose"), 1)
