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


class ConferenceRecordTests(TransactionTestCase):
    def setUp(self):
        from .models import ConferenceRecord
        ConferenceRecord.objects.all().delete()

    def test_import_keeps_withdrawals_distinct_and_preserves_edits(self):
        from .models import ConferenceRecord
        migration = import_module("apps.research.migrations.0004_department_conferences")
        with connection.schema_editor() as editor:
            migration.add_conference_records(apps, editor)
        self.assertEqual(ConferenceRecord.objects.count(), 45)
        self.assertEqual(ConferenceRecord.objects.filter(withdrawn=True).count(), 2)
        self.assertEqual(ConferenceRecord.objects.filter(year=2026).count(), 29)
        self.assertEqual(ConferenceRecord.objects.filter(title__startswith="VermiSense").count(), 2)
        self.assertTrue(ConferenceRecord.objects.filter(year=2024, location="Athens, Greece").exists())
        entry = ConferenceRecord.objects.first()
        entry.authors = "Department-corrected authors"
        entry.is_published = False
        entry.save()
        with connection.schema_editor() as editor:
            migration.add_conference_records(apps, editor)
        entry.refresh_from_db()
        self.assertEqual(entry.authors, "Department-corrected authors")
        response = self.client.get("/api/research/conferences/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 44)
        self.assertEqual(sum(x["withdrawn"] for x in response.json()), 2)
        self.assertNotIn("source_note", response.json()[0])


class PublicationRecordTests(TransactionTestCase):
    def setUp(self):
        from .models import PublicationRecord
        PublicationRecord.objects.all().delete()

    def test_verified_import_and_public_visibility(self):
        from .models import PublicationRecord
        migration = import_module("apps.research.migrations.0006_department_publications")
        with connection.schema_editor() as editor:
            migration.add_publication_records(apps, editor)
        self.assertEqual(PublicationRecord.objects.count(), 29)
        self.assertEqual(PublicationRecord.objects.exclude(doi="").count(), 28)
        self.assertEqual(PublicationRecord.objects.filter(kind="PREPRINT").count(), 1)
        mask = PublicationRecord.objects.get(title__startswith="Mask, Hairnet")
        eggplant = PublicationRecord.objects.get(title__startswith="Eggplant Leaf")
        self.assertEqual(mask.doi.lower(), "10.1109/hnicem60674.2023.10589183")
        self.assertNotEqual(mask.doi, eggplant.doi)
        abaca = PublicationRecord.objects.get(title__startswith="Developing a Computer Vision")
        self.assertIn("Leah A. Alindayo", abaca.authors)
        mask.authors = "Department-reviewed authors"
        mask.is_published = False
        mask.save()
        with connection.schema_editor() as editor:
            migration.add_publication_records(apps, editor)
        mask.refresh_from_db()
        self.assertEqual(mask.authors, "Department-reviewed authors")
        response = self.client.get("/api/research/publications/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 28)
        self.assertNotIn("source_note", response.json()[0])
