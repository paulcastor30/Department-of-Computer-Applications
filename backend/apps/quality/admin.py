from django.contrib import admin
from .models import EvidenceDocument


@admin.register(EvidenceDocument)
class EvidenceDocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "framework", "area_code", "last_updated", "is_public_placeholder")
    list_filter = ("framework", "is_public_placeholder", "last_updated")
    search_fields = ("title", "area_code", "description")