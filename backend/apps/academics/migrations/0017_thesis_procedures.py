from django.db import migrations

COMMON_STEPS = ['Proposal hearing — Prepare Form 017 (Nomination of Members of Advisory Panel). Submit Form 019 (Approval for Proposal Hearing) with your manuscript to the College Dean and panel members at least one week before the presentation. Prepare three copies and attach the official receipt (OR) or scholarship approval/signature.', 'Proposal approval — Prepare Form 020 (Approval of Proposal), including both pages, with one copy for each panel member.', 'Final defense — Prepare Form 021 (Nomination of Members of Oral Exam Panel). Submit Form 022 (Approval for Final Defense) with your manuscript to the College Dean and panel members one week before the presentation. Prepare three copies and attach the official receipt or scholarship grant approval/signature. Ask the graduate coordinator for the payment slip.', 'Final-defense poster — Attach an A4 research poster summarizing the abstract, introduction, research design and methods, results and discussion, and conclusions and recommendations.', 'Final-defense timing — Conduct the final presentation at least one month before grades are automatically locked. Confirm the applicable grade-locking date with the graduate coordinator before scheduling.', 'Final-defense reports — Prepare Form 023 (Oral Exam Report on Final Defense), including both pages, with one copy per panel member, and Form 024 (Panel Oral Exam Report).', 'Bound manuscript — Print the Certificate of Panel Approval and attach the Certificate of Authentic Authorship as the last page of your manuscript. Use the ODGP Research Quick Guide for the authorship certificate format.', 'Forms and advising — Ask the graduate coordinator for current forms, the Research Quick Guide, payment instructions, adviser/panel arrangements and the applicable graduation submission checklist. This summary covers the supplied procedure; it does not replace the full guide.']
TITLES = {"BSCA": "The culminating academic requirement is the Undergraduate Thesis.", "MSCA": "The culminating academic requirement is the Master’s Thesis or Graduate Thesis."}


def add_thesis_procedures(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    for program in Program.objects.using(schema_editor.connection.alias).filter(code__in=TITLES):
        title = TITLES[program.code]
        previous = title + "\nOfficial thesis procedures, advising arrangements, and assessment documentation are To be provided by the Department."
        current = (program.thesis_information or "").strip()
        if current in ("", "To be provided by the Department.", "To be validated by the Department.", previous):
            Program.objects.using(schema_editor.connection.alias).filter(pk=program.pk).update(thesis_information="\n".join([title, *COMMON_STEPS]))


class Migration(migrations.Migration):
    dependencies = [("academics", "0016_bsca_admission_guidance")]
    operations = [migrations.RunPython(add_thesis_procedures, migrations.RunPython.noop)]
