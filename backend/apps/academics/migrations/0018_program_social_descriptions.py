from django.db import migrations

DESCRIPTIONS = {
    "BSCA": (
        "Undergraduate academic program information with official Department content to be provided.",
        "Explore BSCA at MSU-IIT: software, firmware and hardware foundations for embedded, connected and intelligent systems.",
    ),
    "MSCA": (
        "Graduate academic program information with official Department content to be provided.",
        "Explore MSCA at MSU-IIT: advanced study and research in Computer Applications, with program information and admissions guidance.",
    ),
}


def update_social_descriptions(apps, schema_editor):
    Program = apps.get_model("academics", "Program")
    for program in Program.objects.using(schema_editor.connection.alias).filter(code__in=DESCRIPTIONS):
        old, new = DESCRIPTIONS[program.code]
        current = (program.og_description or "").strip()
        if current in ("", old, "To be provided by the Department."):
            Program.objects.using(schema_editor.connection.alias).filter(pk=program.pk).update(og_description=new)


class Migration(migrations.Migration):
    dependencies = [("academics", "0017_thesis_procedures")]
    operations = [migrations.RunPython(update_social_descriptions, migrations.RunPython.noop)]
