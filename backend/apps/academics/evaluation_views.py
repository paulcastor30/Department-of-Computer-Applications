import hashlib
import io
import json
import secrets
from pathlib import Path
from decimal import Decimal
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from pypdf import PdfReader
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from .evaluation_models import EvaluationCurriculum, EvaluationCampus, EvaluationRequest, EvaluationSubject
from .evaluation_service import compare
from .evaluation_extraction import extract_record


class EvaluationThrottle(AnonRateThrottle):
    rate = '600/hour'
    scope = 'evaluation'


class SubjectInput(serializers.Serializer):
    code = serializers.CharField(max_length=30)
    title = serializers.CharField(max_length=200, allow_blank=True)
    units = serializers.DecimalField(max_digits=4, decimal_places=1, min_value=0, max_value=30, required=False, allow_null=True)
    grade = serializers.CharField(max_length=30, allow_blank=True)
    record_id = serializers.IntegerField(required=False, min_value=0)


class ComparisonInput(serializers.Serializer):
    curriculum_id = serializers.PrimaryKeyRelatedField(queryset=EvaluationCurriculum.objects.filter(is_active=True), source='curriculum')
    campus_id = serializers.PrimaryKeyRelatedField(queryset=EvaluationCampus.objects.filter(is_active=True), source='campus', required=False, allow_null=True)
    within_msu = serializers.BooleanField()
    rows = SubjectInput(many=True, allow_empty=False)

    def validate_rows(self, rows):
        if len(rows) > 400:
            raise serializers.ValidationError('A maximum of 400 subjects can be evaluated at once.')
        return rows


class SubmissionInput(ComparisonInput):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    applicant_type = serializers.ChoiceField(choices=['shiftee', 'transferee'])
    school = serializers.CharField(max_length=150)
    current_program = serializers.CharField(max_length=150)
    intended_term = serializers.CharField(max_length=100)
    confirmed = serializers.BooleanField()

    def validate_confirmed(self, value):
        if not value:
            raise serializers.ValidationError('Confirm that entries have been checked against the uploaded record.')
        return value


def read_document(upload):
    if not upload or upload.size > 5 * 1024 * 1024 or not upload.size:
        raise ValidationError({'detail': 'Upload a nonempty PDF of up to 5 MB.'})
    data = upload.read()
    if not data.startswith(b'%PDF-'):
        raise ValidationError({'detail': 'Only PDF documents are accepted.'})
    try:
        reader = PdfReader(io.BytesIO(data))
        if reader.is_encrypted or len(reader.pages) > 25:
            raise ValueError('Encrypted or too many pages')
        text = ''
    except Exception as exc:
        raise ValidationError({'detail': 'Use a readable, unencrypted PDF with no more than 25 pages.'}) from exc
    return data, text[:60000]


class PrivateEvaluationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [EvaluationThrottle]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response['Cache-Control'] = 'no-store, private'
        response['X-Robots-Tag'] = 'noindex, nofollow'
        return response


class EvaluationConfigurationView(PrivateEvaluationView):
    def get(self, request):
        return Response({
            'curricula': [{'id': c.pk, 'name': c.name, 'source': c.source, 'courses': list(c.courses.values('code', 'title', 'units', 'year', 'semester', 'is_elective'))} for c in EvaluationCurriculum.objects.filter(is_active=True)],
            'campuses': list(EvaluationCampus.objects.filter(is_active=True).values('id', 'name')),
        })


def parsed_record(document):
    try:
        result = extract_record(document)
    except Exception as exc:
        raise ValidationError({'detail': 'The PDF could not be read. Download the original evaluation again or contact the department.'}) from exc
    if not result['supported'] or not result['complete']:
        raise ValidationError({'detail': 'This record could not be fully read. Upload the complete original PDF or contact the department.', 'issues': result['issues']})
    return result


def reconcile_rows(rows, extraction):
    original = extraction['rows']
    if len(rows) != len(original) or {r.get('record_id') for r in rows} != set(range(len(original))):
        raise ValidationError({'detail': 'Every subject attempt from the uploaded record must be included exactly once. Read the PDF again.'})
    by_id = {r['record_id']: r for r in rows}
    reconciled = []
    for source in original:
        supplied = by_id[source['record_id']]
        row = {**source}
        changed = []
        for field in ('code', 'title', 'grade', 'units'):
            value = supplied.get(field)
            before = source.get(field)
            equivalent = str(value or '').strip() == str(before or '').strip()
            if field == 'units' and value is not None and before is not None:
                equivalent = value == Decimal(str(before))
            if not equivalent:
                changed.append(field)
                row[field] = value
        if changed:
            row['requires_review'] = True
            row['source_note'] = 'Student corrected: ' + ', '.join(changed) + '. Adviser must verify against the PDF.'
        row['source_record'] = source
        reconciled.append(row)
    return reconciled


