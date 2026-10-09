from datetime import timedelta
from io import StringIO
import re
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core import mail
from django.core.cache import cache
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.utils import timezone
from .models import AlumniSettings, AlumniProfile, AlumniEmailLink, AlumniUpdateSession, AlumniOpportunity
from .views import digest


@override_settings(DEBUG=True, ALUMNI_EMAIL_ENABLED=True, EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend", DEFAULT_FROM_EMAIL="department@example.org", ALUMNI_PUBLIC_URL="http://127.0.0.1:8082")
class AlumniWorkflowTests(TestCase):
    def setUp(self):
        cache.clear()
        self.config = AlumniSettings.objects.get(pk=1)
        self.config.contact_email = "chair@example.org"
        self.config.privacy_notice = "Test notice: private department records; contact the chair to correct or delete; retention is 365 days."
        self.config.notice_version = "test-v1"
        self.config.retention_days = 365
        self.config.retain_indefinitely = False
        self.config.access_keys_enabled = False
        self.config.accepting_updates = True
        self.config.save()

    def post(self, endpoint, data, token=None):
        headers = {"HTTP_AUTHORIZATION": f"Bearer {token}"} if token else {}
        return self.client.post(f"/api/alumni/{endpoint}/", data, content_type="application/json", **headers)

    def session(self, email="graduate@example.org"):
        self.assertEqual(self.post("request-link", {"email": email}).status_code, 200)
        token = re.search(r"#alumni-token=([\w-]+)", mail.outbox[-1].body)[1]
        response = self.post("verify-link", {"token": token})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Cache-Control"], "no-store")
        return response.json()["session_token"]

    def payload(self, **changes):
        return {"full_name": "Test Graduate", "bsca_year": 2020, "msca_year": 2024,
            "career_status": "EMPLOYED", "employer": "Test business", "job_title": "Developer",
            "interests": "IoT", "preferred_contact": "EMAIL", "phone": "", "receive_updates": False,
            "willing_to_mentor": True, "notice_version": "test-v1", "consent": True, **changes}

    def test_both_programs_save_privately_and_separate_affiliation_review(self):
        response = self.post("profile", self.payload(), self.session())
        self.assertEqual(response.status_code, 200)
        profile = AlumniProfile.objects.get()
        self.assertEqual((profile.bsca_year, profile.msca_year), (2020, 2024))
        self.assertEqual(profile.verification_status, "PENDING")
        self.assertFalse(profile.receive_updates)
        self.assertTrue(profile.willing_to_mentor)
        self.assertEqual(profile.notice_version, "test-v1")
        self.assertEqual(self.client.get("/api/alumni/profile/").status_code, 405)

    def test_no_profile_is_created_until_verification_and_consent(self):
        session = self.session()
        self.assertFalse(AlumniProfile.objects.exists())
        self.assertEqual(self.post("profile", self.payload(consent=False), session).status_code, 400)
        self.assertFalse(AlumniProfile.objects.exists())
        self.assertEqual(self.post("profile", self.payload(), session).status_code, 200)

    def test_expired_and_reused_email_links_fail(self):
        self.post("request-link", {"email": "graduate@example.org"})
        token = re.search(r"#alumni-token=([\w-]+)", mail.outbox[-1].body)[1]
        link = AlumniEmailLink.objects.get(token_hash=digest(token))
        self.assertNotEqual(link.token_hash, token)
        self.assertEqual(self.post("verify-link", {"token": token}).status_code, 200)
        self.assertEqual(self.post("verify-link", {"token": token}).status_code, 400)
        link.used_at = None
        link.expires_at = timezone.now() - timedelta(seconds=1)
        link.save()
        self.assertEqual(self.post("verify-link", {"token": token}).status_code, 400)

    def test_only_verified_email_owner_can_update_and_session_cannot_be_replayed(self):
        token = self.session("first@example.org")
        self.assertEqual(self.post("profile", self.payload(), token).status_code, 200)
        self.assertEqual(self.post("profile", self.payload(full_name="Replay"), token).status_code, 403)
        self.assertEqual(self.post("profile", self.payload()).status_code, 403)
        other = self.session("second@example.org")
        self.assertEqual(self.post("profile", self.payload(full_name="Second Graduate", email="first@example.org"), other).status_code, 200)
        self.assertEqual(AlumniProfile.objects.get(email="first@example.org").full_name, "Test Graduate")
        self.assertEqual(AlumniProfile.objects.get(email="second@example.org").full_name, "Second Graduate")

    def test_session_expiry_and_changed_notice_prevent_saving(self):
        token = self.session()
        self.assertEqual(self.post("profile", self.payload(notice_version="old-version"), token).status_code, 400)
        AlumniUpdateSession.objects.filter(token_hash=digest(token)).update(expires_at=timezone.now() - timedelta(seconds=1))
        self.assertEqual(self.post("profile", self.payload(), token).status_code, 403)

    def test_identity_changes_reset_affiliation_but_career_updates_preserve_it(self):
        self.post("profile", self.payload(), self.session())
        AlumniProfile.objects.update(verification_status="VERIFIED", reviewed_at=timezone.now())
        self.post("profile", self.payload(job_title="Researcher", receive_updates=True), self.session())
        profile = AlumniProfile.objects.get()
        self.assertEqual(profile.verification_status, "VERIFIED")
        self.post("profile", self.payload(full_name="Updated name", receive_updates=False), self.session())
        profile.refresh_from_db()
        self.assertEqual(profile.verification_status, "PENDING")
        self.assertIsNone(profile.reviewed_at)
        self.assertFalse(profile.receive_updates)

    def test_optional_career_details_clear_when_prefer_not_to_say(self):
        self.post("profile", self.payload(career_status="PREFER_NOT_TO_SAY"), self.session())
        profile = AlumniProfile.objects.get()
        self.assertEqual(profile.employer, "")
        self.assertEqual(profile.job_title, "")

    def test_requires_a_valid_graduation_year_and_phone_when_selected(self):
        token = self.session()
        for changes in ({"bsca_year": None, "msca_year": None}, {"bsca_year": timezone.localdate().year + 1}, {"preferred_contact": "PHONE", "phone": ""}):
            self.assertEqual(self.post("profile", self.payload(**changes), token).status_code, 400)

    def test_closed_service_and_missing_mail_never_accept_submissions(self):
        with override_settings(ALUMNI_EMAIL_ENABLED=False):
            self.assertFalse(self.client.get("/api/alumni/configuration/").json()["accepting_updates"])
            self.assertEqual(self.post("request-link", {"email": "graduate@example.org"}).status_code, 503)
        self.config.accepting_updates = False
        self.config.save()
        self.assertEqual(self.post("request-link", {"email": "graduate@example.org"}).status_code, 503)

    def test_mail_failure_invalidates_link_and_does_not_create_profile(self):
        with patch("apps.alumni.views.send_mail", side_effect=RuntimeError("Mail unavailable")):
            self.assertEqual(self.post("request-link", {"email": "graduate@example.org"}).status_code, 503)
        self.assertIsNotNone(AlumniEmailLink.objects.get().used_at)
        self.assertFalse(AlumniProfile.objects.exists())

    def test_link_responses_do_not_reveal_membership_and_limit_repeat_mail(self):
        email = "graduate@example.org"
        responses = [self.post("request-link", {"email": email}).json() for _ in range(4)]
        self.assertTrue(all(response == responses[0] for response in responses))
        self.assertEqual(AlumniEmailLink.objects.filter(email=email).count(), 3)
        self.assertEqual(len(mail.outbox), 3)

    def test_private_dashboard_requires_permission_and_includes_program_filters(self):
        self.post("profile", self.payload(), self.session())
        self.assertEqual(self.client.get("/admin/alumni/alumniprofile/").status_code, 302)
        user = get_user_model().objects.create_user(username="reviewer", password="test-pass", is_staff=True)
        self.client.force_login(user)
        self.assertEqual(self.client.get("/admin/alumni/alumniprofile/").status_code, 403)
        user.user_permissions.add(Permission.objects.get(codename="view_alumniprofile"))
        response = self.client.get("/admin/alumni/alumniprofile/?program=MSCA")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Private alumni records")
        self.assertContains(response, "Test Graduate")

    def test_opportunities_exclude_drafts_and_closed_items(self):
        for slug, published, close in [("open", True, None), ("draft", False, None), ("closed", True, timezone.localdate() - timedelta(days=1))]:
            AlumniOpportunity.objects.create(title=slug, slug=slug, kind="EVENT", provider="Test provider", description="Test opportunity", url="https://example.org", is_published=published, closes_on=close)
        self.assertEqual([item["slug"] for item in self.client.get("/api/alumni/opportunities/").json()], ["open"])

    def test_retention_preview_preserves_records_and_apply_purges_old_only(self):
        self.post("profile", self.payload(), self.session())
        AlumniProfile.objects.update(alumni_updated_at=timezone.now() - timedelta(days=366))
        call_command("purge_alumni_records", stdout=StringIO())
        self.assertTrue(AlumniProfile.objects.exists())
        call_command("purge_alumni_records", apply=True, stdout=StringIO())
        self.assertFalse(AlumniProfile.objects.exists())

    def test_settings_cannot_open_without_notice_contact_and_retention(self):
        from django.core.exceptions import ValidationError
        self.config.retention_days = None
        with self.assertRaises(ValidationError):
            self.config.save()

    def test_profile_deletion_also_removes_access_links_and_sessions(self):
        self.post("profile", self.payload(), self.session())
        pending_session = self.session()
        AlumniProfile.objects.all().delete()
        self.assertFalse(AlumniEmailLink.objects.exists())
        self.assertFalse(AlumniUpdateSession.objects.exists())
        self.assertEqual(self.post("profile", self.payload(), pending_session).status_code, 403)


@override_settings(DEBUG=True, ALUMNI_EMAIL_ENABLED=False, ALUMNI_PUBLIC_URL="http://127.0.0.1:8082")
class AlumniAccessKeyTests(TestCase):
    def setUp(self):
        cache.clear()
        self.config = AlumniSettings.objects.get(pk=1)
        self.notice = self.config.notice_version

    def post(self, path, data, token=None):
        return self.client.post(f"/api/alumni/{path}/", data, content_type="application/json", **({"HTTP_AUTHORIZATION": f"Bearer {token}"} if token else {}))

    def payload(self, **changes):
        return {"email": "private@example.org", "full_name": "Private Graduate", "bsca_year": 2024, "career_status": "EMPLOYED", "employer": "Fictional employer", "job_title": "First role", "duties": "Maintain sensors", "work_city": "Iligan", "work_country": "Philippines", "further_study": True, "study_program": "MSCA", "consent": True, "notice_version": self.notice, **changes}

    def register(self):
        response = self.post("register", self.payload())
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response["Cache-Control"], "no-store")
        return response.json()["access_key"]

    def access(self, key):
        response = self.post("access", {"email": "private@example.org", "access_key": key})
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_registration_opens_without_email_and_returns_key_only_once(self):
        self.assertTrue(self.client.get("/api/alumni/configuration/").json()["accepting_updates"])
        key = self.register()
        profile = AlumniProfile.objects.get()
        self.assertNotEqual(profile.access_key_hash, key)
        self.assertIsNone(profile.email_verified_at)
        self.assertEqual(profile.verification_status, "PENDING")
        self.assertEqual(profile.career_history.count(), 1)
        self.assertFalse(profile.receive_updates)
        self.assertTrue(profile.further_study)
        result = self.access(key)
        self.assertNotIn("access_key_hash", result["profile"])
        self.assertNotIn("access_key", result)
        self.assertEqual(self.post("request-link", {"email": "private@example.org"}).status_code, 503)

    def test_new_role_appends_and_previous_role_does_not_replace_current(self):
        key = self.register()
        token = self.access(key)["session_token"]
        self.assertEqual(self.post("profile", self.payload(job_title="Second role", duties="Design networks"), token).status_code, 200)
        token = self.access(key)["session_token"]
        self.assertEqual(self.post("profile", self.payload(job_title="Earlier internship", career_entry_mode="HISTORICAL"), token).status_code, 200)
        profile = AlumniProfile.objects.get()
        self.assertEqual(profile.job_title, "Second role")
        self.assertIsNone(profile.email_verified_at)
        self.assertEqual(list(profile.career_history.values_list("job_title", flat=True)), ["Earlier internship", "Second role", "First role"])
        self.assertEqual(profile.career_history.last().duties, "Maintain sensors")
        token = self.access(key)["session_token"]
        self.assertEqual(self.post("profile", self.payload(phone="09123456789", career_entry_mode="NO_CHANGE"), token).status_code, 200)
        profile.refresh_from_db()
        self.assertEqual(profile.career_history.count(), 3)
        self.assertEqual(profile.job_title, "Second role")

    def test_wrong_key_and_cross_account_email_cannot_access_records(self):
        key = self.register()
        for email, candidate in [("private@example.org", "x" * 43), ("other@example.org", key)]:
            response = self.post("access", {"email": email, "access_key": candidate})
            self.assertEqual(response.status_code, 403)
            self.assertNotIn("profile", response.json())
        self.assertEqual(self.post("register", self.payload()).status_code, 400)
        self.assertEqual(AlumniProfile.objects.count(), 1)

    def test_indefinite_policy_preserves_accounts_and_history_during_cleanup(self):
        self.register()
        AlumniProfile.objects.update(alumni_updated_at=timezone.now() - timedelta(days=5000))
        self.config.retention_days = 1
        self.config.save()
        call_command("purge_alumni_records", apply=True, stdout=StringIO())
        self.assertEqual(AlumniProfile.objects.count(), 1)
        self.assertEqual(AlumniProfile.objects.get().career_history.count(), 1)

    def test_registration_requires_current_notice_consent_and_valid_dates(self):
        for changes in ({"consent": False}, {"notice_version": "old"}, {"career_start": "2025-01-01", "career_end": "2024-01-01"}, {"career_start": "2099-01-01"}):
            self.assertEqual(self.post("register", self.payload(**changes)).status_code, 400)
        self.assertFalse(AlumniProfile.objects.exists())

    def test_roster_is_not_public_and_export_is_private_and_spreadsheet_safe(self):
        from .models import GraduateRecord
        from .admin import private_csv
        GraduateRecord.objects.create(source_key="test", family_name="Private", first_name="Graduate", program="BSCA", graduation_year=2024)
        self.assertEqual(self.client.get("/api/alumni/graduates/").status_code, 404)
        self.assertEqual(self.client.get("/admin/alumni/graduaterecord/").status_code, 302)
        response = private_csv("test.csv", ["Name"], [["=HYPERLINK(\"https://example.org\")"]])
        self.assertIn("'=HYPERLINK", response.content.decode())
        self.assertEqual(response["Cache-Control"], "no-store")

    def test_staff_reset_needs_separate_permission_and_revokes_old_access(self):
        from .admin import AlumniProfileAdmin, reset_access
        from django.contrib.admin import site
        from django.test import RequestFactory
        key = self.register()
        result = self.access(key)
        user = get_user_model().objects.create_user(username="reset-reviewer", is_staff=True)
        user.user_permissions.add(Permission.objects.get(codename="change_alumniprofile"))
        request = RequestFactory().post("/admin/alumni/alumniprofile/")
        request.user = user
        modeladmin = AlumniProfileAdmin(AlumniProfile, site)
        self.assertFalse(modeladmin.has_reset_access_permission(request))
        user.user_permissions.add(Permission.objects.get(codename="reset_alumni_access"))
        request.user = get_user_model().objects.get(pk=user.pk)
        self.assertTrue(modeladmin.has_reset_access_permission(request))
        response = reset_access(modeladmin, request, AlumniProfile.objects.all())
        replacement = response.context_data["access_key"]
        self.assertEqual(response["Cache-Control"], "no-store")
        self.assertEqual(self.post("access", {"email": "private@example.org", "access_key": key}).status_code, 403)
        self.assertEqual(self.post("profile", self.payload(), result["session_token"]).status_code, 403)
        self.assertEqual(self.access(replacement)["profile"]["full_name"], "Private Graduate")


