from django.db import migrations

FORMS = [('001', 'Application for advance credit', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-001%20Application%20for%20Advance%20Credit.docx'), ('002', 'Application for leave of absence', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-002%20Application%20for%20Leave%20of%20Absence.docx'), ('003', 'Request form', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-003%20Request%20Form.docx'), ('004', 'OTR and F137-A request form', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-004%20OTR%20and%20F137A%20Request%20Form.docx'), ('005', 'Returnee’s application form', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-005%20Returnees%20Application%20Form.docx'), ('006', 'Shifter’s application form', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-006%20Shifters%20Application%20Form.docx'), ('007', 'Promissory note', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-007%20Promissory%20Note.docx'), ('008', 'Academic load revision permit', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-008%20Academic%20Load%20Revision%20Permit.docx'), ('009', 'Permit to cross-enroll', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-009%20Permit%20to%20Cross%20Enroll.docx'), ('010', 'Request for validation of prerequisite courses', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-010%20Request%20for%20Validation.docx'), ('011', 'Removal examination / grade completion form', 'https://msuiit-comapps.vercel.app/registar-forms/FM-MSU-IIT-RGTR-011-Completion-Form.doc')]


def seed(apps, schema_editor):
    Form = apps.get_model("academics", "RegistrarForm")
    for order, (form_id, title, url) in enumerate(FORMS):
        Form.objects.get_or_create(form_id=form_id, defaults={"title": title, "url": url, "is_public": True, "sort_order": order})


class Migration(migrations.Migration):
    dependencies = [("academics", "0027_registrarform")]
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
