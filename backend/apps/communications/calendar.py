from zoneinfo import ZoneInfo
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.research.models import ConferenceRecord
from .models import NewsPost


def calendar_entries():
    entries = []
    for post in NewsPost.objects.filter(is_published=True).exclude(starts_on__isnull=True, deadline_on__isnull=True):
        common = {"title": post.title, "href": f"/news/{post.slug}", "summary": post.summary, "location": post.location, "status": post.get_event_status_display() if post.event_status else ""}
        if post.starts_on:
            entries.append({**common, "id": f"news-{post.pk}-event", "kind": "events", "label": "Department activity", "starts_on": post.starts_on, "ends_on": post.ends_on or post.starts_on, "starts_at": post.starts_at.isoformat() if post.starts_at else ""})
        if post.deadline_on:
            entries.append({**common, "id": f"news-{post.pk}-deadline", "kind": "deadlines", "label": "Deadline", "starts_on": post.deadline_on, "ends_on": post.deadline_on, "starts_at": ""})
    # These dates belong to published research conference records, not department-hosted events.
    for record in ConferenceRecord.objects.filter(is_published=True, withdrawn=False):
        entries.append({"id": f"conference-{record.pk}", "kind": "conferences", "label": "Research conference dates", "title": record.title, "summary": record.conference, "href": f"/research/conferences#{record.slug}", "location": record.location, "status": "", "starts_on": record.starts_on, "ends_on": record.ends_on, "starts_at": ""})
    return entries


class EventsView(APIView):
    def get(self, request):
        today = timezone.localdate(timezone=ZoneInfo("Asia/Manila"))
        view = request.query_params.get("view", "upcoming")
        kind = request.query_params.get("kind", "all")
        if view not in ("upcoming", "past") or kind not in ("all", "events", "deadlines", "conferences"):
            return Response({"detail": "Choose a supported date view and category."}, status=400)
        entries = [entry for entry in calendar_entries() if (kind == "all" or entry["kind"] == kind) and ((entry["ends_on"] >= today) if view == "upcoming" else (entry["ends_on"] < today))]
        entries.sort(key=lambda item: (item["starts_on"], item["id"]), reverse=view == "past")
        return Response({"today": today, "timezone": "Asia/Manila", "results": entries})
