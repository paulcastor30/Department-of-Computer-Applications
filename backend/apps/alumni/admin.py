from datetime import timedelta
import csv
import secrets
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.utils import timezone
from .models import AlumniCareerEntry, AlumniEmailLink, AlumniUpdateSession, AlumniProfile, AlumniSettings, AlumniOpportunity, GraduateRecord, GraduateObservation, CAREER_FIELDS


def safe_cell(value):
    value = "" if value is None else str(value)
    return "'" + value if value.lstrip().startswith(("=", "+", "-", "@")) else value


def private_csv(filename, headers, rows):
    response = HttpResponse(content_type="text/csv; charset=utf-8")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response["Cache-Control"] = "no-store"
    response.write("\ufeff")
    writer = csv.writer(response)
    writer.writerow(headers)
    for row in rows:
        writer.writerow([safe_cell(value) for value in row])
    return response


class CareerHistoryInline(admin.StackedInline):
    model = AlumniCareerEntry
    extra = 0
    fields = ("reported_at", "entry_kind", *CAREER_FIELDS)
    readonly_fields = fields
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.action(description="Export selected private alumni tracing details", permissions=["view"])
def export_alumni(modeladmin, request, queryset):
    fields = ("full_name", "family_name", "first_name", "middle_name", "email", "phone", "landline", "student_id", "sex", "bsca_year", "bsca_period", "msca_year", "msca_period", "residence_city", "residence_country", "permanent_address", *CAREER_FIELDS, "interests", "network_interests", "professional_url", "receive_updates", "willing_to_mentor", "verification_status", "alumni_updated_at")
    return private_csv("private-alumni-tracing.csv", fields, ([getattr(profile, field) for field in fields] for profile in queryset))


@admin.action(description="Issue replacement access key after confirming identity", permissions=["reset_access"])
def reset_access(modeladmin, request, queryset):
    if queryset.count() != 1:
        modeladmin.message_user(request, "Select exactly one alumnus after confirming the requester's identity through department records and a known contact.", level="error")
        return
    profile = queryset.get()
    key = secrets.token_urlsafe(32)
    profile.access_key_hash = make_password(key)
    profile.save(update_fields=["access_key_hash", "updated_at"])
    AlumniUpdateSession.objects.filter(email=profile.email).delete()
    AlumniEmailLink.objects.filter(email=profile.email).delete()
    modeladmin.log_change(request, profile, "Replacement access key issued after staff identity confirmation; previous access revoked.")
    response = TemplateResponse(request, "admin/alumni/access_key.html", {**modeladmin.admin_site.each_context(request), "title": "Replacement alumni access key", "profile": profile, "access_key": key})
    response["Cache-Control"] = "no-store"
    response["Referrer-Policy"] = "no-referrer"
    return response


@admin.action(description="Export retained career history for selected alumni", permissions=["view"])
def export_history(modeladmin, request, queryset):
    fields = ("reported_at", "entry_kind", *CAREER_FIELDS)
    rows = ([profile.full_name, profile.email, *[getattr(entry, field) for field in fields]] for profile in queryset.prefetch_related("career_history") for entry in profile.career_history.all())
    return private_csv("private-alumni-career-history.csv", ["full_name", "email", *fields], rows)


class DegreeFilter(admin.SimpleListFilter):
    title = "program"
    parameter_name = "program"

    def lookups(self, request, model_admin):
        return [("BSCA", "BSCA"), ("MSCA", "MSCA"), ("BOTH", "Both programs")]

    def queryset(self, request, queryset):
        if self.value() == "BSCA":
            return queryset.filter(bsca_year__isnull=False)
        if self.value() == "MSCA":
            return queryset.filter(msca_year__isnull=False)
        if self.value() == "BOTH":
            return queryset.filter(bsca_year__isnull=False, msca_year__isnull=False)
        return queryset


@admin.action(description="Confirm alumni affiliation against department records")
def verify_affiliation(modeladmin, request, queryset):
    queryset.update(verification_status="VERIFIED", reviewed_by=request.user, reviewed_at=timezone.now())


