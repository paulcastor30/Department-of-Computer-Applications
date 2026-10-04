from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import Program


class BSCAReferenceContentTests(TransactionTestCase):
    def setUp(self):
        # Earlier migrations seed both programs; isolate each scenario.
        Program.objects.all().delete()

    def test_reference_fills_missing_fields_and_preserves_editor_content(self):
        program = Program.objects.create(code="BSCA", title="BSCA", slug="bsca",
            overview="To be provided by the Department.",
            formal_description="Department-edited description", academic_areas="",
            outcomes="Updated official outcomes", is_published=False)
        migration = import_module("apps.academics.migrations.0007_bsca_reference_introduction")
        with connection.schema_editor() as editor:
            migration.add_bsca_reference(apps, editor)
        program.refresh_from_db()
        self.assertIn("software, firmware, and hardware", program.overview)
        self.assertIn("Firmware", program.academic_areas)
        self.assertEqual(program.formal_description, "Department-edited description")
        self.assertEqual(program.outcomes, "Updated official outcomes")
        self.assertFalse(program.is_published)

    def test_reference_does_not_change_msca(self):
        program = Program.objects.create(code="MSCA", title="MSCA", slug="msca", overview="Official MSCA text")
        migration = import_module("apps.academics.migrations.0007_bsca_reference_introduction")
        with connection.schema_editor() as editor:
            migration.add_bsca_reference(apps, editor)
        program.refresh_from_db()
        self.assertEqual(program.overview, "Official MSCA text")
        self.assertEqual(program.academic_areas, "")
