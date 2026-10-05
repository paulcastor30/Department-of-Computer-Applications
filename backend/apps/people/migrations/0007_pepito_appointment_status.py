"""Record the department owner's clarification without assigning a future permanent rank."""
from django.db import migrations

APPOINTMENT_NOTE = "Accepted as faculty. Currently serving as Assistant Lecturer. Her permanent position will be updated once she receives her plantilla item."


def record_pepito_appointment(apps, schema_editor):
    Faculty = apps.get_model("people", "FacultyMember")
    alias = schema_editor.connection.alias
    member = Faculty.objects.using(alias).filter(email="collienprincess.pepito@g.msuiit.edu.ph").first()
    if member is None:
        candidates = list(Faculty.objects.using(alias).filter(title__icontains="Pepito").filter(title__icontains="Collien"))
        if len(candidates) > 1:
            raise RuntimeError("Multiple Collien Pepito profiles found; resolve them before updating the appointment note.")
        member = candidates[0] if candidates else Faculty.objects.using(alias).create(
            title="Collien Princess C. Pepito", slug="collien-princess-c-pepito",
            email="collienprincess.pepito@g.msuiit.edu.ph", is_published=True)
    note = member.appointment_or_assignment_note or ""
    if APPOINTMENT_NOTE not in note:
        note = (note.rstrip() + "\n\n" + APPOINTMENT_NOTE).strip()
    Faculty.objects.using(alias).filter(pk=member.pk).update(
        personnel_type="faculty", faculty_category="Lecturer", position="Assistant Lecturer",
        appointment_or_assignment_note=note)


class Migration(migrations.Migration):
    dependencies = [("people", "0006_empig_sis_transfer")]
    operations = [migrations.RunPython(record_pepito_appointment, migrations.RunPython.noop)]
