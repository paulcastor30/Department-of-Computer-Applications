from copy import deepcopy
from datetime import date
from importlib import import_module
from django.apps import apps
from django.core.exceptions import ValidationError
from django.test import TestCase
from .models import SOJTGuide
from .sojt_schema import validate_guide


class SOJTGuideTests(TestCase):
    def setUp(self):
        self.guide = SOJTGuide.objects.get(slug="bsca")
        # Each publication-boundary test starts with an ordinary unapproved draft.
        self.guide.is_published = False
        self.guide.reviewed_on = None
        self.guide.approval_reference = ""
        self.guide.approved_content_hash = ""
        self.guide.save()

    def test_seed_is_unpublished_and_public_api_hides_draft(self):
        self.assertFalse(self.guide.is_published)
        self.assertEqual(self.client.get("/api/academics/sojt-guide/bsca/").status_code, 404)

    def test_publishing_requires_review_and_verified_sources(self):
        self.guide.is_published = True
        with self.assertRaises(ValidationError):
            self.guide.save()
        self.guide.reviewed_on = date(2026, 10, 6)
        self.guide.approval_reference = "Internal approval fixture"
        with self.assertRaises(ValidationError):
            self.guide.save()

    def test_public_response_excludes_internal_notes_and_is_read_only(self):
        self.guide.reviewed_on = date(2026, 10, 6)
        self.guide.approval_reference = "Internal approval fixture"
        self.guide.internal_notes = "Private editorial note"
        for source in self.guide.content["sources"]:
            source["status"] = "verified"
        self.guide.is_published = True
        self.guide.save()
        response = self.client.get("/api/academics/sojt-guide/bsca/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.json()), {"slug", "content", "reviewed_on", "updated_at"})
        self.assertNotIn("Private editorial note", response.content.decode())
        self.assertNotIn("Internal approval fixture", response.content.decode())
        self.assertEqual(response.json()["content"]["coordinator"], "Excel Van Jondonero")
        self.assertNotIn("confirmations", response.json()["content"])
        self.assertNotIn("risks", response.json()["content"])
        for source in response.json()["content"]["sources"]:
            self.assertNotIn("status", source)
            self.assertNotIn("note", source)
        self.assertEqual(self.client.post("/api/academics/sojt-guide/bsca/", {}).status_code, 405)

    def test_bulk_publication_cannot_bypass_source_approval(self):
        SOJTGuide.objects.filter(pk=self.guide.pk).update(is_published=True, reviewed_on=date(2026, 10, 6), approval_reference="Bulk update fixture")
        self.assertEqual(self.client.get("/api/academics/sojt-guide/bsca/").status_code, 404)

    def test_schema_rejects_private_fields_missing_stages_and_unsafe_links(self):
        for mutation in [
            lambda c: c.update(student_records=[]),
            lambda c: c["steps"].reverse(),
            lambda c: c["steps"][4].pop("gate"),
            lambda c: c["sources"][0].update(url="javascript:alert(1)"),
            lambda c: c["checklist"][0].update(sources=["invented"]),
            lambda c: c["steps"][0].update(complaints=[]),
        ]:
            content = deepcopy(self.guide.content)
            mutation(content)
            with self.assertRaises(ValidationError):
                validate_guide(content)

    def test_seed_does_not_overwrite_editor_content_or_publication(self):
        self.guide.content["intro"] = "Editor revised introduction"
        self.guide.save()
        migration = import_module("apps.academics.migrations.0023_sojt_guide_reference")
        migration.seed_reference(apps, None)
        self.guide.refresh_from_db()
        self.assertEqual(self.guide.content["intro"], "Editor revised introduction")

    def test_user_authorized_exact_guide_is_published_without_rewriting_sources(self):
        from types import SimpleNamespace
        from django.db import connection
        before = deepcopy(self.guide.content)
        migration = import_module("apps.academics.migrations.0038_authorized_existing_sojt_guide")
        migration.publish_authorized_guide(apps, SimpleNamespace(connection=connection))
        self.guide.refresh_from_db()
        self.assertTrue(self.guide.is_published)
        self.assertEqual(self.guide.content, before)
        self.assertEqual(self.client.get("/api/academics/sojt-guide/bsca/").status_code, 200)
        self.assertNotIn("approved_content_hash", self.client.get("/api/academics/sojt-guide/bsca/").json())
        self.guide.content["intro"] = "Changed guide wording outside the authorization"
        with self.assertRaises(ValidationError): self.guide.save()
        SOJTGuide.objects.filter(pk=self.guide.pk).update(content=self.guide.content)
        self.assertEqual(self.client.get("/api/academics/sojt-guide/bsca/").status_code, 404)

    def test_publication_migration_preserves_edited_draft(self):
        from types import SimpleNamespace
        from django.db import connection
        self.guide.content["intro"] = "Editor maintained wording"
        self.guide.save()
        migration = import_module("apps.academics.migrations.0038_authorized_existing_sojt_guide")
        migration.publish_authorized_guide(apps, SimpleNamespace(connection=connection))
        self.guide.refresh_from_db()
        self.assertFalse(self.guide.is_published)
        self.assertEqual(self.guide.content["intro"], "Editor maintained wording")

    def test_explicit_admin_approval_records_actor_and_exact_text_without_relabelling_sources(self):
        from django.contrib import admin
        from django.contrib.auth import get_user_model
        from django.test import RequestFactory
        from .admin import SOJTGuideAdmin, approve_guide_wording
        self.guide.content["intro"] = "Reviewed revised wording"
        self.guide.save()
        before = deepcopy(self.guide.content)
        request = RequestFactory().post("/admin/academics/sojtguide/")
        request.user = get_user_model().objects.create_superuser(username="guide-reviewer", email="reviewer@example.invalid", password="test-password")
        approve_guide_wording(SOJTGuideAdmin(SOJTGuide, admin.site), request, SOJTGuide.objects.filter(pk=self.guide.pk))
        self.guide.refresh_from_db()
        self.assertTrue(self.guide.is_published)
        self.assertEqual(self.guide.content, before)
        self.assertIn("guide-reviewer", self.guide.approval_reference)
        self.assertEqual(self.client.get("/api/academics/sojt-guide/bsca/").status_code, 200)
