from datetime import timedelta
from django.contrib import admin
from django.utils import timezone
from .models import AlumniProfile, AlumniSettings, AlumniOpportunity


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
    list_filter = (DegreeFilter, "bsca_year", "msca_year", "verification_status", "career_status", "receive_updates", "willing_to_mentor", "alumni_updated_at")
    search_fields = ("full_name", "email", "employer", "job_title", "interests")
    readonly_fields = ("email", "email_verified_at", "consented_at", "notice_version", "reviewed_by", "reviewed_at", "alumni_updated_at", "created_at", "updated_at")
    actions = [verify_affiliation]
    date_hierarchy = "alumni_updated_at"

    def has_add_permission(self, request):
        return False

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)
        if getattr(response, "context_data", None) and "cl" in response.context_data:
            records = response.context_data["cl"].queryset
            response.context_data["alumni_summary"] = {
                "total": records.count(), "verified": records.filter(verification_status="VERIFIED").count(),
                "bsca": records.filter(bsca_year__isnull=False).count(), "msca": records.filter(msca_year__isnull=False).count(),
                "mentors": records.filter(willing_to_mentor=True).count(),
                "outdated": records.filter(alumni_updated_at__lt=timezone.now() - timedelta(days=365)).count(),
            }
        return response


@admin.register(AlumniSettings)
class AlumniSettingsAdmin(admin.ModelAdmin):
    list_display = ("contact_label", "accepting_updates", "notice_version", "retention_days")
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
