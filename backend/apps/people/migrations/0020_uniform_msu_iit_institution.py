from django.db import migrations


MSU_IIT_NAME = "Mindanao State University - Iligan Institute of Technology"


def normalize_education_institution(value):
    """Normalize only known names for MSU-IIT, never other MSU campuses."""
    key = " ".join(value.replace("–", "-").replace("—", "-").split()).casefold()
    if key.endswith(", philippines"):
        key = key[:-len(", philippines")]
    key = key.replace(" - ", "-").replace("- ", "-").replace(" -", "-")
    if key in {
        "msu-iligan institute of technology",
        "mindanao state university-iligan institute of technology",
        "msu-iit",
    }:
        return MSU_IIT_NAME
    return value


def normalize_institutions(apps, schema_editor):
    education = apps.get_model("people", "FacultyEducation")
    rows = education.objects.using(schema_editor.connection.alias)
    for record in rows.only("pk", "institution").iterator():
        canonical = normalize_education_institution(record.institution)
        if canonical != record.institution:
            rows.filter(pk=record.pk).update(institution=canonical)


class Migration(migrations.Migration):
    dependencies = [("people", "0019_public_academic_content_corrections")]
    operations = [migrations.RunPython(normalize_institutions, migrations.RunPython.noop)]
