import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from apps.core.base_models import TimeStampedModel


class EvaluationCurriculum(TimeStampedModel):
    name = models.CharField(max_length=200, unique=True)
    source = models.CharField(max_length=250)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class EvaluationCourse(models.Model):
    curriculum = models.ForeignKey(EvaluationCurriculum, on_delete=models.PROTECT, related_name='courses')
    code = models.CharField(max_length=30)
    title = models.CharField(max_length=200)
    units = models.DecimalField(max_digits=4, decimal_places=1)
    year = models.PositiveSmallIntegerField(default=0)
    semester = models.PositiveSmallIntegerField(default=0)
    is_elective = models.BooleanField(default=False)

    class Meta:
        ordering = ['year', 'semester', 'code']
        constraints = [models.UniqueConstraint(fields=['curriculum', 'code'], name='evaluation_curriculum_course')]

    def __str__(self):
        return f'{self.code} — {self.title}'


class EvaluationCampus(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)
    passing_grades = models.JSONField(default=list, help_text='Verified passing grade tokens, e.g. strings from the campus grading legend. Unknown grades require review.')
    nonpassing_grades = models.JSONField(default=list, help_text='Verified failed, withdrawn or incomplete tokens. Must not overlap passing grades.')
    is_active = models.BooleanField(default=True)
    policy_reference = models.CharField(max_length=250, help_text='Department verification or grading-legend reference.')

    def clean(self):
        from .evaluation_service import normalize_grade
        super().clean()
        for name in ('passing_grades', 'nonpassing_grades'):
            value = getattr(self, name)
            if not isinstance(value, list) or any(not isinstance(x, str) or not x.strip() for x in value):
                raise ValidationError({name: 'Enter a list of nonempty grade strings.'})
        if set(map(normalize_grade, self.passing_grades)) & set(map(normalize_grade, self.nonpassing_grades)):
            raise ValidationError('Passing and nonpassing grades must not overlap.')

    def __str__(self):
        return self.name


class EvaluationCapacity(TimeStampedModel):
    term = models.CharField(max_length=100)
    year = models.PositiveSmallIntegerField(choices=[(x, f'Year {x}') for x in range(1, 5)])
    capacity = models.PositiveIntegerField(default=80)
    occupied = models.PositiveIntegerField(default=0, help_text='Existing students; exclude accepted requests already counted by this portal.')

    class Meta:
        constraints = [models.UniqueConstraint(fields=['term', 'year'], name='evaluation_term_year_capacity')]

    @property
    def available(self):
        return self.capacity - self.occupied - self.requests.filter(status='accepted').count()

    def __str__(self):
        return f'{self.term} — Year {self.year} ({self.available} slots available)'


class EvaluationRequest(TimeStampedModel):
    reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    access_digest = models.CharField(max_length=64, editable=False)
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    applicant_type = models.CharField(max_length=12, choices=[('shiftee', 'Shiftee'), ('transferee', 'Transferee')])
    school = models.CharField(max_length=150)
    campus = models.ForeignKey(EvaluationCampus, null=True, blank=True, on_delete=models.PROTECT)
    within_msu = models.BooleanField(default=False)
    current_program = models.CharField(max_length=150)
    intended_term = models.CharField(max_length=100)
    curriculum = models.ForeignKey(EvaluationCurriculum, on_delete=models.PROTECT)
    document = models.BinaryField(editable=False)
    document_name = models.CharField(max_length=200, editable=False)
    draft = models.JSONField(default=dict, editable=False)
    status = models.CharField(max_length=20, default='adviser', choices=[('adviser', 'Adviser review'), ('chairperson', 'Chairperson review'), ('accepted', 'Accepted'), ('not_accepted', 'Not accepted')])
    assigned_adviser = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name='assigned_evaluations', limit_choices_to={'is_staff': True})
    records_verified = models.BooleanField(default=False, help_text='Adviser checked the transcript, grades and MSU affiliation against submitted entries.')
    adviser_notes = models.TextField(blank=True)
    capacity = models.ForeignKey(EvaluationCapacity, on_delete=models.PROTECT, null=True, blank=True, related_name='requests')
    capacity_override_reason = models.TextField(blank=True)
    student_feedback = models.TextField(blank=True, help_text='Released to the student only after the chairperson finalizes the decision.')
    adviser_approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name='adviser_approvals')
    adviser_approved_at = models.DateTimeField(null=True, blank=True)
    decided_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name='evaluation_decisions')
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        permissions = [('review_evaluation', 'Review and endorse evaluation as adviser'), ('decide_evaluation', 'Finalize evaluation as chairperson')]

    def __str__(self):
        return f'{self.reference} — {self.full_name}'


class EvaluationSubject(models.Model):
    request = models.ForeignKey(EvaluationRequest, on_delete=models.CASCADE, related_name='subjects')
    code = models.CharField(max_length=30)
    title = models.CharField(max_length=200)
    units = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    grade = models.CharField(max_length=30, blank=True)
    source_record = models.JSONField(default=dict, blank=True)
    course = models.ForeignKey(EvaluationCourse, null=True, blank=True, on_delete=models.PROTECT)
    automatic_result = models.CharField(max_length=30)
    reason = models.CharField(max_length=250)
    course_snapshot = models.JSONField(default=dict)
    decision = models.CharField(max_length=12, blank=True, choices=[('credit', 'Credit'), ('no_credit', 'Do not credit')])
    review_note = models.CharField(max_length=250, blank=True)

    class Meta:
        ordering = ['id']