class GraduateImportTests(TestCase):
    def test_source_layout_preserves_overlap_blank_marks_and_program_scope(self):
        from tempfile import TemporaryDirectory
        from pathlib import Path
        from .workbook_import import extract_workbook
        rows = [(8, {0: "Period of Rating:", 1: "1st Quarter 2026"}), (9, {0: "Batch being Traced:", 1: "Batch 2024"}),
            (12, {0: "BACHELOR OF SCIENCE IN COMPUTER APPLICATIONS"}),
            (13, {0: "Example", 1: "Graduate", 2: "9123456789.0", 3: "1", 5: "1", 7: "1", 8: "1", 10: "0", 11: "1", 14: "Work and study"}),
            (15, {0: "TOTAL", 1: "1"}), (16, {0: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE"}), (17, {0: "Other", 1: "Program"})]
        with TemporaryDirectory() as folder:
            source = Path(folder) / "example.xlsx"
            source.write_bytes(b"synthetic fixture")
            with patch("apps.alumni.workbook_import.rows_by_sheet", return_value=[("Computer Applications", rows)]):
                result = extract_workbook(source)
        self.assertEqual(len(result), 1)
        graduate, observation = result[0]
        self.assertEqual(graduate["phone"], "09123456789")
        self.assertEqual(graduate["graduation_year"], 2024)
        self.assertTrue(observation["employed"])
        self.assertTrue(observation["further_study"])
        self.assertFalse(observation["aligned"])
        self.assertIsNone(observation["exam_passed"])

    def test_roster_uses_alumni_email_not_school_contact_and_ignores_other_programs(self):
        from tempfile import TemporaryDirectory
        from pathlib import Path
        from .workbook_import import extract_workbook
        rows = [(9, {0: "Example", 1: "Graduate", 3: "2021-0001", 7: "alumnus@example.org", 8: "institution@example.org", 9: "Graduated: 2nd Sem of 2024-2025 Course: MASTER OF SCIENCE IN COMPUTER APPLICATIONS"}),
            (10, {0: "Other", 1: "Program", 9: "Graduated: 2024-2025 Course: BACHELOR OF SCIENCE IN COMPUTER SCIENCE"})]
        with TemporaryDirectory() as folder:
            source = Path(folder) / "roster.xlsx"
            source.write_bytes(b"synthetic fixture")
            with patch("apps.alumni.workbook_import.rows_by_sheet", return_value=[("Sheet1", rows)]):
                result = extract_workbook(source)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0][0]["email"], "alumnus@example.org")
        self.assertEqual(result[0][0]["program"], "MSCA")
        self.assertEqual(result[0][0]["graduation_year"], 2025)

    def test_repeated_import_is_idempotent_preserves_staff_corrections_and_creates_no_accounts(self):
        from .models import GraduateRecord, GraduateObservation
        source = ({"source_key": "test-source", "family_name": "Example", "first_name": "Graduate", "program": "BSCA", "graduation_year": 2024, "phone": "09123456789"},
            {"source_file": "test.xlsx", "source_sheet": "Computer Applications", "source_row": 13, "source_digest": "fixture", "reporting_period": "1st Quarter 2026", "traced": True, "remarks": "Synthetic role"})
        accounts = get_user_model().objects.count()
        with patch("apps.alumni.management.commands.import_alumni_workbooks.extract_workbook", return_value=[source]):
            call_command("import_alumni_workbooks", "fixture.xlsx", stdout=StringIO())
            self.assertFalse(GraduateRecord.objects.exists())
            call_command("import_alumni_workbooks", "fixture.xlsx", apply=True, stdout=StringIO())
            GraduateRecord.objects.update(phone="Staff corrected contact")
            call_command("import_alumni_workbooks", "fixture.xlsx", apply=True, stdout=StringIO())
        self.assertEqual(GraduateRecord.objects.count(), 1)
        self.assertEqual(GraduateObservation.objects.count(), 1)
        self.assertEqual(GraduateRecord.objects.get().phone, "Staff corrected contact")
        self.assertFalse(AlumniProfile.objects.exists())
        self.assertEqual(get_user_model().objects.count(), accounts)
