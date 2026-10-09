from django.db import migrations


PEOPLE = [
    ("Paul Rodolf P. Castor", "paul-rodolf-p-castor", "paulrodolf.castor@g.msuiit.edu.ph", "chairperson", "faculty", "active_dca_faculty", ""),
    ("Cendy Lou O. Odvina", "cendy-lou-o-odvina", "cendylou.odvina@g.msuiit.edu.ph", "admin_aide", "academic_staff", "academic_staff", "Department administrative aide"),
    ("Allan P. Bicada", "allan-p-bicada", "allan.bicada@g.msuiit.edu.ph", "lab_technician", "laboratory_technician", "laboratory_personnel", "Laboratory technician"),
    ("Kristian Kirk L. Origenes", "kristian-kirk-l-origenes", "kristiankirk.origenes@g.msuiit.edu.ph", "lab_technician", "laboratory_technician", "laboratory_personnel", "Laboratory technician"),
]


def record_organization(apps, schema_editor):
    Person = apps.get_model("people", "FacultyMember")
    Role = apps.get_model("people", "DepartmentRole")
    db = schema_editor.connection.alias
    for order, (name, slug, email, role, kind, classification, position) in enumerate(PEOPLE):
        person = Person.objects.using(db).filter(email__iexact=email).first()
        if not person:
            person = Person.objects.using(db).filter(slug=slug).first()
        if not person:
            person = Person.objects.using(db).filter(title__iexact=name).first()
        if not person:
            person = Person.objects.using(db).create(title=name, slug=slug)
        person.email = email
        person.personnel_type = kind
        person.service_classification = classification
        person.active_affiliation = True
        person.is_published = True
        if position:
            person.position = position
            person.faculty_status = ""
        person.save(using=db)
        Role.objects.using(db).update_or_create(person=person, defaults={"role": role, "sort_order": order, "is_published": True})


class Migration(migrations.Migration):
    dependencies = [("people", "0014_departmentrole")]
    operations = [migrations.RunPython(record_organization, migrations.RunPython.noop)]
