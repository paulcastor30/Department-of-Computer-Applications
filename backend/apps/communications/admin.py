from django.contrib import admin
from .models import NewsPost


@admin.action(description="Mark selected news posts as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "published_at", "starts_on", "deadline_on", "is_published", "featured", "updated_at")
    list_filter = ("category", "event_status", "is_published", "featured")
    search_fields = ("title", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    actions = [mark_published]
    fieldsets = (
        ("Announcement", {"fields": ("title", "slug", "category", "summary", "body", "source_url", "featured_image", "published_at")}),
        ("Activity and deadline dates", {"fields": ("starts_on", "ends_on", "starts_at", "deadline_on", "location", "event_status"), "description": "Enter supplied activity dates or deadlines. Publication dates are not event dates."}),
        ("Publishing", {"fields": ("is_published", "featured", "sort_order", "last_updated_note", "evidence_documents", "created_at", "updated_at")}),
    )
