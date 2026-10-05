from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import SiteSetting, DepartmentProfile


class PublicContentTests(TransactionTestCase):
    def setUp(self):
        SiteSetting.objects.all().delete()
        DepartmentProfile.objects.all().delete()

    def test_replaces_test_content_without_inventing_department_statements(self):
        SiteSetting.objects.all().delete()
        profile = DepartmentProfile.objects.create(overview="asdfasdf", mission="fasdfasdf", vision="asdfasdf")
        migration = import_module("apps.core.migrations.0002_department_public_content")
        with connection.schema_editor() as editor:
            migration.populate_public_content(apps, editor)
            migration.populate_public_content(apps, editor)
        profile.refresh_from_db()
        self.assertEqual(profile.overview, migration.OVERVIEW)
        self.assertEqual(profile.mission, "")
        self.assertEqual(profile.vision, "")
        self.assertEqual(SiteSetting.objects.count(), 1)
        self.assertEqual(SiteSetting.objects.get().primary_email, "ccs.ca@g.msuiit.edu.ph")

    def test_preserves_editor_contacts_and_profile(self):
        SiteSetting.objects.all().delete()
        setting = SiteSetting.objects.create(primary_email="official@example.edu", address="Approved address")
        profile = DepartmentProfile.objects.create(overview="Approved introduction", mission="Approved statement")
        migration = import_module("apps.core.migrations.0002_department_public_content")
        with connection.schema_editor() as editor:
            migration.populate_public_content(apps, editor)
        setting.refresh_from_db()
        profile.refresh_from_db()
        self.assertEqual(setting.primary_email, "official@example.edu")
        self.assertEqual(setting.address, "Approved address")
        self.assertEqual(profile.overview, "Approved introduction")
        self.assertEqual(profile.mission, "Approved statement")
