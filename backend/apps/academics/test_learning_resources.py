from django.test import TestCase
from django.urls import reverse
from .models import LearningResource


class LearningResourceAccessTests(TestCase):
    def test_public_reuse_downloads_resolve_without_the_spa_fallback(self):
        import json
        response = self.client.get("/learning-resources/collection.json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")
        snapshot = json.loads(b"".join(response.streaming_content))
        self.assertEqual(len(snapshot["resources"]), 788)
        self.assertEqual(snapshot["license"], "CC BY-SA 4.0")
        response = self.client.get("/learning-resources/LICENSE.txt")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Attribution-ShareAlike", b"".join(response.streaming_content))
        self.assertEqual(self.client.get("/learning-resources/db.sqlite3").status_code, 404)

    def test_public_list_excludes_drafts_and_is_read_only(self):
        LearningResource.objects.create(title="Unpublished resource", slug="private-draft",
            topic="IOT", provider="Example", description="Draft", url="https://example.org",
            level="BEGINNER", access_note="Draft")
        response = self.client.get(reverse("learning-resources"))
        self.assertEqual(response.status_code, 200)
        slugs = [resource["slug"] for resource in response.json()]
        self.assertNotIn("private-draft", slugs)
        self.assertIn("mqtt-essentials", slugs)
        self.assertIn("arduino-getting-started", slugs)
        self.assertEqual(self.client.post(reverse("learning-resources"), {}).status_code, 405)

    def test_full_collection_keeps_provenance_and_balanced_browse_topics(self):
        response = self.client.get(reverse("learning-resources"))
        imported = [resource for resource in response.json() if resource["source_collection"] == "ROADMAP"]
        self.assertEqual(len(imported), 788)
        self.assertTrue(all(resource["source_section"] and "0738fcbd" in resource["source_url"] for resource in imported))
        self.assertEqual({resource["topic"] for resource in imported}, {"FOUNDATIONS", "PROGRAMMING", "EMBEDDED", "IOT", "DATA", "SOFTWARE", "EXPLORE", "ADVANCED"})
        self.assertTrue(any("MQTT" in resource["title"] and resource["topic"] == "IOT" for resource in imported))

    def test_reimport_preserves_staff_edits_and_publication_choices(self):
        from importlib import import_module
        from django.apps import apps
        from django.db import connection
        from types import SimpleNamespace
        resource = LearningResource.objects.filter(source_collection="ROADMAP").first()
        resource.title = "Staff-edited title"
        resource.is_published = False
        resource.save()
        migration = import_module("apps.academics.migrations.0035_full_learning_collection")
        migration.add_collection(apps, SimpleNamespace(connection=connection))
        resource.refresh_from_db()
        self.assertEqual(resource.title, "Staff-edited title")
        self.assertFalse(resource.is_published)
