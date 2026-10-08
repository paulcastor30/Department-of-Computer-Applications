from django.db import migrations, models


EMAIL = "ccs.ca@g.msuiit.edu.ph"
INSTRUCTIONS = 'Prospective shiftees and transferees interested in BSCA should email their Evaluation of Grades for departmental evaluation.\nUse the subject “BSCA Shifting/Transfer Evaluation – Full Name”. Include your full name, current school and program, and intended semester of entry. Attach a clear, readable copy of your Evaluation of Grades.\nThe department will review your submission and provide guidance on the next steps. Submission does not guarantee admission to BSCA.'


def add_transfer_evaluation(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    Program.objects.using(schema_editor.connection.alias).filter(code="BSCA").update(
        transfer_evaluation_email=EMAIL,
        transfer_evaluation_instructions=INSTRUCTIONS,
    )


class Migration(migrations.Migration):
    dependencies = [("academics", "0024_bsca_aaccup_recognition")]
    operations = [
        migrations.AddField(
            model_name="program", name="transfer_evaluation_email",
            field=models.EmailField(blank=True, max_length=254, help_text="Mailbox for shifting and transfer grade evaluation submissions."),
        ),
        migrations.AddField(
            model_name="program", name="transfer_evaluation_instructions",
            field=models.TextField(blank=True, help_text="One paragraph per line for prospective shiftees and transferees."),
        ),
        migrations.RunPython(add_transfer_evaluation, migrations.RunPython.noop),
    ]
