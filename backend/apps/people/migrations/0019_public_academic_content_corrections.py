"""Preserve source records while enforcing approved public academic content."""
from importlib import import_module
from django.db import migrations


def correct_public_records(apps, schema_editor):
    Faculty = apps.get_model("people", "FacultyMember")
    Education = apps.get_model("people", "FacultyEducation")
    Contribution = apps.get_model("people", "FacultyContribution")
    alias = schema_editor.connection.alias
    sources = [("0004_updated_faculty_profiles_2026", "email"), ("0009_allied_and_resigned_faculty", "title")]
    # Match the exact department-supplied source assertion, never year presence alone.
    # Existing publication choices survive for matched, resolved source records.
    for module_name, identity in sources:
        source = import_module("apps.people.migrations." + module_name)
        for profile in source.PROFILES:
            people = list(Faculty.objects.using(alias).filter(**{identity: profile[identity]}))
            if len(people) != 1:
                continue
            member = people[0]
            for record in profile["education"]:
                note = record["notes"]
                if "validated" in note.lower() or "completion status" in note.lower():
                    continue
                if record["degree_level"] == "other":
                    status = "experience"
                elif note == "Ongoing study; degree not yet completed.":
                    status = "ongoing"
                elif note == "Completed qualification; year not supplied by the Department." or (record["year_completed"] is not None and not note):
                    status = "completed"
                else:
                    continue
                notes = [note, "Ongoing"] if status == "ongoing" else [note]
                Education.objects.using(alias).filter(
                    faculty_id=member.pk, degree_level=record["degree_level"],
                    degree_name=record["degree_name"], institution=record["institution"],
                    year_completed=record["year_completed"], notes__in=notes,
                    academic_status="review", verification_reference="",
                ).update(academic_status=status, verification_reference="Department-supplied education source: people." + module_name + "; existing publication decision retained.")
            # Remove only exact generated summaries; preserve department-authored biographies.
            if profile.get("profile_summary") == member.profile_summary:
                Faculty.objects.using(alias).filter(pk=member.pk).update(profile_summary="")

    # Exact Alce variants and canonical identity were confirmed by the owner on 9 October 2026.
    people = list(Faculty.objects.using(alias).filter(email="applerose.alce@g.msuiit.edu.ph"))
    if not people:
        people = list(Faculty.objects.using(alias).filter(title="Apple Rose B. Alce"))
    if len(people) == 1:
        member = people[0]
        rows = Education.objects.using(alias).filter(faculty_id=member.pk)
        canonical_master = list(rows.filter(degree_level="masters", degree_name="Master of Science in Computer Applications", institution="MSU - Iligan Institute of Technology", year_completed=2020))
        if len(canonical_master) == 1:
            rows.filter(degree_level="masters", degree_name="Master of Science in Computer Applications, Philippines", institution="Mindanao State University - Iligan Institute of Technology, Philippines", year_completed=2020).update(
                academic_status="completed", is_published=False,
                verification_reference=f"Owner-confirmed duplicate of education {canonical_master[0].pk}, 9 October 2026; original source wording retained internally.")
        canonical_doctorate = list(rows.filter(degree_level="doctorate", degree_name="PhD in Artificial Intelligence of Things", institution="National Taiwan University and Academia Sinica", notes__in=["Ongoing", "Ongoing study; degree not yet completed."]))
        if len(canonical_doctorate) == 1:
            rows.filter(degree_level="doctorate", degree_name="PhD in Artificial Intelligence of Things", institution="National Taiwan University, Taiwan & Academia Sinica, Taiwan", year_completed=None).update(
                is_published=False, verification_reference=f"Owner-confirmed duplicate of education {canonical_doctorate[0].pk}, 9 October 2026; original source wording retained internally.")
        rows.filter(degree_level="bachelors", degree_name="Bachelor of Science in Electronics and Computer Technology (Major in Embedded Systems)", institution="Mindanao State University - Iligan Institute of Technology, Philippines", year_completed=2017, notes="").update(
            academic_status="completed", verification_reference="Owner-confirmed bachelor’s year and existing award record, 9 October 2026.")

    # Unknown or changed source assertions require review, not guessed credentials.
    Education.objects.using(alias).filter(academic_status="review").update(is_published=False)
    Contribution.objects.using(alias).filter(role="Conference paper author (presenter not confirmed)").update(role="Conference paper author")
    for field in ("phone", "office"):
        for value in ("N/A", "N/A N/A", "NA", "---"):
            Faculty.objects.using(alias).filter(**{field + "__iexact": value}).update(**{field: ""})


class Migration(migrations.Migration):
    dependencies = [("people", "0018_education_publication_status")]
    # Reversal must not republish unresolved credentials or restore editorial filler.
    operations = [migrations.RunPython(correct_public_records, migrations.RunPython.noop)]
