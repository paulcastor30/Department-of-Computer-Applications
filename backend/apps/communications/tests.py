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

    def test_news_order_uses_publication_chronology_not_activity_or_edit_date(self):
        from django.utils import timezone
        from datetime import timedelta
        NewsPost.objects.all().delete()
        now = timezone.now()
        older = NewsPost.objects.create(title="Older publication", slug="older", category="EVENT", body="Activity tomorrow", published_at=now-timedelta(days=2), is_published=True)
        NewsPost.objects.create(title="Recent publication", slug="recent", category="NEWS", body="Activity last year", published_at=now-timedelta(days=1), is_published=True)
        older.summary = "Edited after the recent publication"
        older.save()
        response = self.client.get("/api/communications/news/")
        self.assertEqual([post["slug"] for post in response.json()], ["recent", "older"])
