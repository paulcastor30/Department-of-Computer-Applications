from django.contrib import admin
from .models import NewsPost


@admin.action(description="Mark selected news posts as published")
def mark_published(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.register(NewsPost)
class NewsPostAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "published_at", "is_published", "featured", "updated_at")
    list_filter = ("category", "is_published", "featured")
    search_fields = ("title", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("evidence_documents",)
    actions = [mark_published]