from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.http import HttpResponse
from django.urls import path, reverse
from django.utils.html import format_html
from .evaluation_models import (EvaluationCurriculum, EvaluationCourse, EvaluationCampus,
    EvaluationCapacity, EvaluationRequest, EvaluationSubject)
from .evaluation_service import transition


class CourseInline(admin.TabularInline):
    model = EvaluationCourse
    extra = 0


@admin.register(EvaluationCurriculum)
class CurriculumAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'source')
    inlines = [CourseInline]


@admin.register(EvaluationCampus)
class CampusAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'policy_reference')


@admin.register(EvaluationCapacity)
class CapacityAdmin(admin.ModelAdmin):
    list_display = ('term', 'year', 'capacity', 'occupied', 'available')
    readonly_fields = ('available',)


class SubjectInline(admin.TabularInline):
    model = EvaluationSubject
    extra = 0
    can_delete = False
    fields = ('code', 'title', 'units', 'grade', 'automatic_result', 'reason', 'source_details', 'course', 'decision', 'review_note')
    readonly_fields = ('code', 'title', 'units', 'grade', 'automatic_result', 'reason', 'source_details')

    @admin.display(description='Original record')
    def source_details(self, obj):
        source = obj.source_record or {}
        if not source:
            return 'Original PDF available on the request.'
        return format_html('<details><summary>Page {} · {}</summary><p>{} — {}</p><p>Original grade: {}<br>Completion: {}<br>{}</p></details>',
            source.get('source_page', '—'), source.get('code', ''), source.get('code', ''), source.get('title', ''),
            source.get('original_grade') or 'Not recorded', source.get('completion_grade') or 'None', source.get('semester', ''))

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return bool(obj and obj.status == 'adviser' and request.user.has_perm('academics.review_evaluation') and (request.user.is_superuser or obj.assigned_adviser_id == request.user.pk))

    def get_readonly_fields(self, request, obj=None):
        return self.readonly_fields if self.has_change_permission(request, obj) else self.fields


@admin.register(EvaluationRequest)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('reference', 'full_name', 'applicant_type', 'intended_term', 'status', 'assigned_adviser', 'created_at')
    list_filter = ('status', 'applicant_type', 'intended_term')
    search_fields = ('full_name', 'email', 'reference')
    inlines = [SubjectInline]
    actions = ('endorse', 'accept', 'decline')
    exclude = ('document', 'access_digest')

    def get_queryset(self, request):
        return super().get_queryset(request).defer('document', 'access_digest')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def get_readonly_fields(self, request, obj=None):
        fields = [f.name for f in self.model._meta.fields if f.name not in ('document', 'access_digest', 'id')]
        editable = {'assigned_adviser'} if request.user.is_superuser or request.user.has_perm('academics.decide_evaluation') else set()
        if obj and obj.status == 'adviser' and request.user.has_perm('academics.review_evaluation') and (request.user.is_superuser or obj.assigned_adviser_id == request.user.pk):
            editable |= {'records_verified', 'adviser_notes'}
        if obj and obj.status == 'chairperson' and request.user.has_perm('academics.decide_evaluation'):
            editable |= {'capacity', 'capacity_override_reason', 'student_feedback'}
        if obj and obj.status in ('accepted', 'not_accepted'):
            editable = set()
        return tuple(f for f in fields if f not in editable) + ('original_document',)

    @admin.display(description='Uploaded record')
    def original_document(self, obj):
        return format_html('<a href="{}">Download submitted PDF</a>', reverse('admin:evaluation-document', args=[obj.pk]))

    def get_urls(self):
        return [path('<int:pk>/document/', self.admin_site.admin_view(self.document), name='evaluation-document')] + super().get_urls()

    def document(self, request, pk):
        obj = self.get_object(request, pk)
        if obj is None or not self.has_view_permission(request, obj):
            raise PermissionDenied
        response = HttpResponse(bytes(obj.document), content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="evaluation-record.pdf"'
        response['Cache-Control'] = 'no-store, private'
        response['X-Content-Type-Options'] = 'nosniff'
        return response

    def run_action(self, request, queryset, action):
        for obj in queryset:
            try:
                transition(obj.reference, request.user, action)
            except ValidationError as exc:
                self.message_user(request, f'{obj.full_name}: {"; ".join(exc.messages)}', messages.ERROR)
            except PermissionDenied:
                self.message_user(request, 'You do not have permission for this review stage.', messages.ERROR)
            else:
                self.log_change(request, obj, f'Evaluation transition: {action}')
                self.message_user(request, f'{obj.full_name}: review stage updated.', messages.SUCCESS)

    @admin.action(description='Adviser: endorse selected evaluations', permissions=['review'])
    def endorse(self, request, queryset):
        self.run_action(request, queryset, 'endorse')

    @admin.action(description='Chairperson: accept and release feedback', permissions=['decide'])
    def accept(self, request, queryset):
        self.run_action(request, queryset, 'accept')

    @admin.action(description='Chairperson: do not accept and release feedback', permissions=['decide'])
    def decline(self, request, queryset):
        self.run_action(request, queryset, 'decline')

    def has_review_permission(self, request):
        return request.user.has_perm('academics.review_evaluation')

    def has_decide_permission(self, request):
        return request.user.has_perm('academics.decide_evaluation')
