from django.db import migrations, models

RESOURCE_URL = "https://sites.google.com/g.msuiit.edu.ph/ccsg/resources"
CONTACT_URL = "https://sites.google.com/g.msuiit.edu.ph/ccsg/contact"
CONTACT = "CCS Graduate Program Coordinator\nOffice of the Dean, College of Computer Studies, MSU-IIT\nccs.gs@g.msuiit.edu.ph"


def add_graduate_references(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    Document = apps.get_model("academics", "ProgramDocument")
    alias = schema_editor.connection.alias
    for program in Program.objects.using(alias).filter(code="MSCA"):
        for title, kind, url, note, order in (
            ("CCS graduate thesis guide and forms", "HANDBOOK", RESOURCE_URL,
             "College resources for the Graduate Framework, Thesis Guide and graduate forms. Follow college guidance for the applicable procedure and form version.", 30),
            ("CCS graduate coordinator and contact details", "CONTACT", CONTACT_URL,
             "Graduate enquiries: ccs.gs@g.msuiit.edu.ph. Office of the Dean, College of Computer Studies, MSU-IIT.", 31),
        ):
            Document.objects.using(alias).get_or_create(program_id=program.pk, url=url,
                defaults={"title": title, "document_type": kind, "note": note,
                          "sort_order": order, "is_public": True})
        current = (program.contact_information or "").strip().rstrip(".").casefold()
        if current in ("", "to be provided by the department", "to be validated by the department"):
            Program.objects.using(alias).filter(pk=program.pk).update(contact_information=CONTACT)


class Migration(migrations.Migration):
    dependencies = [("academics", "0020_program_forms")]
    operations = [
        migrations.AlterField(model_name="programdocument", name="document_type",
            field=models.CharField(choices=[("CURRICULUM", "Curriculum"), ("ADMISSION", "Admission guide"),
                ("BROCHURE", "Program brochure"), ("HANDBOOK", "Student handbook or advising guide"),
                ("CONTACT", "Program contact"), ("OTHER", "Other")], default="OTHER", max_length=30)),
        migrations.RunPython(add_graduate_references, migrations.RunPython.noop),
    ]
