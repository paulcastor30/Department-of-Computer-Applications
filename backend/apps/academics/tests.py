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


    def test_msca_introduction_fills_placeholder_and_preserves_editor_description(self):
        program = Program.objects.create(code="MSCA", title="MSCA", slug="msca",
            overview="To be provided by the Department.", formal_description="Department-edited MSCA text",
            admission_requirements="Official entry rules", is_published=False)
        migration = import_module("apps.academics.migrations.0008_msca_introduction")
        with connection.schema_editor() as editor:
            migration.add_msca_introduction(apps, editor)
        program.refresh_from_db()
        self.assertEqual(program.overview, migration.INTRODUCTION)
        self.assertEqual(program.formal_description, "Department-edited MSCA text")
        self.assertEqual(program.admission_requirements, "Official entry rules")
        self.assertFalse(program.is_published)


    def test_curriculum_reference_preserves_editor_content_and_adds_no_downloads(self):
        program = Program.objects.create(code="MSCA", title="MSCA", slug="msca",
            overview="MSCA offers advanced study in Computer Applications, building on the software, firmware, and hardware foundations introduced in BSCA. Computer Applications bridges computing and the physical world.",
            formal_description="Official editor description", outcomes="Official outcomes", duration="Approved duration")
        migration = import_module("apps.academics.migrations.0009_curriculum_reference_content")
        with connection.schema_editor() as editor:
            migration.add_curriculum_reference(apps, editor)
        program.refresh_from_db()
        self.assertIn("specialized study and research", program.overview)
        self.assertEqual(program.formal_description, "Official editor description")
        self.assertEqual(program.outcomes, "Official outcomes")
        self.assertEqual(program.duration, "Approved duration")
        self.assertIn("Advanced embedded systems", program.academic_areas)
        self.assertIn("To be validated", program.curriculum_evidence)
        self.assertFalse(program.documents.exists())


    def test_prospectuses_replace_old_reference_fields_and_preserve_editor_values(self):
        previous = import_module("apps.academics.migrations.0009_curriculum_reference_content")
        program = Program.objects.create(code="BSCA", title="BSCA", slug="bsca", overview="Official introduction",
            duration="Editor-confirmed duration", curriculum_load=previous.REFERENCE_FIELDS["BSCA"]["curriculum_load"],
            curriculum_evidence=previous.REFERENCE_FIELDS["BSCA"]["curriculum_evidence"])
        migration = import_module("apps.academics.migrations.0010_department_prospectuses")
        with connection.schema_editor() as editor:
            migration.use_prospectuses(apps, editor)
            migration.use_prospectuses(apps, editor)
        program.refresh_from_db()
        self.assertEqual(program.duration, "Editor-confirmed duration")
        self.assertIn("147 units", program.curriculum_load)
        self.assertIn("BOR Resolution No. 129", program.curriculum_evidence)
        self.assertEqual(program.documents.count(), 1)
        self.assertTrue(program.documents.get().url.endswith("/curricula/bsca-prospectus.pdf"))


    def test_guidance_preserves_admissions_and_department_edits(self):
        from datetime import date
        from .serializers import ProgramSerializer
        program = Program.objects.create(code="MSCA", title="MSCA", slug="msca",
            admission_requirements="University admission rules", duration="Confirmed duration",
            curriculum_load="Confirmed load", completion_requirements="Department requirement",
            content_reviewed_on=date(2026, 9, 1))
        migration = import_module("apps.academics.migrations.0012_program_study_guidance")
        with connection.schema_editor() as editor:
            migration.add_program_guidance(apps, editor)
            migration.add_program_guidance(apps, editor)
        program.refresh_from_db()
        self.assertEqual(program.admission_requirements, "University admission rules")
        self.assertEqual(program.duration, "Confirmed duration")
        self.assertEqual(program.curriculum_load, "Confirmed load")
        self.assertEqual(program.completion_requirements, "Department requirement")
        self.assertEqual(program.content_reviewed_on, date(2026, 9, 1))
        payload = ProgramSerializer(program).data
        self.assertEqual(payload["content_reviewed_on"], "2026-09-01")
        self.assertEqual(payload["completion_requirements_list"], ["Department requirement"])
        self.assertTrue(any("Bridging courses" in item for item in payload["study_plan_guidance_list"]))
