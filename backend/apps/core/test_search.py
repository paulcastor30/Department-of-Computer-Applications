from django.test import TestCase
from apps.people.models import FacultyMember, FacultyExpertise
from apps.research.models import PublicationRecord, ResearchProject
from apps.academics.models import Program, ProgramDocument, RegistrarForm
from apps.communications.models import NewsPost


class PublicSearchTests(TestCase):
    def results(self, query):
        response = self.client.get("/api/core/search/", {"q": query})
        self.assertEqual(response.status_code, 200)
        return response.json()["results"]

    def test_returns_published_records_and_excludes_internal_notes(self):
        member = FacultyMember.objects.create(title="Needle42 Faculty", slug="needle42-faculty", is_published=True, position="Lecturer")
        paper = PublicationRecord.objects.create(title="Needle42 publication", year=2026, source_note="privateneedle42", is_published=True)
        project = ResearchProject.objects.create(title="Needle42 research", reporting_year="2026", source_note="privateneedle42", is_published=True)
        NewsPost.objects.create(title="Needle42 announcement", category="NEWS", body="Public report", is_published=True)
        NewsPost.objects.create(title="Needle42 draft", category="NEWS", body="Private draft")
        results = self.results("needle42")
        self.assertEqual({row["kind"] for row in results}, {"Faculty & staff", "Publications", "Research projects", "Announcements"})
        self.assertIn(f"/faculty/{member.slug}", [row["href"] for row in results])
        self.assertIn(f"/research/publications#{paper.slug}", [row["href"] for row in results])
        self.assertEqual(self.results("privateneedle42"), [])
        self.assertNotIn("source_note", str(results))
        project.is_published = False; project.save()
        self.assertNotIn("Research projects", {row["kind"] for row in self.results("needle42")})

    def test_expertise_search_requires_record_and_person_publication_and_approval(self):
        member = FacultyMember.objects.create(title="Public specialist", is_published=True)
        expertise = FacultyExpertise.objects.create(faculty=member, title="Needle42 embedded robotics", is_published=True)
        self.assertEqual(self.results("needle42 robotics"), [])
        expertise.approval_reference = "Recorded approval"; expertise.save()
        self.assertEqual(self.results("needle42 robotics")[0]["href"], f"/faculty/{member.slug}")
        self.assertEqual(self.results("needle42 missingword"), [])
        member.is_published = False; member.save()
        self.assertEqual(self.results("needle42 robotics"), [])

    def test_public_forms_link_to_actual_records_and_respect_parent_publication(self):
        program = Program.objects.create(title="Test BSCA", code="TESTSEARCH", is_published=True)
        document = ProgramDocument.objects.create(program=program, title="Needle42 proposal form", form_group="PROPOSAL", url="https://example.edu/form.pdf")
        RegistrarForm.objects.create(form_id="needle42", title="Needle42 registrar request", url="https://example.edu/registrar.docx")
        links = [row["href"] for row in self.results("needle42")]
        self.assertIn(f"/programs/{program.slug}#program-document-{document.pk}", links)
        self.assertIn("/resources#registrar-form-needle42", links)
        program.is_published = False; program.save()
        self.assertEqual({row["kind"] for row in self.results("needle42")}, {"Registrar forms"})
        RegistrarForm.objects.filter(form_id="needle42").update(is_public=False)
        self.assertEqual(self.results("needle42"), [])

    def test_short_and_oversized_queries_and_read_only_endpoint(self):
        self.assertEqual(self.results(""), [])
        self.assertEqual(self.results("a"), [])
        self.assertEqual(self.client.get("/api/core/search/", {"q": "a" * 161}).status_code, 400)
        self.assertEqual(self.client.post("/api/core/search/", {}).status_code, 405)

    def test_legacy_expertise_matches_only_when_the_directory_displays_it(self):
        member = FacultyMember.objects.create(title="Legacy specialist", specialization_areas="Needle42 legacy expertise", is_published=True)
        self.assertEqual(self.results("needle42 legacy")[0]["href"], f"/faculty/{member.slug}")
        FacultyExpertise.objects.create(faculty=member, title="Withheld structured expertise", is_published=False)
        self.assertEqual(self.results("needle42 legacy"), [])

    def test_full_name_words_rank_a_person_ahead_of_mentions_in_other_records(self):
        FacultyMember.objects.create(title="Jane A. Needle42", is_published=True)
        for number in range(8):
            NewsPost.objects.create(title=f"Alphabetical announcement {number}", category="NEWS", body="Jane Needle42 contributed", is_published=True)
        self.assertEqual(self.results("Jane Needle42")[0]["title"], "Jane A. Needle42")

    def test_long_record_titles_are_preserved_in_full(self):
        title = "Needle42 " + "academic research " * 20
        PublicationRecord.objects.create(title=title.strip(), year=2026, is_published=True)
        self.assertEqual(self.results("needle42")[0]["title"], title.strip())
