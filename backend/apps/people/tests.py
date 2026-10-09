from importlib import import_module
from django.apps import apps
from django.db import connection
from django.test import TransactionTestCase
from .models import DepartmentRole, FacultyMember, FacultyEducation, FacultyPublication


class FacultyImportTests(TransactionTestCase):
    def setUp(self):
        FacultyMember.objects.all().delete()

    def test_concise_ongoing_note_does_not_reclassify_unknown_records(self):
        member = FacultyMember.objects.create(title="Example Faculty", slug="example")
        ongoing = FacultyEducation.objects.create(faculty=member, degree_level="doctorate",
            notes="Ongoing study; degree not yet completed.")
        unknown = FacultyEducation.objects.create(faculty=member, degree_level="doctorate",
            notes="Completion status to be validated by the Department.")
        migration = import_module("apps.people.migrations.0017_concise_ongoing_label")
        with connection.schema_editor() as editor:
            migration.shorten_ongoing_note(apps, editor)
        ongoing.refresh_from_db()
        unknown.refresh_from_db()
        self.assertEqual(ongoing.notes, "Ongoing")
        self.assertIsNone(ongoing.year_completed)
        self.assertEqual(unknown.notes, "Completion status to be validated by the Department.")

    def test_alce_confirmations_preserve_unresolved_education_and_replace_public_expertise(self):
        from .models import FacultyExpertise
        member = FacultyMember.objects.create(title="Apple Rose B. Alce", slug="apple-rose-alce",
            email="applerose.alce@g.msuiit.edu.ph", is_published=True)
        institution = "Mindanao State University - Iligan Institute of Technology, Philippines"
        bachelor = FacultyEducation.objects.create(faculty=member, degree_level="bachelors",
            degree_name="Bachelor of Science in Electronics and Computer Technology (Major in Embedded Systems)",
            institution=institution, year_completed=2016)
        old_master = FacultyEducation.objects.create(faculty=member, degree_level="masters",
            degree_name="Master of Science in Computer Applications, Philippines", institution=institution, year_completed=2021)
        new_master = FacultyEducation.objects.create(faculty=member, degree_level="masters",
            degree_name="Master of Science in Computer Applications", institution="MSU - Iligan Institute of Technology", year_completed=2020)
        doctorate = FacultyEducation.objects.create(faculty=member, degree_level="doctorate",
            degree_name="PhD in Artificial Intelligence of Things", institution="National Taiwan University and Academia Sinica",
            notes="Ongoing study; degree not yet completed.")
        unknown = FacultyEducation.objects.create(faculty=member, degree_level="doctorate",
            degree_name=doctorate.degree_name, institution="National Taiwan University, Taiwan & Academia Sinica, Taiwan", is_published=True)
        old_expertise = FacultyExpertise.objects.create(faculty=member, title="asdf", expertise_type="expertise")
        interest = FacultyExpertise.objects.create(faculty=member, title="Existing research interest", expertise_type="research_interest")
        other = FacultyMember.objects.create(title="Other Faculty", slug="other")
        other_degree = FacultyEducation.objects.create(faculty=other, degree_level="masters",
            degree_name=new_master.degree_name, institution=new_master.institution, year_completed=2021)
        migration = import_module("apps.people.migrations.0016_alce_confirmed_education_and_expertise")
        with connection.schema_editor() as editor:
            migration.apply_confirmations(apps, editor)
            migration.apply_confirmations(apps, editor)
        for row, year in ((bachelor, 2017), (old_master, 2020), (new_master, 2020), (other_degree, 2021)):
            row.refresh_from_db()
            self.assertEqual(row.year_completed, year)
        self.assertEqual(member.education_records.count(), 5)
        doctorate.refresh_from_db()
        unknown.refresh_from_db()
        self.assertEqual(doctorate.notes, "Ongoing study; degree not yet completed.")
        self.assertEqual(unknown.notes, "")
        self.assertIsNone(doctorate.year_completed)
        self.assertTrue(unknown.is_published)
        old_expertise.refresh_from_db()
        interest.refresh_from_db()
        self.assertFalse(old_expertise.is_published)
        self.assertTrue(interest.is_published)
        self.assertEqual(list(member.expertise_records.filter(expertise_type="expertise", is_published=True)
            .values_list("title", flat=True)), list(migration.EXPERTISE))
        member.refresh_from_db()
        self.assertEqual(member.specialization_areas, "\n".join(migration.EXPERTISE))
        response = self.client.get("/api/people/faculty/apple-rose-alce/")
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("asdf", [row["title"] for row in response.json()["expertise_records"]])

    def test_organization_import_preserves_profile_and_does_not_create_accounts(self):
        from django.contrib.auth import get_user_model
        before_accounts = get_user_model().objects.count()
        chair = FacultyMember.objects.create(title="Paul Rodolf Castor", slug="existing-chair", email="paulrodolf.castor@g.msuiit.edu.ph", position="Assistant Professor III")
        FacultyPublication.objects.create(faculty=chair, title="Existing publication")
        migration = import_module("apps.people.migrations.0015_department_organization")
        with connection.schema_editor() as editor:
            migration.record_organization(apps, editor)
            migration.record_organization(apps, editor)
        chair.refresh_from_db()
        self.assertEqual(chair.slug, "existing-chair")
        self.assertEqual(chair.position, "Assistant Professor III")
        self.assertEqual(chair.publications.count(), 1)
        self.assertEqual(chair.department_role.role, "chairperson")
        self.assertEqual(FacultyMember.objects.count(), 4)
        self.assertEqual(DepartmentRole.objects.count(), 4)
        self.assertEqual(get_user_model().objects.count(), before_accounts)
        response = self.client.get("/api/people/organization/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([p["role"] for p in response.json()], ["chairperson", "admin_aide", "lab_technician", "lab_technician"])
        self.assertEqual(response.json()[1]["email"], "cendylou.odvina@g.msuiit.edu.ph")

    def test_organization_excludes_unpublished_and_inactive_records(self):
        for index in range(4):
            person = FacultyMember.objects.create(title=f"Person {index}", slug=f"person-{index}", is_published=index != 1, active_affiliation=index != 2)
            DepartmentRole.objects.create(person=person, role="lab_technician", is_published=index != 3)
        response = self.client.get("/api/people/organization/")
        self.assertEqual([p["slug"] for p in response.json()], ["person-0"])

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


from django.test import TestCase
from apps.people.models import FacultyContribution
from apps.research.models import ResearchProject, PublicationRecord, ConferenceRecord
from apps.extension.models import ExtensionProject
from django.core.exceptions import ValidationError

class SharedContributionTests(TestCase):
    def setUp(self):
        FacultyMember.objects.all().delete()
        ResearchProject.objects.all().delete()
        PublicationRecord.objects.all().delete()
        ConferenceRecord.objects.all().delete()
        ExtensionProject.objects.all().delete()
        self.person = FacultyMember.objects.create(title="Joel I. Miano", slug="joel-i-miano", is_published=True, faculty_status="resigned", active_affiliation=False)
        self.project = ResearchProject.objects.create(title="Shared research", slug="shared", reporting_year="2025", research_leader="Joel I. Miano", team_members="Other Person", funding="INTERNAL", is_published=True)

    def test_shared_source_edits_visibility_and_historical_credit(self):
        credit = FacultyContribution.objects.create(faculty=self.person, research=self.project, role="Research leader")
        url = "/api/people/faculty/joel-i-miano/"
        payload = self.client.get(url).json()["department_contributions"]
        self.assertEqual(payload[0]["role"], "Research leader")
        self.assertEqual(payload[0]["href"], "/research/projects#shared")
        self.project.title = "Corrected title"
        self.project.save()
        self.assertEqual(self.client.get(url).json()["department_contributions"][0]["title"], "Corrected title")
        credit.is_published = False
        credit.save()
        self.assertEqual(self.client.get(url).json()["department_contributions"], [])
        credit.is_published = True
        credit.save()
        self.project.is_published = False
        self.project.save()
        self.assertEqual(self.client.get(url).json()["department_contributions"], [])
        self.assertEqual(FacultyContribution.objects.count(), 1)

    def test_import_roles_identity_and_idempotency(self):
        member = FacultyMember.objects.create(title="Apple Rose B. Alce", slug="alce", is_published=True)
        ambiguous = FacultyMember.objects.create(title="Other Miano", slug="other-miano")
        self.project.team_members = "Apple Rose Alce\nOther unknown person"
        self.project.save()
        publication = PublicationRecord.objects.create(title="Paper", year=2025, authors="Joel I. Miano; Apple Rose B. Alce", kind="JOURNAL", source_url="https://example.org/paper", is_published=True)
        conference = ConferenceRecord.objects.create(title="Conference paper", year=2026, authors="Apple Rose Alce and Joel I. Miano", starts_on="2026-11-01", ends_on="2026-11-02", withdrawn=True, is_published=True)
        extension = ExtensionProject.objects.create(title="Extension", reporting_year=2024, extension_leader="Apple Rose Alce", faculty_members="Joel I. Miano", is_published=True)
        migration = import_module("apps.people.migrations.0011_department_contributions")
        from types import SimpleNamespace
        Editor = lambda: SimpleNamespace(connection=connection)
        migration.link_department_records(apps, Editor())
        migration.link_department_records(apps, Editor())
        self.assertEqual(FacultyContribution.objects.count(), 8)
        self.assertEqual(FacultyContribution.objects.filter(faculty=ambiguous).count(), 0)
        self.assertEqual(FacultyContribution.objects.get(faculty=member, research=self.project).role, "Research team member")
        self.assertEqual(FacultyContribution.objects.get(faculty=member, extension=extension).role, "Extension leader")
        credits = self.client.get("/api/people/faculty/joel-i-miano/").json()["department_contributions"]
        conference_credit = next(item for item in credits if item["kind"] == "conference")
        self.assertTrue(conference_credit["withdrawn"])
        self.assertEqual(conference_credit["role"], "Conference paper author (presenter not confirmed)")
        self.assertEqual(FacultyContribution.objects.get(faculty=self.person, publication=publication).role, "Author")

    def test_requires_exactly_one_shared_source(self):
        with self.assertRaises(ValidationError):
            FacultyContribution(faculty=self.person, role="Member").clean()


class AcademicPublicationTests(TestCase):
    def setUp(self):
        FacultyMember.objects.all().delete()
        self.member = FacultyMember.objects.create(title="Reviewed Faculty", slug="reviewed", is_published=True,
            highest_degree="Doctoral Degree", educational_background="Unconfirmed doctorate", last_updated_note="Internal editorial marker")

    def test_new_education_is_internal_and_admin_rejects_unverified_publication(self):
        record = FacultyEducation(faculty=self.member, degree_level="doctorate", degree_name="Unverified doctorate", year_completed=2025)
        self.assertFalse(record.is_published)
        record.is_published = True
        with self.assertRaises(ValidationError):
            record.full_clean()
        record.academic_status = "ongoing"
        record.verification_reference = "Confirmed enrollment fixture"
        with self.assertRaises(ValidationError):
            record.full_clean()
        record.year_completed = None
        record.full_clean()

    def test_public_api_filters_review_records_and_never_exposes_internal_evidence(self):
        FacultyEducation.objects.create(faculty=self.member, degree_level="doctorate", degree_name="Held doctorate", year_completed=2025, is_published=True)
        FacultyEducation.objects.create(faculty=self.member, degree_level="masters", degree_name="Approved master’s", academic_status="completed", verification_reference="Private approval fixture", notes="Private review note", is_published=True)
        response = self.client.get("/api/people/faculty/reviewed/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual([r["degree_name"] for r in data["education_records"]], ["Approved master’s"])
        self.assertEqual(data["highest_degree"], "Master’s Degree")
        self.assertEqual(data["educational_background"], "")
        self.assertNotIn("last_updated_note", data)
        for term in ("Held doctorate", "Unconfirmed doctorate", "Private review note", "Private approval fixture", "Internal editorial marker"):
            self.assertNotIn(term, response.content.decode())
        directory = self.client.get("/api/people/faculty/").json()
        self.assertEqual(directory[0]["highest_degree"], "Master’s Degree")

    def test_structured_expertise_is_shared_and_hidden_entries_do_not_reappear(self):
        from .models import FacultyExpertise
        self.member.specialization_areas = "Obsolete free text"
        self.member.save()
        record = FacultyExpertise.objects.create(faculty=self.member, title="Reviewed specialization")
        for url in ("/api/people/faculty/", "/api/people/faculty/reviewed/"):
            data = self.client.get(url).json()
            if isinstance(data, list): data = data[0]
            self.assertEqual(data["specialization_areas"], "Reviewed specialization")
        record.is_published = False
        record.save()
        self.assertEqual(self.client.get("/api/people/faculty/reviewed/").json()["specialization_areas"], "")

    def test_correction_retains_confirmed_duplicates_internally_and_preserves_editor_content(self):
        self.member.title = "Apple Rose B. Alce"
        self.member.email = "applerose.alce@g.msuiit.edu.ph"
        self.member.profile_summary = "An approved authored biography."
        self.member.save()
        canonical = FacultyEducation.objects.create(faculty=self.member, degree_level="masters", degree_name="Master of Science in Computer Applications", institution="MSU - Iligan Institute of Technology", year_completed=2020, is_published=True)
        duplicate = FacultyEducation.objects.create(faculty=self.member, degree_level="masters", degree_name="Master of Science in Computer Applications, Philippines", institution="Mindanao State University - Iligan Institute of Technology, Philippines", year_completed=2020, is_published=True)
        ongoing = FacultyEducation.objects.create(faculty=self.member, degree_level="doctorate", degree_name="PhD in Artificial Intelligence of Things", institution="National Taiwan University and Academia Sinica", notes="Ongoing", is_published=True)
        old_doctorate = FacultyEducation.objects.create(faculty=self.member, degree_level="doctorate", degree_name=ongoing.degree_name, institution="National Taiwan University, Taiwan & Academia Sinica, Taiwan", is_published=True)
        unrelated = FacultyEducation.objects.create(faculty=self.member, degree_level="masters", degree_name="Separately reviewed award", academic_status="completed", verification_reference="Existing review", is_published=False)
        migration = import_module("apps.people.migrations.0019_public_academic_content_corrections")
        from types import SimpleNamespace
        for _ in range(2): migration.correct_public_records(apps, SimpleNamespace(connection=connection))
        canonical.refresh_from_db(); duplicate.refresh_from_db(); ongoing.refresh_from_db(); old_doctorate.refresh_from_db(); unrelated.refresh_from_db(); self.member.refresh_from_db()
        self.assertTrue(canonical.is_published)
        self.assertTrue(ongoing.is_published)
        self.assertFalse(duplicate.is_published)
        self.assertFalse(old_doctorate.is_published)
        self.assertFalse(unrelated.is_published)
        self.assertEqual(self.member.education_records.count(), 5)
        self.assertIn(str(canonical.pk), duplicate.verification_reference)
        self.assertEqual(self.member.profile_summary, "An approved authored biography.")
        self.assertEqual(len(self.client.get("/api/people/faculty/reviewed/").json()["education_records"]), 2)
