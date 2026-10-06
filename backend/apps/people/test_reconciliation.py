from io import StringIO
import json
from importlib import import_module
from types import SimpleNamespace
from django.apps import apps
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.db import connection, IntegrityError, transaction
from django.test import TestCase
from apps.people.models import (FacultyMember, FacultyContribution, FacultyPublication,
    FacultyConference, FacultyResearchProject, FacultyExtensionProject)
from apps.research.models import PublicationRecord, ResearchProject, ConferenceRecord
from apps.extension.models import ExtensionProject
from apps.people.reconciliation_v1 import reconcile


class ReconciliationTests(TestCase):
    def setUp(self):
        self.faculty = FacultyMember.objects.create(title="Review Person", slug="review-person", is_published=True)
        self.paper = PublicationRecord.objects.create(title="Exact paper", slug="exact-paper", year=2025,
            authors="Review Person", venue="Journal", doi="10.1234/exact", kind="JOURNAL",
            source_url="https://example.org/paper", is_published=True, source_note="PRIVATE PROVENANCE")

    def old_paper(self, **kwargs):
        fields = dict(faculty=self.faculty, title=self.paper.title, year=2025, doi="https://doi.org/10.1234/EXACT")
        fields.update(kwargs)
        return FacultyPublication.objects.create(**fields)

    def profile(self):
        response = self.client.get("/api/people/faculty/review-person/")
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_migration_is_idempotent_retains_history_and_propagates_corrected_title(self):
        old = self.old_paper()
        unmatched = self.old_paper(title="Personal historical paper", doi="", year=None)
        migration = import_module("apps.people.migrations.0013_reconcile_historical_activities")
        editor = SimpleNamespace(connection=connection)
        migration.link_historical_records(apps, editor)
        migration.link_historical_records(apps, editor)
        old.refresh_from_db()
        credit = old.reconciled_contribution
        self.assertEqual(credit.role, "")  # No inferred author/presenter role.
        self.assertEqual(FacultyContribution.objects.filter(faculty=self.faculty).count(), 1)
        self.assertTrue(FacultyPublication.objects.filter(pk=unmatched.pk).exists())
        self.assertEqual(self.profile()["publications"][0]["title"], "Personal historical paper")
        self.paper.title = "Department corrected title"
        self.paper.save()
        data = self.profile()
        self.assertEqual(data["department_contributions"][0]["title"], "Department corrected title")
        self.assertEqual(len(data["publications"]), 1)
        self.assertNotIn("PRIVATE PROVENANCE", json.dumps(data))
        self.assertNotIn("reconciled_contribution", data["publications"][0])
        self.assertEqual(old.title, "Exact paper")
        for obj in (self.paper, credit):
            obj.is_published = False
            obj.save()
            self.assertEqual(self.profile()["department_contributions"], [])
            self.assertEqual(len(self.profile()["publications"]), 1)
            obj.is_published = True
            obj.save()
        self.assertEqual(self.profile()["publications_count"], 2)

    def test_weak_conflicting_ambiguous_and_unmatched_records_are_preserved(self):
        weak = self.old_paper(doi="", year=None)
        conflict = self.old_paper(year=2024)
        PublicationRecord.objects.create(title=self.paper.title, slug="ambiguous-paper", year=2025, authors="Review Person", venue="Journal", is_published=True)
        ambiguous = self.old_paper(doi="", year=2025)
        surname = self.old_paper(title="Person", doi="", year=2025)
        report = {r["legacy_id"]: r for r in reconcile(apps, apply=True) if r["faculty_id"] == self.faculty.pk}
        self.assertEqual(report[weak.pk]["status"], "unresolved")
        self.assertEqual(report[conflict.pk]["status"], "conflicting")
        self.assertEqual(report[ambiguous.pk]["status"], "unresolved")
        self.assertEqual(report[surname.pk]["status"], "unresolved")
        self.assertEqual(self.faculty.publications.count(), 4)
        self.assertEqual(self.faculty.department_contributions.count(), 0)

    def test_exact_period_and_conference_identity_all_four_types(self):
        research = ResearchProject.objects.create(title="Project", reporting_year="2024-2025", research_leader="Named person", funding="INTERNAL", is_published=True)
        extension = ExtensionProject.objects.create(title="Service", reporting_year=2025, extension_leader="Named person", is_published=True)
        conference = ConferenceRecord.objects.create(title="Event paper", year=2025, conference="Exact event", starts_on="2025-01-01", ends_on="2025-01-02", withdrawn=True, is_published=True)
        self.old_paper()
        FacultyResearchProject.objects.create(faculty=self.faculty, title=research.title, start_year=2024, end_year=2025, role="Research team member")
        FacultyExtensionProject.objects.create(faculty=self.faculty, title=extension.title, start_year=2025, end_year=2025, role="Participant")
        FacultyConference.objects.create(faculty=self.faculty, title=conference.title, conference_name="Exact event", year=2025, role="Participant")
        weak = FacultyResearchProject.objects.create(faculty=self.faculty, title=research.title, end_year=2025)
        reconcile(apps, apply=True)
        weak.refresh_from_db()
        self.assertIsNone(weak.reconciled_contribution_id)
        data = self.profile()
        self.assertEqual(len(data["department_contributions"]), 4)
        self.assertEqual(len(data["research_projects"]), 1)
        self.assertEqual(data["extension_projects"], [])
        event = next(r for r in data["department_contributions"] if r["kind"] == "conference")
        self.assertTrue(event["withdrawn"])
        self.assertEqual(event["role"], "Participant")

    def test_dry_run_and_existing_staff_credit_are_not_overwritten(self):
        old = self.old_paper(is_published=False)
        out = StringIO()
        call_command("reconcile_faculty_activities", stdout=out)
        self.assertFalse(json.loads(out.getvalue())["applied"])
        self.assertEqual(self.faculty.department_contributions.count(), 0)
        credit = FacultyContribution.objects.create(faculty=self.faculty, publication=self.paper, role="Department verified role", is_published=False)
        reconcile(apps, apply=True)
        old.refresh_from_db(); credit.refresh_from_db()
        self.assertEqual(old.reconciled_contribution_id, credit.pk)
        self.assertFalse(credit.is_published)
        self.assertEqual(credit.role, "Department verified role")
        self.assertEqual(self.profile()["publications"], [])
        self.assertEqual(self.profile()["department_contributions"], [])

    def test_database_constraints_and_manual_link_validation(self):
        credit = FacultyContribution.objects.create(faculty=self.faculty, publication=self.paper)
        research = ResearchProject.objects.create(title="Source", reporting_year="2025", funding="INTERNAL")
        for fields in ({}, {"publication": self.paper, "research": research}, {"publication": self.paper}):
            with self.assertRaises(IntegrityError), transaction.atomic():
                FacultyContribution.objects.create(faculty=self.faculty, **fields)
        other = FacultyMember.objects.create(title="Another person")
        old = self.old_paper(faculty=other, reconciled_contribution=credit)
        with self.assertRaises(ValidationError):
            old.clean()
        old.faculty = self.faculty
        old.clean()
        from django.db.models.deletion import ProtectedError
        with self.assertRaises(ProtectedError):
            credit.delete()

    def test_deprecated_admin_blocks_new_records_but_allows_historical_changes(self):
        from django.contrib.auth.models import User
        from django.test import RequestFactory
        request = RequestFactory().get("/admin/")
        request.user = User.objects.create_superuser("reviewer", password="test")
        for model in (FacultyPublication, FacultyResearchProject, FacultyConference, FacultyExtensionProject):
            model_admin = admin.site._registry[model]
            self.assertFalse(model_admin.has_add_permission(request))
            self.assertTrue(model_admin.has_change_permission(request))
