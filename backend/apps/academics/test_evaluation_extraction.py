"""Synthetic anonymous records: no real student files are checked into the repo."""
import io
from django.test import SimpleTestCase
from reportlab.pdfgen.canvas import Canvas
from .evaluation_extraction import extract_record


def department_pdf(rows, page_number=1, pages=1):
    out = io.BytesIO()
    c = Canvas(out, pagesize=(612, 792))
    for page in range(pages):
        c.setFont('Courier', 10)
        c.drawString(36, 765, 'STUDENT EVALUATION')
        c.drawString(36, 745, 'Name of Student :')
        c.drawString(168, 745, 'TEST STUDENT')
        for x, text in [(36, 'COURSE NO.'), (108, 'DESCRIPTIVE TITLE OF THE COURSE'), (342, 'LECT.'), (386, 'LAB.'), (426, 'FINAL'), (475, 'COMP.'), (531, 'CREDIT')]:
            c.drawString(x, 720, text)
        c.drawString(36, 690, 'First Semester 2026-2027')
        c.drawString(275, 690, 'BSCA')
        for n, row in enumerate(rows):
            y = 650-n*45
            c.drawString(36, y, row['code'])
            for k, line in enumerate(row['title'].split('\n')):
                c.drawString(108, y-k*12, line)
            c.drawString(365, y, '2'); c.drawString(402, y, '3')
            c.drawString(426, y, row.get('final', ''))
            c.drawString(474, y, row.get('completion', ''))
            c.drawString(534, y, row.get('units', '3'))
        c.drawString(150, 100, 'Cumulative GPA:')
        c.drawString(36, 35, f'Page No. :  {page_number+page}')
        c.showPage()
    c.save()
    return out.getvalue()


def myiit_pdf(rows):
    out = io.BytesIO()
    c = Canvas(out, pagesize=(595, 842))
    c.drawString(36, 815, 'My.IIT | Student - Evaluation of Grades')
    c.drawString(36, 790, 'Name:')
    c.drawString(100, 790, 'TEST STUDENT')
    c.drawString(36, 770, 'Last Course Taken: BSCA')
    for x, text in [(36,'SubjCode'),(120,'Description'),(475,'Grade')]:
        c.drawString(x, 730, text)
    c.drawString(36, 700, 'SY: 2026-2027 SEM: 1')
    for n, row in enumerate(rows):
        y=670-n*45
        c.drawString(36,y,row['code']);c.drawString(120,y,row['title']);c.drawString(475,y,row['grade'])
    c.drawString(36,500,'GPA')
    c.drawString(550,17,'1');c.drawString(560,17,'/');c.drawString(570,17,'2')
    c.showPage()
    c.drawString(36,810,'Grade Distribution')
    c.drawString(550,17,'2');c.drawString(560,17,'/');c.drawString(570,17,'2')
    c.save()
    return out.getvalue()


class ExtractionTests(SimpleTestCase):
    def test_report_columns_wrapped_titles_blanks_completion_and_retakes(self):
        rows = [
            dict(code='CCC101',title='Computer Programming 1',final='5.00',units='0'),
            dict(code='CCC101',title='Computer Programming 1',final='3.00'),
            dict(code='BCA111',title='Fundamentals of Computer\nApplications 1',final='INC',completion='2.50'),
            dict(code='COMP SCI 1N',title='Introduction to Computer',final=''),
        ]
        result=extract_record(department_pdf(rows))
        self.assertTrue(result['complete'],result['issues'])
        self.assertEqual(len(result['rows']),4)
        self.assertEqual([r['original_grade'] for r in result['rows']],['5.00','3.00','INC',''])
        self.assertEqual([r['units'] for r in result['rows']],['0','3','3','3'])
        self.assertEqual(result['rows'][2]['title'],'Fundamentals of Computer Applications 1')
        self.assertEqual(result['rows'][2]['completion_grade'],'2.50')
        self.assertTrue(result['rows'][2]['requires_review'])
        self.assertEqual(result['metadata']['full_name'],'TEST STUDENT')
        self.assertEqual(result['metadata']['current_program'],'BSCA')

    def test_myiit_grade_completion_no_units_and_graph_page(self):
        result=extract_record(myiit_pdf([dict(code='CHEM 12.1ST',title='Chemistry Laboratory',grade='INC [ 1.25 ]'),dict(code='ICT 399',title='Thesis',grade='IN PROG'),dict(code='ECT 197',title='Training',grade='')]))
        self.assertTrue(result['complete'],result['issues'])
        self.assertEqual(len(result['rows']),3)
        self.assertEqual(result['rows'][0]['original_grade'],'INC')
        self.assertEqual(result['rows'][0]['completion_grade'],'1.25')
        self.assertEqual(result['rows'][1]['grade'],'IN PROG')
        self.assertEqual(result['rows'][2]['grade'],'')
        self.assertIsNone(result['rows'][0]['units'])
        self.assertEqual(result['page_checks'][1]['kind'],'charts')

    def test_missing_page_unknown_format_and_unknown_grade(self):
        result=extract_record(department_pdf([dict(code='CCC101',title='Programming',final='2.5')],page_number=2))
        self.assertFalse(result['complete'])
        out=io.BytesIO();c=Canvas(out);c.drawString(30,700,'Not an evaluation');c.save()
        self.assertFalse(extract_record(out.getvalue())['supported'])
        result=extract_record(department_pdf([dict(code='CCC101',title='Programming',final='??')]))
        self.assertTrue(result['complete'])
        self.assertTrue(result['rows'][0]['requires_review'])
        self.assertEqual(result['rows'][0]['grade'],'??')

    def test_page_sequence_and_all_attempts(self):
        result=extract_record(department_pdf([dict(code='CCC101',title='Programming',final='3.00')],pages=2))
        self.assertTrue(result['complete'])
        self.assertEqual([r['source_page'] for r in result['rows']],[1,2])
        self.assertEqual([r['record_id'] for r in result['rows']],[0,1])
