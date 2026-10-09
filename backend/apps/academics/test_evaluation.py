import hashlib
import io
import json
from unittest.mock import patch
from django.contrib.auth.models import User, Permission
from django.core.cache import cache
from django.core.exceptions import ValidationError, PermissionDenied
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from reportlab.pdfgen.canvas import Canvas
from rest_framework.test import APIClient
from .evaluation_models import EvaluationCurriculum, EvaluationCampus, EvaluationCourse, EvaluationRequest, EvaluationCapacity
from .evaluation_service import compare, transition


class EvaluationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.curriculum = EvaluationCurriculum.objects.create(name='Test curriculum', source='Test source')
        self.course = EvaluationCourse.objects.create(curriculum=self.curriculum, code='CCC101', title='Computer Programming 1', units=3, year=1, semester=1)
        EvaluationCourse.objects.create(curriculum=self.curriculum, code='CCC102', title='Computer Programming 2', units=3, year=1, semester=2)
        self.campus = EvaluationCampus.objects.create(name='Test MSU campus', passing_grades=['1.0', '2.75', '3.0'], nonpassing_grades=['5.0', 'INC', 'DR'], policy_reference='Verified test legend')
        self.row = {'record_id': 0, 'code': 'CCC101', 'title': 'Computer Programming 1', 'units': '3', 'grade': '3.00'}
        self.adviser = User.objects.create_user('adviser', is_staff=True)
        self.chair = User.objects.create_user('chair', is_staff=True)
        self.adviser.user_permissions.add(Permission.objects.get(codename='review_evaluation'))
        self.chair.user_permissions.add(Permission.objects.get(codename='decide_evaluation'))
        self.capacity = EvaluationCapacity.objects.create(term='Test term', year=1, capacity=80, occupied=79)

    def payload(self, **kwargs):
        return dict(curriculum_id=self.curriculum.pk, campus_id=self.campus.pk, within_msu=True, rows=[self.row], **kwargs)

    def pdf(self):
        from .test_evaluation_extraction import department_pdf
        return SimpleUploadedFile('grades.pdf', department_pdf([dict(code='CCC101', title='Computer Programming 1', final='3.00', units='3')]), content_type='application/pdf')

    def submit(self):
        response = self.client.post('/api/academics/evaluations/submit/', {'payload': json.dumps(self.payload(full_name='Test Student', email='student@example.invalid', applicant_type='shiftee', school='Test MSU campus', current_program='Test program', intended_term='Test term', confirmed=True)), 'document': self.pdf()}, format='multipart')
        self.assertEqual(response.status_code, 201, response.data)
        return response.data

    def request(self):
        receipt = self.submit()
        req = EvaluationRequest.objects.get(reference=receipt['reference'])
        req.assigned_adviser = self.adviser
        req.records_verified = True
        req.capacity = self.capacity
        req.student_feedback = 'Review completed. Follow department enrollment instructions.'
        req.save()
        req.subjects.update(decision='credit')
        return req, receipt

    def test_exact_match_passing_normalization_and_remaining(self):
        row = {**self.row, 'code': 'ccc 101', 'title': 'computer programming 1.'}
        result = compare(self.curriculum, [row], self.campus, True)
        self.assertEqual(result['rows'][0]['result'], 'proposed_credit')
        self.assertEqual([x['code'] for x in result['remaining']], ['CCC102'])
        for grade in ['1.00', '2.750', '3']:
            self.assertEqual(compare(self.curriculum, [{**row, 'grade': grade}], self.campus, True)['rows'][0]['result'], 'proposed_credit')

    def test_nonpassing_unknown_units_title_and_external(self):
        for grade in ['5', 'INC', 'DR']:
            self.assertEqual(compare(self.curriculum, [{**self.row, 'grade': grade}], self.campus, True)['rows'][0]['result'], 'not_eligible')
        for row in [{**self.row, 'grade': 'P'}, {**self.row, 'units': '2'}, {**self.row, 'title': 'Computer Programming 2'}, {**self.row, 'code': 'CCC102'}]:
            self.assertEqual(compare(self.curriculum, [row], self.campus, True)['rows'][0]['result'], 'manual_review')
        self.assertEqual(compare(self.curriculum, [self.row], self.campus, False)['rows'][0]['result'], 'manual_review')
        self.assertEqual(compare(self.curriculum, [self.row], None, True)['rows'][0]['result'], 'manual_review')

    def test_duplicates_and_retakes(self):
        self.assertEqual([x['result'] for x in compare(self.curriculum, [self.row, self.row], self.campus, True)['rows']], ['proposed_credit', 'manual_review'])
        self.assertEqual([x['result'] for x in compare(self.curriculum, [{**self.row, 'grade': '5.0'}, self.row], self.campus, True)['rows']], ['not_eligible', 'proposed_credit'])

    def test_private_storage_hash_and_status_access(self):
        req, receipt = self.request()
        self.assertTrue(bytes(req.document).startswith(b'%PDF'))
        self.assertEqual(req.access_digest, hashlib.sha256(receipt['access_key'].encode()).hexdigest())
        self.assertEqual(req.subjects.get().automatic_result, 'proposed_credit')
        self.assertEqual(req.subjects.get().decision, 'credit')
        self.assertEqual(self.client.get(f'/admin/academics/evaluationrequest/{req.pk}/document/').status_code, 302)
        for reference in [str(req.reference), 'not-a-uuid', []]:
            self.assertEqual(self.client.post('/api/academics/evaluations/status/', {'reference': reference, 'access_key': 'wrong'}, format='json').status_code, 404)
        response = self.client.post('/api/academics/evaluations/status/', {'reference': receipt['reference'], 'access_key': receipt['access_key']}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['feedback'], '')
        self.assertEqual(response.data['subjects'], [])
        self.assertEqual(response['Cache-Control'], 'no-store, private')
        self.assertNotIn('access_digest', response.data)
        self.assertNotIn('document', response.data)

    def test_review_chain_permissions_capacity_and_final_feedback(self):
        req, receipt = self.request()
        with self.assertRaises(ValidationError): transition(req.reference, self.chair, 'accept')
        with self.assertRaises(PermissionDenied): transition(req.reference, self.chair, 'endorse')
        transition(req.reference, self.adviser, 'endorse')
        with self.assertRaises(PermissionDenied): transition(req.reference, self.adviser, 'accept')
        self.assertEqual(transition(req.reference, self.chair, 'accept').status, 'accepted')
        self.assertEqual(self.capacity.available, 0)
        response = self.client.post('/api/academics/evaluations/status/', {'reference': receipt['reference'], 'access_key': receipt['access_key']}, format='json')
        self.assertEqual(response.data['feedback'], req.student_feedback)
        self.assertEqual(response.data['subjects'][0]['decision'], 'Credit')
        self.assertEqual([x['code'] for x in response.data['remaining']], ['CCC102'])
        with self.assertRaises(ValidationError): transition(req.reference, self.chair, 'decline')
        second, _ = self.request()
        transition(second.reference, self.adviser, 'endorse')
        with self.assertRaises(ValidationError): transition(second.reference, self.chair, 'accept')
        second.refresh_from_db()
        second.capacity_override_reason = 'Chairperson approved an additional place.'
        second.save()
        self.assertEqual(transition(second.reference, self.chair, 'accept').status, 'accepted')

    def test_assignment_verification_and_manual_reason_gates(self):
        req, _ = self.request()
        req.records_verified = False
        req.save()
        with self.assertRaises(ValidationError): transition(req.reference, self.adviser, 'endorse')
        req.records_verified = True
        req.assigned_adviser = self.chair
        req.save()
        with self.assertRaises(ValidationError): transition(req.reference, self.adviser, 'endorse')
        req.assigned_adviser = self.adviser
        req.save()
        req.subjects.update(decision='')
        with self.assertRaises(ValidationError): transition(req.reference, self.adviser, 'endorse')
        req.subjects.update(decision='credit', automatic_result='manual_review')
        with self.assertRaises(ValidationError): transition(req.reference, self.adviser, 'endorse')
        req.subjects.update(review_note='Verified against original; corrected reading.')
        self.assertEqual(transition(req.reference, self.adviser, 'endorse').status, 'chairperson')

    def test_api_validation_document_validation_and_extraction(self):
        for rows in [[], [self.row] * 401, [{**self.row, 'units': '-1'}]]:
            self.assertEqual(self.client.post('/api/academics/evaluations/compare/', {**self.payload(), 'rows': rows}, format='json').status_code, 400)
        for content in [b'not a pdf', b'%PDF-invalid']:
            self.assertEqual(self.client.post('/api/academics/evaluations/extract/', {'document': SimpleUploadedFile('record.pdf', content)}, format='multipart').status_code, 400)
        response = self.client.post('/api/academics/evaluations/extract/', {'document': self.pdf(), 'curriculum_id': self.curriculum.pk}, format='multipart')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data['extraction']['rows'][0]['grade'], '3.00')
        self.assertEqual(response.data['draft']['rows'][0]['code'], 'CCC101')
        self.campus.nonpassing_grades = ['3.00']
        with self.assertRaises(ValidationError): self.campus.full_clean()

    def test_admin_roles_document_download_and_final_readonly(self):
        from django.core.management import call_command
        from django.contrib.auth.models import Group
        from django.contrib import admin
        from django.test import RequestFactory
        from .evaluation_admin import RequestAdmin
        call_command('configure_evaluation_roles', stdout=io.StringIO())
        self.adviser.groups.add(Group.objects.get(name='BSCA Evaluation Advisers'))
        self.chair.groups.add(Group.objects.get(name='BSCA Evaluation Chairpersons'))
        req, _ = self.request()
        self.client.force_login(self.adviser)
        self.assertEqual(self.client.get(f'/admin/academics/evaluationrequest/{req.pk}/change/').status_code, 200)
        self.assertEqual(self.client.get(f'/admin/academics/evaluationrequest/{req.pk}/document/').status_code, 200)
        transition(req.reference, self.adviser, 'endorse')
        self.client.force_login(self.chair)
        self.assertEqual(self.client.get(f'/admin/academics/evaluationrequest/{req.pk}/change/').status_code, 200)
        transition(req.reference, self.chair, 'accept')
        request = RequestFactory().get('/')
        request.user = self.chair
        req.refresh_from_db()
        readonly = RequestAdmin(EvaluationRequest, admin.site).get_readonly_fields(request, req)
        self.assertIn('student_feedback', readonly)
        self.assertIn('records_verified', readonly)

    def test_submission_rejects_missing_attempts_and_preserves_corrections(self):
        payload = self.payload(full_name='Test Student', email='test@example.invalid', applicant_type='shiftee', school='MSU-IIT', current_program='Test program', intended_term='Test term', confirmed=True)
        payload['rows'][0] = {**self.row, 'record_id': 9}
        response = self.client.post('/api/academics/evaluations/submit/', {'payload': json.dumps(payload), 'document': self.pdf()}, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(EvaluationRequest.objects.count(), 0)
        payload['rows'][0] = {**self.row, 'grade': '2.75'}
        response = self.client.post('/api/academics/evaluations/submit/', {'payload': json.dumps(payload), 'document': self.pdf()}, format='multipart')
        self.assertEqual(response.status_code, 201, response.data)
        req = EvaluationRequest.objects.get(reference=response.data['reference'])
        subject = req.subjects.get()
        self.assertEqual(subject.automatic_result, 'manual_review')
        self.assertEqual(subject.grade, '2.75')
        self.assertEqual(subject.source_record['original_grade'], '3.00')
        self.assertEqual(req.draft['extraction']['rows'][0]['grade'], '3.00')

    def test_blank_grades_no_units_and_completion_reviews(self):
        row = {**self.row, 'units': None, 'units_kind': 'not_shown'}
        result = compare(self.curriculum, [row], self.campus, True)
        self.assertEqual(result['rows'][0]['result'], 'proposed_credit')
        self.assertIsNone(result['rows'][0]['units'])
        self.assertEqual(compare(self.curriculum, [{**row, 'grade': ''}], self.campus, True)['rows'][0]['result'], 'not_eligible')
        self.assertEqual(compare(self.curriculum, [{**row, 'requires_review': True, 'source_note': 'Completion verification required.'}], self.campus, True)['rows'][0]['result'], 'manual_review')
