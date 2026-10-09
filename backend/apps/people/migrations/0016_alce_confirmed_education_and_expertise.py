"""Apply only the department owner's Alce confirmations of 9 October 2026."""
from django.db import migrations


EXPERTISE = (
    "Embedded Systems",
    "Internet of Things (IoT)",
    "Machine Learning (ML)",
    "Artificial Intelligence of Things (AIoT)",
)
INSTITUTIONS = (
    "MSU - Iligan Institute of Technology",
    "MSU-Iligan Institute of Technology",
    "Mindanao State University - Iligan Institute of Technology, Philippines",
)


def apply_confirmations(apps, schema_editor):
    Faculty = apps.get_model("people", "FacultyMember")
    Education = apps.get_model("people", "FacultyEducation")
    Expertise = apps.get_model("people", "FacultyExpertise")
    alias = schema_editor.connection.alias
    candidates = list(Faculty.objects.using(alias).filter(
        email="applerose.alce@g.msuiit.edu.ph"))
    if not candidates:
        candidates = list(Faculty.objects.using(alias).filter(title="Apple Rose B. Alce"))
    if len(candidates) != 1:
        raise RuntimeError("Expected one Apple Rose B. Alce profile; review identity before applying confirmations.")
    member = candidates[0]
    records = Education.objects.using(alias).filter(faculty_id=member.pk, institution__in=INSTITUTIONS)
    records.filter(degree_level="bachelors", degree_name__in=(
        "Bachelor of Science in Electronics and Computer Technology (Major in Embedded Systems)",
        "Bachelor of Science in Electronics and Computer Technology, Major in Embedded Systems",
    )).update(year_completed=2017)
    records.filter(degree_level="masters", degree_name__in=(
        "Master of Science in Computer Applications",
        "Master of Science in Computer Applications, Philippines",
    )).update(year_completed=2020)
    Faculty.objects.using(alias).filter(pk=member.pk).update(
        specialization_areas="\n".join(EXPERTISE))
    expertise = Expertise.objects.using(alias).filter(faculty_id=member.pk, expertise_type="expertise")
    # The owner supplied the public expertise list. Preserve superseded entries internally.
    expertise.exclude(title__in=EXPERTISE).update(is_published=False)
    for order, title in enumerate(EXPERTISE):
        matches = list(expertise.filter(title=title).order_by("pk"))
        if matches:
            Expertise.objects.using(alias).filter(pk=matches[0].pk).update(is_published=True, sort_order=order)
            Expertise.objects.using(alias).filter(pk__in=[row.pk for row in matches[1:]]).update(is_published=False)
        else:
            Expertise.objects.using(alias).create(faculty_id=member.pk, expertise_type="expertise",
                title=title, sort_order=order, is_published=True)


class Migration(migrations.Migration):
    dependencies = [("people", "0015_department_organization")]
    # A rollback must not restore known incorrect years or invent former expertise.
    operations = [migrations.RunPython(apply_confirmations, migrations.RunPython.noop)]
