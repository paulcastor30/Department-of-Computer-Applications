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


    def test_transfer_preserves_one_profile_and_graduate_affiliation(self):
        member = FacultyMember.objects.create(title="Ernesto E. Empig", slug="existing-empig",
            is_published=True, supporting_programs="BSCA", email="official@example.edu")
        FacultyPublication.objects.create(faculty=member, title="Existing research")
        migration = import_module("apps.people.migrations.0006_empig_sis_transfer")
        with connection.schema_editor() as editor:
            migration.record_empig_transfer(apps, editor)
            migration.record_empig_transfer(apps, editor)
        member.refresh_from_db()
        self.assertEqual(FacultyMember.objects.count(), 1)
        self.assertEqual(member.slug, "existing-empig")
        self.assertTrue(member.transferred_from_dca)
        self.assertEqual(member.service_classification, "affiliated_msca_faculty")
        self.assertEqual(member.home_unit, "School of Interdisciplinary Studies (SIS)")
        self.assertEqual(member.supporting_programs, "BSCA, MSCA")
        self.assertEqual(member.publications.count(), 1)
        self.assertEqual(member.appointment_or_assignment_note.count("00181-IIT"), 1)
        response = self.client.get("/api/people/faculty/").json()
        self.assertEqual(len(response), 1)
        self.assertTrue(response[0]["transferred_from_dca"])
        self.assertEqual(response[0]["service_classification"], "affiliated_msca_faculty")


    def test_pepito_acceptance_retains_current_rank_and_does_not_assign_permanency(self):
        member = FacultyMember.objects.create(title="Collien Princess C. Pepito", slug="existing-pepito",
            email="collienprincess.pepito@g.msuiit.edu.ph", position="Assistant Lecturer",
            is_published=True, appointment_or_assignment_note="Existing department note")
        FacultyPublication.objects.create(faculty=member, title="Existing professional work")
        migration = import_module("apps.people.migrations.0007_pepito_appointment_status")
        with connection.schema_editor() as editor:
            migration.record_pepito_appointment(apps, editor)
            migration.record_pepito_appointment(apps, editor)
        member.refresh_from_db()
        self.assertEqual(member.position, "Assistant Lecturer")
        self.assertEqual(member.faculty_category, "Lecturer")
        self.assertEqual(member.personnel_type, "faculty")
        self.assertEqual(member.employment_classification, "")
        self.assertIn("Existing department note", member.appointment_or_assignment_note)
        self.assertEqual(member.appointment_or_assignment_note.count("Accepted as faculty"), 1)
        self.assertEqual(member.slug, "existing-pepito")
        self.assertEqual(member.publications.count(), 1)
        self.assertEqual(FacultyMember.objects.count(), 1)
        detail = self.client.get("/api/people/faculty/existing-pepito/").json()
        self.assertIn("plantilla item", detail["appointment_or_assignment_note"])


    def test_allied_update_preserves_links_and_records_and_marks_resignation(self):
        empig = FacultyMember.objects.create(title="Ernesto E. Empig", slug="existing-empig", transferred_from_dca=True, home_unit="School of Interdisciplinary Studies (SIS)", email="empig@example.edu")
        llantos = FacultyMember.objects.create(title="Llantos, Orven E.", slug="existing-llantos")
        joel = FacultyMember.objects.create(title="Joel I. Miano", slug="existing-miano", is_published=True)
        FacultyPublication.objects.create(faculty=joel, title="Historical publication")
        migration = import_module("apps.people.migrations.0009_allied_and_resigned_faculty")
        with connection.schema_editor() as editor:
            migration.import_allied_and_resigned(apps, editor)
            migration.import_allied_and_resigned(apps, editor)
        self.assertEqual(FacultyMember.objects.count(), 10)
        self.assertEqual(FacultyMember.objects.filter(service_classification="affiliated_msca_faculty").count(), 9)
        empig.refresh_from_db()
        self.assertEqual(empig.slug, "existing-empig")
        self.assertTrue(empig.transferred_from_dca)
        self.assertEqual(empig.home_unit, "School of Interdisciplinary Studies (SIS)")
        self.assertEqual(empig.email, "empig@example.edu")
        llantos.refresh_from_db()
        self.assertEqual(llantos.title, "Orven E. Llantos")
        self.assertEqual(llantos.slug, "existing-llantos")
        joel.refresh_from_db()
        self.assertEqual(joel.faculty_status, "resigned")
        self.assertFalse(joel.active_affiliation)
        self.assertEqual(joel.slug, "existing-miano")
        self.assertEqual(joel.publications.count(), 1)
        galido = FacultyMember.objects.get(title="Adrian P. Galido")
        self.assertEqual(galido.education_records.filter(degree_level="other").count(), 1)
        self.assertEqual(FacultyMember.objects.get(title="Hareez V. Quimque").prc_license_number, "0050020")
        self.assertIsNone(FacultyMember.objects.get(title="Carl John O. Salaan").education_records.get(degree_level="doctorate").year_completed)
        empig.specialization_areas = "Department-reviewed specialization"
        empig.save()
        with connection.schema_editor() as editor:
            migration.import_allied_and_resigned(apps, editor)
        empig.refresh_from_db()
        self.assertEqual(empig.specialization_areas, "Department-reviewed specialization")
