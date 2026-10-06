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
        self.assertEqual(self.client.post("/api/academics/sojt-guide/bsca/", {}).status_code, 405)

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