@admin.register(AlumniProfile)
class AlumniProfileAdmin(admin.ModelAdmin):
    change_list_template = "admin/alumni/alumniprofile/change_list.html"
    list_display = ("full_name", "email", "bsca_year", "msca_year", "career_status", "verification_status", "receive_updates", "willing_to_mentor", "alumni_updated_at")
    list_filter = (DegreeFilter, "bsca_year", "msca_year", "verification_status", "career_status", "work_country", "work_alignment", "further_study", "exam_status", "receive_updates", "willing_to_mentor", "alumni_updated_at")
    search_fields = ("full_name", "email", "student_id", "employer", "job_title", "duties", "industry", "work_city", "residence_city", "interests", "skills_used", "network_interests")
    readonly_fields = ("email", "email_verified_at", "consented_at", "notice_version", "reviewed_by", "reviewed_at", "alumni_updated_at", "created_at", "updated_at", *CAREER_FIELDS)
    exclude = ("access_key_hash",)
    actions = [verify_affiliation, export_alumni, export_history, reset_access]
    inlines = [CareerHistoryInline]
    date_hierarchy = "alumni_updated_at"

    def has_add_permission(self, request):
        return False

    def has_reset_access_permission(self, request):
        return self.has_change_permission(request) and request.user.has_perm("alumni.reset_alumni_access")

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)
        if getattr(response, "context_data", None) and "cl" in response.context_data:
            records = response.context_data["cl"].queryset
            response.context_data["alumni_summary"] = {
                "total": records.count(), "verified": records.filter(verification_status="VERIFIED").count(),
                "bsca": records.filter(bsca_year__isnull=False).count(), "msca": records.filter(msca_year__isnull=False).count(),
                "mentors": records.filter(willing_to_mentor=True).count(),
                "outdated": records.filter(alumni_updated_at__lt=timezone.now() - timedelta(days=365)).count(),
                "working": records.filter(career_status__in=["EMPLOYED", "SELF_EMPLOYED"]).count(),
                "studying": records.filter(further_study=True).count() + records.filter(career_status="FURTHER_STUDY", further_study=False).count(),
                "work_location": records.exclude(work_country="").count(),
            }
            if request.user.has_perm("alumni.view_graduaterecord"):
                response.context_data["graduate_summary"] = {"total": GraduateRecord.objects.count(), "linked": GraduateRecord.objects.filter(alumni_profile__isnull=False).count()}
        return response


@admin.register(AlumniSettings)
class AlumniSettingsAdmin(admin.ModelAdmin):
    list_display = ("contact_label", "accepting_updates", "access_keys_enabled", "notice_version", "retain_indefinitely", "retention_days")
    readonly_fields = ("created_at", "updated_at")

    def has_add_permission(self, request):
        return not AlumniSettings.objects.exists() and super().has_add_permission(request)


@admin.register(AlumniOpportunity)
class AlumniOpportunityAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "provider", "closes_on", "is_published")
    list_filter = ("kind", "is_published")
    search_fields = ("title", "description", "provider")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")


class GraduateObservationInline(admin.StackedInline):
    model = GraduateObservation
    extra = 0
    fields = ("source_file", "source_sheet", "source_row", "reporting_period", "traced", "employed", "further_study", "unemployed", "aligned", "exam_passed", "remarks", "imported_at")
    readonly_fields = fields
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.action(description="Export selected graduate roster and source tracing observations", permissions=["view"])
def export_graduates(modeladmin, request, queryset):
    fields = ("family_name", "first_name", "middle_name", "student_id", "program", "graduation_year", "graduation_period", "phone", "landline", "email", "permanent_address", "sex")
    source_fields = ("source_file", "source_sheet", "source_row", "reporting_period", "traced", "employed", "further_study", "unemployed", "aligned", "exam_passed", "remarks")
    def rows():
        for graduate in queryset.prefetch_related("observations"):
            for observation in graduate.observations.all():
                yield [getattr(graduate, f) for f in fields] + [getattr(observation, f) for f in source_fields] + [graduate.alumni_profile_id or ""]
    return private_csv("private-graduate-source-tracing.csv", [*fields, *source_fields, "linked_alumni_account"], rows())


@admin.register(GraduateRecord)
class GraduateRecordAdmin(admin.ModelAdmin):
    list_display = ("family_name", "first_name", "program", "graduation_year", "graduation_period", "alumni_profile")
    list_filter = ("program", "graduation_year", ("alumni_profile", admin.EmptyFieldListFilter))
    search_fields = ("family_name", "first_name", "middle_name", "student_id", "email", "phone")
    readonly_fields = ("source_key", "created_at", "updated_at")
    autocomplete_fields = ("alumni_profile",)
    inlines = [GraduateObservationInline]
    actions = [export_graduates]

    def has_add_permission(self, request):
        return False
