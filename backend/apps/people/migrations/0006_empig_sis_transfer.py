"""SO 00181-IIT Series 2026; graduate affiliation confirmed by the department owner."""
from django.db import migrations

TRANSFER_NOTE = "Transferred from the College of Computer Studies to the School of Interdisciplinary Studies effective 13 February 2026 under Special Order No. 00181-IIT, Series of 2026. Continued MSCA affiliation confirmed by the Department."


def record_empig_transfer(apps, schema_editor):
    Faculty = apps.get_model("people", "FacultyMember")
    alias = schema_editor.connection.alias
    candidates = list(Faculty.objects.using(alias).filter(title__icontains="Empig"))
    if len(candidates) > 1:
        raise RuntimeError("Multiple Ernesto Empig profiles found; resolve them before applying the transfer update.")
    if candidates:
        member = candidates[0]
    else:
        member = Faculty.objects.using(alias).create(title="Ernesto E. Empig", slug="ernesto-e-empig", is_published=True)
    note = member.appointment_or_assignment_note or ""
    if TRANSFER_NOTE not in note:
        note = (note.rstrip() + "\n\n" + TRANSFER_NOTE).strip()
    updates = dict(transferred_from_dca=True, service_classification="affiliated_msca_faculty",
        home_unit="School of Interdisciplinary Studies (SIS)", active_affiliation=True,
        appointment_or_assignment_note=note)
    programs = member.supporting_programs or ""
    if "MSCA" not in [part.strip() for part in programs.upper().replace(";", ",").replace("\n", ",").split(",")]:
        updates["supporting_programs"] = ", ".join(filter(None, [programs.strip(), "MSCA"]))
    Faculty.objects.using(alias).filter(pk=member.pk).update(**updates)


class Migration(migrations.Migration):
    dependencies = [("people", "0005_facultymember_transferred_from_dca")]
    operations = [migrations.RunPython(record_empig_transfer, migrations.RunPython.noop)]
