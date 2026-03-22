from django.contrib import admin
from .models import SiteSetting, DepartmentProfile, HeroSection, QuickStat


@admin.action(description="Mark selected hero sections as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("site_name", "primary_email", "primary_phone", "updated_at")
    search_fields = ("site_name", "short_name", "primary_email", "address")
    readonly_fields = ("created_at", "updated_at")


@admin.register(DepartmentProfile)
class DepartmentProfileAdmin(admin.ModelAdmin):
    list_display = ("title", "updated_at")
    search_fields = ("title", "overview", "vision", "mission", "goals")
    readonly_fields = ("created_at", "updated_at")


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "featured", "sort_order", "updated_at")
    list_filter = ("is_published", "featured")
    search_fields = ("title", "eyebrow", "subtitle")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    actions = [mark_published]


@admin.register(QuickStat)
class QuickStatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "sort_order", "updated_at")
    search_fields = ("label", "value", "note")
    ordering = ("sort_order", "label")
    readonly_fields = ("created_at", "updated_at")