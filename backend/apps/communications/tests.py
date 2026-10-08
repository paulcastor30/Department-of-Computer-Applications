from importlib import import_module
from django.apps import apps
from django.test import TestCase
from .models import NewsPost

class VerifiedReportsTests(TestCase):
    def test_seed_preserves_editor_changes_and_official_report_dates(self):
        seed = import_module("apps.communications.migrations.0002_verified_department_reports").seed_reports
        seed(apps, None)
        post = NewsPost.objects.get(slug="vermisense-rcite-2026")
        post.summary = "Editor-reviewed summary"
        post.save()
        seed(apps, None)
        post.refresh_from_db()
        self.assertEqual(post.summary, "Editor-reviewed summary")
        self.assertEqual(post.published_at.date().isoformat(), "2026-09-28")
        self.assertEqual(NewsPost.objects.filter(slug=post.slug).count(), 1)

    def test_public_reports_include_sources_and_exclude_drafts(self):
        NewsPost.objects.create(title="Unpublished draft", slug="private-draft", category="NEWS", body="Private", is_published=False)
        response = self.client.get("/api/communications/news/")
        self.assertEqual(response.status_code, 200)
        posts = response.json()
        self.assertNotIn("private-draft", [post["slug"] for post in posts])
        example = next(post for post in posts if post["slug"] == "my-comapps-workshop-2024")
        self.assertEqual(example["source_url"], "https://msuiit.edu.ph/news/news-detail.php?id=1862")
