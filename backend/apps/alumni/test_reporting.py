import csv
from io import StringIO
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import TestCase, RequestFactory
from django.utils import timezone
from .models import AlumniProfile, GraduateRecord
from .reporting import outcome_rows, coverage_rows
from .admin import AlumniProfileAdmin, export_outcomes
from .serializers import RegistrationInput


class TracerReportingTests(TestCase):
    def profile(self, **changes):
        return AlumniProfile.objects.create(email="report@example.org", full_name="Test Graduate", bsca_year=2024, consented_at=timezone.now(), notice_version="test", **changes)

    def test_unanswered_activity_is_distinct_from_prefer_not_to_say(self):
        profile = self.profile()
        self.assertEqual(profile.career_status, "")
        self.assertEqual(outcome_rows(AlumniProfile.objects.all())[0][2], "Not answered")
        profile.career_status = "PREFER_NOT_TO_SAY"
        profile.save()
        self.assertEqual(outcome_rows(AlumniProfile.objects.all())[0][2], "Prefer not to say")
        serializer = RegistrationInput(data={"email": "other@example.org", "full_name": "Other Graduate", "bsca_year": 2024, "consent": True, "notice_version": "test", "career_status": ""})
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_outcomes_separate_programs_alignment_and_verification(self):
        self.profile(msca_year=2026, career_status="EMPLOYED", work_alignment="", verification_status="VERIFIED", receive_updates=True)
        rows = outcome_rows(AlumniProfile.objects.all())
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0], ("BSCA", 2024, "Employed", "Not answered", 1, 1, 0, 1, 0))
        self.assertEqual(rows[1][:2], ("MSCA", 2026))
        self.assertEqual(outcome_rows(AlumniProfile.objects.none()), [])

    def test_coverage_uses_selected_roster_and_excludes_mismatched_cohorts(self):
        profile = self.profile()
        for key, year, linked in (("linked", 2024, profile), ("unlinked", 2024, None), ("mismatch", 2025, profile)):
            GraduateRecord.objects.create(source_key=key, family_name="Test", first_name=key, program="BSCA", graduation_year=year, alumni_profile=linked)
        rows = coverage_rows(GraduateRecord.objects.all())
        self.assertEqual(rows[0], ("BSCA", 2024, 2, 1, 1, 0, 50.0, 0, 0, 1, 0))
        self.assertEqual(rows[1], ("BSCA", 2025, 1, 0, 0, 1, 0.0, 0, 0, 0, 0))
        self.assertEqual(coverage_rows(GraduateRecord.objects.filter(source_key="linked"))[0][6], 100.0)

    def test_summary_action_requires_staff_view_permission_and_exports_no_contacts(self):
        self.profile()
        modeladmin = AlumniProfileAdmin(AlumniProfile, admin.site)
        user = get_user_model().objects.create_user("summary-reviewer", is_staff=True)
        request = RequestFactory().get("/admin/alumni/alumniprofile/")
        request.user = user
        self.assertNotIn("export_outcomes", modeladmin.get_actions(request))
        user.user_permissions.add(Permission.objects.get(codename="view_alumniprofile"))
        request.user = get_user_model().objects.get(pk=user.pk)
        self.assertIn("export_outcomes", modeladmin.get_actions(request))
        response = export_outcomes(modeladmin, request, AlumniProfile.objects.all())
        rows = list(csv.reader(StringIO(response.content.decode("utf-8-sig"))))
        self.assertEqual(rows[1][2], "Not answered")
        self.assertNotIn("report@example.org", response.content.decode())
        self.assertEqual(response["Cache-Control"], "no-store")
        self.assertEqual(self.client.get("/admin/alumni/alumniprofile/").status_code, 302)

    def test_dropdown_reference_and_new_location_fields_preserve_history(self):
        from .location_options import location_options
        from .serializers import ProfileInput
        from .service import record_update
        data = location_options()
        self.assertIn("Philippines", data["countries"])
        groups = {group["name"]: group["cities"] for group in data["philippine_groups"]}
        self.assertIn("Tubod", groups["Lanao del Norte"])
        self.assertIn("City of Iligan", groups["Cities outside provinces"])
        self.assertIn("City of Manila", groups["Metro Manila (NCR)"])
        profile = self.profile(career_status="EMPLOYED", work_province="Lanao del Norte")
        record_update(profile, {"career_entry_mode": "CURRENT", "career_status": "EMPLOYED"})
        self.assertEqual(profile.career_history.get().work_province, "Lanao del Norte")
        serializer = ProfileInput(data={"full_name": profile.full_name, "bsca_year": 2024, "career_entry_mode": "NO_CHANGE", "residence_country": "Philippines", "residence_province": "Lanao del Norte", "residence_city": "Tubod", "bsca_period": "After 1st semester", "consent": True, "notice_version": "test"})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        record_update(profile, serializer.validated_data)
        self.assertEqual(profile.residence_province, "Lanao del Norte")
        self.assertEqual(profile.bsca_period, "After 1st semester")
        self.assertEqual(profile.career_history.count(), 1)
        self.assertEqual(profile.career_history.get().work_province, "Lanao del Norte")
