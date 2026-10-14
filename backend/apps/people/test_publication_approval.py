from django.core.exceptions import ValidationError
from django.forms import modelform_factory
from django.test import TestCase
from .models import FacultyMember, FacultyPublication, FacultyExpertise, FacultyContribution
from .serializers import FacultyPublicationSerializer


class FacultyPublicationApprovalTests(TestCase):
    def setUp(self):
        self.faculty = FacultyMember.objects.create(title="Approval test faculty")

    def test_new_records_start_as_drafts(self):
        for model in (FacultyPublication, FacultyExpertise, FacultyContribution):
            self.assertFalse(model().is_published)

    def test_admin_form_rejects_publication_without_approval(self):
        form_class = modelform_factory(FacultyPublication, fields=("faculty", "title", "is_published", "approval_reference"))
        form = form_class(data={"faculty": self.faculty.pk, "title": "Test publication", "is_published": True})
        self.assertFalse(form.is_valid())
        self.assertIn("is_published", form.errors)
        approved = form_class(data={"faculty": self.faculty.pk, "title": "Test publication", "is_published": True, "approval_reference": "Approving authority and source, 2026-10-14"})
        self.assertTrue(approved.is_valid(), approved.errors)

    def test_public_serializer_omits_approval_reference(self):
        record = FacultyPublication.objects.create(faculty=self.faculty, title="Test publication", approval_reference="Internal approval")
        self.assertNotIn("approval_reference", FacultyPublicationSerializer(record).data)

    def test_preservation_migration_does_not_publish_drafts(self):
        from importlib import import_module
        from django.apps import apps
        from django.db import connection
        published = FacultyPublication.objects.create(faculty=self.faculty, title="Existing", is_published=True)
        draft = FacultyPublication.objects.create(faculty=self.faculty, title="Draft")
        migration = import_module("apps.people.migrations.0021_faculty_record_publication_approval")
        from types import SimpleNamespace
        migration.retain_existing_publication(apps, SimpleNamespace(connection=connection))
        published.refresh_from_db(); draft.refresh_from_db()
        self.assertTrue(published.is_published)
        self.assertTrue(published.approval_reference)
        self.assertFalse(draft.is_published)
        self.assertEqual(draft.approval_reference, "")

    def test_api_withholds_published_records_without_approval_even_if_inserted_directly(self):
        self.faculty.is_published = True
        self.faculty.save()
        FacultyPublication.objects.create(faculty=self.faculty, title="Not approved", is_published=True)
        FacultyPublication.objects.create(faculty=self.faculty, title="Approved", is_published=True, approval_reference="Recorded approval")
        response = self.client.get(f"/api/people/faculty/{self.faculty.slug}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["title"] for row in response.json()["publications"]], ["Approved"])
        self.assertEqual(response.json()["publications_count"], 1)

    def test_directory_search_does_not_match_unapproved_expertise(self):
        self.faculty.is_published = True
        self.faculty.save()
        FacultyExpertise.objects.create(faculty=self.faculty, title="Unapproved specialization", is_published=True)
        response = self.client.get("/api/people/faculty/", {"expertise": "Unapproved specialization"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])
