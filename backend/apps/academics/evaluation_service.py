import re
import unicodedata
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError, PermissionDenied
from django.db import transaction
from django.utils import timezone
from .evaluation_models import EvaluationRequest, EvaluationCapacity


def normalize(value):
    # Preserve digits and word order; punctuation/spacing do not create equivalencies.
    return re.sub(r'[^\w]+', '', unicodedata.normalize('NFKC', str(value)).casefold())


def normalize_grade(value):
    token = str(value).strip().upper()
    try:
        return str(Decimal(token).normalize())
    except InvalidOperation:
        return token


def compare(curriculum, rows, campus, within_msu):
    courses = list(curriculum.courses.all())
    by_code = {normalize(c.code): c for c in courses}
    duplicates = set()
    results = []
    proposed = set()
    passed = set(map(normalize_grade, campus.passing_grades)) if campus else set()
    failed = set(map(normalize_grade, campus.nonpassing_grades)) if campus else set()
    for row in rows:
        course = by_code.get(normalize(row['code']))
        exact = course and normalize(course.title) == normalize(row['title'])
        result, reason = 'manual_review', 'No exact course number and title match; adviser review required.'
        grade = normalize_grade(row['grade'])
        if not within_msu or not campus:
            reason = 'MSU campus and grading rules are not verified; adviser review required.'
        elif grade in failed:
            result, reason = 'not_eligible', 'Grade is recorded as failed, incomplete or withdrawn by the campus rules.'
        elif not grade:
            result, reason = 'not_eligible', 'No completed grade is recorded for this attempt.'
        elif row.get('requires_review'):
            reason = row.get('source_note') or 'The extracted record needs adviser verification.'
        elif exact:
            if grade not in passed:
                reason = 'Grade is not a recognized passing grade in this campus configuration.'
            elif row.get('units_kind') != 'not_shown' and row.get('units') is not None and Decimal(str(row['units'])) != course.units:
                reason = 'Course matches but units differ; adviser review required.'
            elif course.pk in duplicates:
                reason = 'Repeated subject; cannot count the same BSCA requirement twice.'
            else:
                result, reason = 'proposed_credit', 'Exact course number and title; recognized passing grade within MSU.'
                if row.get('units') is None:
                    reason += ' Units are not shown in this export and need staff verification.'
                proposed.add(course.pk)
                duplicates.add(course.pk)
        results.append({**row, 'course_id': course.pk if exact else None,
                        'course_snapshot': {'code': course.code, 'title': course.title, 'units': str(course.units), 'is_elective': course.is_elective} if exact else {},
                        'result': result, 'reason': reason})
    return {'curriculum': curriculum.name, 'rows': results,
            'requirements': [{'id': c.pk, 'code': c.code, 'title': c.title, 'units': str(c.units), 'year': c.year, 'semester': c.semester} for c in courses if not c.is_elective],
            'remaining': [{'code': c.code, 'title': c.title, 'units': str(c.units), 'year': c.year, 'semester': c.semester} for c in courses if c.pk not in proposed and not c.is_elective],
            'elective_note': 'Four technical elective slots require adviser allocation; suggested elective courses are not all required.'}


@transaction.atomic
def transition(reference, user, action):
    req = EvaluationRequest.objects.defer('document').select_for_update().get(reference=reference)
    if action == 'endorse':
        if not user.has_perm('academics.review_evaluation'):
            raise PermissionDenied
        if not user.is_superuser and req.assigned_adviser_id != user.pk:
            raise ValidationError('Only the assigned adviser can endorse this request.')
        if req.status != 'adviser' or not req.records_verified:
            raise ValidationError('Verify the submitted records during adviser review before endorsement.')
        subjects = list(req.subjects.all())
        if not subjects or any(not x.decision for x in subjects):
            raise ValidationError('Record a credit / do not credit decision for every submitted subject.')
        for subject in subjects:
            if subject.course and subject.course.curriculum_id != req.curriculum_id:
                raise ValidationError('Subject mappings must use the request’s BSCA curriculum.')
            changed = (subject.decision == 'credit' and subject.automatic_result != 'proposed_credit') or (subject.decision == 'no_credit' and subject.automatic_result == 'proposed_credit')
            if changed and not subject.review_note.strip():
                raise ValidationError('Explain manual credits and changes to proposed credits in the subject review note.')
            if subject.course:
                subject.course_snapshot = {'code': subject.course.code, 'title': subject.course.title, 'units': str(subject.course.units), 'is_elective': subject.course.is_elective}
                subject.save(update_fields=['course_snapshot'])
        credited = [x.course_id for x in subjects if x.decision == 'credit']
        if None in credited or len(credited) != len(set(credited)):
            raise ValidationError('Credited subjects need a BSCA course mapping and must not duplicate a requirement.')
        req.status = 'chairperson'
        req.adviser_approved_by = user
        req.adviser_approved_at = timezone.now()
    elif action in ('accept', 'decline'):
        if not user.has_perm('academics.decide_evaluation'):
            raise PermissionDenied
        if req.status != 'chairperson' or not req.adviser_approved_at:
            raise ValidationError('The adviser must endorse this request before a final decision.')
        if not req.student_feedback.strip():
            raise ValidationError('Enter student feedback and next steps before releasing a decision.')
        if action == 'accept':
            if not req.capacity_id:
                raise ValidationError('Select the year-level capacity record before acceptance.')
            capacity = EvaluationCapacity.objects.select_for_update().get(pk=req.capacity_id)
            if capacity.term != req.intended_term:
                raise ValidationError('The capacity term must match the requested entry term.')
            if capacity.available <= 0 and not req.capacity_override_reason.strip():
                raise ValidationError('No remaining slots. Record the chairperson’s capacity exception reason to proceed.')
        req.status = 'accepted' if action == 'accept' else 'not_accepted'
        req.decided_by = user
        req.decided_at = timezone.now()
    else:
        raise ValidationError('Unknown action.')
    req.save()
    return req