class EvaluationExtractView(PrivateEvaluationView):
    def post(self, request):
        document, _ = read_document(request.FILES.get('document'))
        extraction = parsed_record(document)
        curriculum = EvaluationCurriculum.objects.filter(is_active=True, pk=request.data.get('curriculum_id')).first()
        if not curriculum:
            raise ValidationError({'detail': 'Select an active BSCA prospectus.'})
        campus = EvaluationCampus.objects.filter(is_active=True, name='MSU-IIT').first()
        rows = extraction['rows']
        if request.data.get('rows'):
            try:
                payload = json.loads(request.data['rows'])
            except (ValueError, TypeError):
                raise ValidationError({'detail': 'Corrections are invalid.'})
            serializer = SubjectInput(data=payload, many=True)
            serializer.is_valid(raise_exception=True)
            rows = reconcile_rows(serializer.validated_data, extraction)
        draft = compare(curriculum, rows, campus, True)
        return Response({'extraction': extraction, 'draft': draft, 'campus_id': campus.pk if campus else None})


class EvaluationCompareView(PrivateEvaluationView):
    def post(self, request):
        serializer = ComparisonInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        return Response(compare(data['curriculum'], data['rows'], data.get('campus'), data['within_msu']))


class SubmissionThrottle(EvaluationThrottle):
    rate = '120/hour'
    scope = 'evaluation_submission'


class EvaluationSubmitView(PrivateEvaluationView):
    throttle_classes = [SubmissionThrottle]
    def post(self, request):
        try:
            payload = json.loads(request.data.get('payload', ''))
        except (ValueError, TypeError):
            raise ValidationError({'detail': 'Submission details are invalid.'})
        serializer = SubmissionInput(data=payload)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        document, _ = read_document(request.FILES.get('document'))
        extraction = parsed_record(document)
        rows = reconcile_rows(data.pop('rows'), extraction)
        data.pop('confirmed')
        data.setdefault('campus', None)
        # JSON snapshots preserve the curriculum/rules used on the day of submission.
        draft = json.loads(json.dumps(compare(data['curriculum'], rows, data['campus'], data['within_msu']), default=str))
        draft['extraction'] = extraction
        key = secrets.token_urlsafe(32)
        with transaction.atomic():
            req = EvaluationRequest.objects.create(**data, document=document,
                document_name=Path(request.FILES['document'].name).name[:200], draft=draft,
                access_digest=hashlib.sha256(key.encode()).hexdigest())
            EvaluationSubject.objects.bulk_create([EvaluationSubject(request=req,
                code=row['code'], title=row['title'], units=row['units'], grade=row['grade'],
                course_id=row['course_id'], automatic_result=row['result'], reason=row['reason'],
                course_snapshot=row['course_snapshot'], source_record=row.get('source_record', {}), decision='credit' if row['result'] == 'proposed_credit' else '') for row in draft['rows']])
        return Response({'reference': str(req.reference), 'access_key': key, 'status': req.get_status_display(), 'draft': draft}, status=201)


class EvaluationStatusView(PrivateEvaluationView):
    def post(self, request):
        reference = request.data.get('reference')
        key = request.data.get('access_key')
        if not isinstance(key, str) or len(key) > 200:
            return Response({'detail': 'Reference or access key is incorrect.'}, status=404)
        try:
            req = EvaluationRequest.objects.defer('document').get(reference=reference)
        except (EvaluationRequest.DoesNotExist, ValueError, TypeError, DjangoValidationError):
            return Response({'detail': 'Reference or access key is incorrect.'}, status=404)
        if not secrets.compare_digest(req.access_digest, hashlib.sha256(key.encode()).hexdigest()):
            return Response({'detail': 'Reference or access key is incorrect.'}, status=404)
        final = req.status in ('accepted', 'not_accepted')
        credited = set(req.subjects.filter(decision='credit').values_list('course_id', flat=True)) if final else set()
        return Response({'reference': str(req.reference), 'status': req.get_status_display(),
            'remaining': [c for c in req.draft.get('requirements', []) if c['id'] not in credited] if final else [],
            'feedback': req.student_feedback if final else '',
            'year_level': req.capacity.year if final and req.status == 'accepted' and req.capacity else None,
            'subjects': [{'code': s.code, 'title': s.title, 'decision': s.get_decision_display(), 'bsca_course': s.course_snapshot} for s in req.subjects.all()] if final else [],
            'draft': req.draft,
        })
