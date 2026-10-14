"""Read-only search over public department records; never administrative/private data."""
from django.db.models import Q
from django.utils.html import strip_tags
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.academics.models import Program, ProgramDocument, RegistrarForm, LearningResource
from apps.people.views import published_faculty_queryset
from apps.people.serializers import FacultyDirectorySerializer
from apps.research.models import PublicationRecord, ResearchProject, ConferenceRecord
from apps.extension.models import ExtensionProject
from apps.communications.models import NewsPost
from .models import ProjectPrototype


def matching(queryset, fields, words):
    for word in words:
        predicate = Q()
        for field in fields:
            predicate |= Q(**{field + "__icontains": word})
        queryset = queryset.filter(predicate)
    return queryset.distinct()[:12]


def public_text(value, limit=240):
    value = " ".join(strip_tags(str(value or "")).split())
    return "" if "to be provided by the department" in value.lower() or "to be validated by the department" in value.lower() else value[:limit] if limit is not None else value


class PublicSearchView(APIView):
    def get(self, request):
        query = " ".join(request.query_params.get("q", "").split())
        if len(query) > 160:
            return Response({"detail": "Use a search of 160 characters or fewer."}, status=400)
        if len(query) < 2:
            return Response({"query": query, "results": []})
        words = query.split()
        results = []
        def add(kind, title, href, summary=""):
            results.append({"kind": kind, "title": public_text(title, limit=None), "href": href, "summary": public_text(summary)})
        people_found = 0
        directory = FacultyDirectorySerializer()
        for person in published_faculty_queryset():
            # Use the same public specialization boundary as the faculty directory.
            specialization = directory.get_specialization_areas(person)
            public_fields = " ".join([person.title, person.position, person.email, person.home_unit, specialization, person.research_interests, person.teaching_areas, person.supporting_programs]).casefold()
            if all(word.casefold() in public_fields for word in words):
                add("Faculty & staff", person.title, f"/faculty/{person.slug}", person.position or person.home_unit or specialization)
                people_found += 1
                if people_found == 12:
                    break
        # Expertise search follows the same public approval boundary as the directory.
        from apps.people.models import FacultyExpertise
        expertise = FacultyExpertise.objects.filter(is_published=True, faculty__is_published=True).exclude(approval_reference__regex=r"^\s*$").select_related("faculty")
        for row in matching(expertise, ["title", "description"], words):
            add("Faculty & staff", row.faculty.title, f"/faculty/{row.faculty.slug}", row.title)
        specs = [
            (Program.objects.filter(is_published=True), ["title", "code", "formal_description"], "Programs", lambda o: "/programs/" + (o.code.lower() if o.code in ("BSCA", "MSCA") else o.slug), lambda o: o.formal_description),
            (PublicationRecord.objects.filter(is_published=True), ["title", "authors", "venue", "doi"], "Publications", lambda o: "/research/publications#" + o.slug, lambda o: o.authors),
            (ResearchProject.objects.filter(is_published=True), ["title", "plain_language_summary", "research_leader", "team_members"], "Research projects", lambda o: "/research/projects#" + o.slug, lambda o: o.plain_language_summary),
            (ConferenceRecord.objects.filter(is_published=True), ["title", "authors", "conference"], "Conference records", lambda o: "/research/conferences#" + o.slug, lambda o: o.conference),
            (ProjectPrototype.objects.filter(is_published=True), ["title", "summary", "creator_credits"], "Student projects", lambda o: "/projects#" + o.slug, lambda o: o.summary),
            (ExtensionProject.objects.filter(is_published=True), ["title", "plain_language_summary", "extension_leader"], "Community work", lambda o: "/extension#" + o.slug, lambda o: o.plain_language_summary),
            (NewsPost.objects.filter(is_published=True), ["title", "summary", "body"], "Announcements", lambda o: "/news/" + o.slug, lambda o: o.summary),
            (LearningResource.objects.filter(is_published=True), ["title", "description", "provider"], "Learning resources", lambda o: f"/resources?learning={o.slug}#resource-catalogue", lambda o: o.provider),
        ]
        for queryset, fields, kind, href, summary in specs:
            for item in matching(queryset, fields, words):
                add(kind, item.title, href(item), summary(item))
        documents = ProgramDocument.objects.filter(is_public=True, program__is_published=True).select_related("program")
        for item in matching(documents, ["title", "program__code", "form_group"], words):
            if item.file or item.url:
                section = f"program-document-{item.pk}"
                code = item.program.code.lower() if item.program.code in ("BSCA", "MSCA") else item.program.slug
                add("Forms & documents", item.title, f"/programs/{code}#{section}", item.program.code)
        for item in matching(RegistrarForm.objects.filter(is_public=True), ["form_id", "title"], words):
            if item.file or item.url:
                add("Registrar forms", f"RGTR-{item.form_id}: {item.title}", f"/resources#registrar-form-{item.form_id}")
        # Distinct records can share a collection destination; only identical titles/URLs collapse.
        unique = {(item["kind"], item["title"], item["href"]): item for item in results if item["title"]}
        def relevance(item):
            title = item["title"].casefold()
            title_matches = sum(word.casefold() in title for word in words)
            return (0 if title_matches == len(words) else 1 if title_matches else 2, item["kind"], title)
        ordered = sorted(unique.values(), key=relevance)
        return Response({"query": query, "results": ordered[:60], "has_more": len(ordered) > 60})
