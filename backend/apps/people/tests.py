from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import FacultyMember, FacultyEducation, FacultyPublication


class FacultyImportTests(TransactionTestCase):
    def setUp(self):
        FacultyMember.objects.all().delete()

    def test_import_keeps_existing_links_and_professional_records(self):
        member = FacultyMember.objects.create(title="Paul Rodolf Castor", slug="existing-castor",
            email="paulrodolf.castor@g.msuiit.edu.ph", photo="faculty/castor.png", is_published=True)
        FacultyPublication.objects.create(faculty=member, title="Existing publication")
        migration = import_module("apps.people.migrations.0004_updated_faculty_profiles_2026")
        with connection.schema_editor() as editor:
            migration.import_profiles(apps, editor)
            migration.import_profiles(apps, editor)
        member.refresh_from_db()
        self.assertEqual(FacultyMember.objects.count(), 13)
        self.assertEqual(member.slug, "existing-castor")
        self.assertEqual(member.photo.name, "faculty/castor.png")
        self.assertEqual(member.publications.count(), 1)
        self.assertEqual(member.education_records.count(), 3)
        self.assertEqual(FacultyMember.objects.filter(faculty_category="Lecturer").count(), 2)
        alce = FacultyMember.objects.get(email="applerose.alce@g.msuiit.edu.ph")
        doctorate = alce.education_records.get(degree_level="doctorate")
        self.assertIsNone(doctorate.year_completed)
        self.assertIn("not yet completed", doctorate.notes)
        halibas = FacultyMember.objects.get(email="jerry.halibas@g.msuiit.edu.ph")
        self.assertIn("validated", halibas.education_records.get(degree_level="doctorate").notes)

    def test_public_api_excludes_unpublished_profiles(self):
        FacultyMember.objects.create(title="Public Person", slug="public", is_published=True)
        FacultyMember.objects.create(title="Private Person", slug="private", is_published=False)
        response = self.client.get("/api/people/faculty/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([p["slug"] for p in response.json()], ["public"])
        self.assertEqual(self.client.get("/api/people/faculty/private/").status_code, 404)
