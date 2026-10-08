from django.db import migrations

URL = "https://msuiit-comapps.vercel.app/thesis-forms/bsca/FM-MSU-IIT-ACAD-027%20Nomination%20of%20Written%20Exam.docx"
NOTE = "Additional owner-supplied template. This Form 027 refers to graduate studies; confirm applicability with the department before use."


def add_supplied_form(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    Document = apps.get_model("academics", "ProgramDocument")
    alias = schema_editor.connection.alias
    program = Program.objects.using(alias).filter(code="BSCA").first()
    if program:
        Document.objects.using(alias).get_or_create(program=program, url=URL, defaults={
            "title": "FM-MSU-IIT-ACAD-027 — Nomination of members of written examination committee",
            "document_type": "OTHER", "form_group": "EXAMINATION", "is_public": True,
            "sort_order": 111, "note": NOTE,
        })


class Migration(migrations.Migration):
    dependencies = [("academics", "0025_program_transfer_evaluation")]
    operations = [migrations.RunPython(add_supplied_form, migrations.RunPython.noop)]
