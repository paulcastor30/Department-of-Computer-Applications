from datetime import date, datetime
from unittest.mock import patch
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from apps.research.models import ConferenceRecord
from .models import NewsPost


class CalendarTests(TestCase):
    def setUp(self):
        NewsPost.objects.all().update(is_published=False)
        ConferenceRecord.objects.all().update(is_published=False)
        self.clock = patch("apps.communications.calendar.timezone.localdate", return_value=date(2026, 10, 15))
        self.clock.start(); self.addCleanup(self.clock.stop)

    def news(self, title, **fields):
        return NewsPost.objects.create(title=title, category="EVENT", body="Activity information", is_published=True, **fields)

    def entries(self, **params):
        response = self.client.get("/api/communications/events/", params)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["timezone"], "Asia/Manila")
        self.assertEqual(response.json()["today"], "2026-10-15")
        return response.json()["results"]

    def test_uses_actual_dates_never_publication_dates_and_keeps_ongoing_activities(self):
        self.news("Undated announcement", published_at=timezone.make_aware(datetime(2026, 12, 1)))
        self.news("Ongoing activity", starts_on=date(2026, 10, 13), ends_on=date(2026, 10, 16))
        self.news("Today deadline", deadline_on=date(2026, 10, 15))
        self.news("Past activity", starts_on=date(2026, 10, 14))
        self.news("Future activity", starts_on=date(2026, 10, 20), starts_at="09:00")
        self.assertEqual([row["title"] for row in self.entries()], ["Ongoing activity", "Today deadline", "Future activity"])
        self.assertEqual([row["title"] for row in self.entries(view="past")], ["Past activity"])
        self.assertEqual([row["title"] for row in self.entries(kind="deadlines")], ["Today deadline"])

    def test_excludes_drafts_and_withdrawn_research_but_displays_cancellation(self):
        NewsPost.objects.create(title="Hidden", category="EVENT", body="Draft", starts_on=date(2026, 10, 20))
        self.news("Cancelled event", starts_on=date(2026, 10, 20), event_status="CANCELLED")
        for title, withdrawn in (("Public research paper", False), ("Withdrawn research paper", True)):
            ConferenceRecord.objects.create(title=title, year=2026, starts_on=date(2026, 11, 1), ends_on=date(2026, 11, 3), conference="Research conference", is_published=True, withdrawn=withdrawn)
        entries = self.entries()
        self.assertEqual({row["title"] for row in entries}, {"Cancelled event", "Public research paper"})
        self.assertEqual(entries[0]["status"], "Cancelled")
        conference = self.entries(kind="conferences")[0]
        self.assertEqual(conference["label"], "Research conference dates")
        self.assertTrue(conference["href"].startswith("/research/conferences#"))

    def test_admin_validates_date_order_and_time_precision(self):
        for values in ({"ends_on": date(2026, 10, 20)}, {"starts_on": date(2026, 10, 20), "ends_on": date(2026, 10, 19)}, {"starts_at": "09:00"}):
            with self.assertRaises(ValidationError): NewsPost(title="Date fixture", category="EVENT", body="", **values).clean()
        NewsPost(title="Deadline only", deadline_on=date(2026, 10, 20)).clean()

    def test_unknown_filters_and_writes_are_rejected(self):
        self.assertEqual(self.client.get("/api/communications/events/", {"view": "unknown"}).status_code, 400)
        self.assertEqual(self.client.get("/api/communications/events/", {"kind": "unknown"}).status_code, 400)
        self.assertEqual(self.client.post("/api/communications/events/", {}).status_code, 405)

    def test_calendar_day_uses_philippine_midnight(self):
        from datetime import timezone as datetime_timezone
        self.clock.stop()
        with patch("django.utils.timezone.now", return_value=datetime(2026, 10, 14, 16, 30, tzinfo=datetime_timezone.utc)):
            response = self.client.get("/api/communications/events/")
        self.assertEqual(response.json()["today"], "2026-10-15")
