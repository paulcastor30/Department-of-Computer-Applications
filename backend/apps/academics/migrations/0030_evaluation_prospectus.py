import json
from pathlib import Path
from django.db import migrations


def seed(apps, schema_editor):
    Program = apps.get_model('academics', 'Program')
    Program.objects.filter(code='BSCA', transfer_evaluation_instructions='Prospective shiftees and transferees interested in BSCA should email their Evaluation of Grades for departmental evaluation.\nUse the subject “BSCA Shifting/Transfer Evaluation – Full Name”. Include your full name, current school and program, and intended semester of entry. Attach a clear, readable copy of your Evaluation of Grades.\nThe department will review your submission and provide guidance on the next steps. Submission does not guarantee admission to BSCA.').update(transfer_evaluation_instructions='Prospective shiftees and transferees interested in BSCA can submit their Evaluation of Grades or Transcript of Records through the online evaluation portal.\nUpload a clear, readable PDF, check the course entries, and generate a draft comparison against the applicable BSCA prospectus. Within the MSU system, exact course matches with recognized passing grades are proposed for credit, subject to review.\nThe year-level adviser evaluates the records, then the department chairperson reviews the recommendation and available slots. Save your reference and private access key to check the final feedback. Submission does not guarantee admission to BSCA.')
    Campus = apps.get_model('academics', 'EvaluationCampus')
    Campus.objects.get_or_create(name='MSU-IIT', defaults={
        'passing_grades': ['1.00', '1.25', '1.50', '1.75', '2.00', '2.25', '2.50', '2.75', '3.00'],
        'nonpassing_grades': ['4.00', '5.00', 'INC', 'IP', 'R', 'DR', 'DRP', 'WDRW'],
        'policy_reference': 'MSU-IIT Faculty Handbook, C. Class Management / Grading System (Art. 363): https://www.msuiit.edu.ph/about/facts/downloads/policy-documents/msuiit-faculty-handbook.pdf',
    })
    Curriculum = apps.get_model('academics', 'EvaluationCurriculum')
    Course = apps.get_model('academics', 'EvaluationCourse')
    curriculum, _ = Curriculum.objects.get_or_create(name='BSCA — BOR Resolution No. 129, Series of 2018', defaults={'source': 'Department-supplied bsca-prospectus.pdf, pages 1–5'})
    rows = json.loads((Path(__file__).resolve().parent.parent / 'data' / 'bsca-courses-2018.json').read_text())
    for row in rows:
        Course.objects.get_or_create(curriculum=curriculum, code=row['code'], defaults={k: v for k, v in row.items() if k != 'code'})


class Migration(migrations.Migration):
    dependencies = [('academics', '0029_evaluationcampus_evaluationcurriculum_and_more')]
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
