import re
import unicodedata
from django.db import migrations


def name_key(value):
    # Full given names and surname must agree; never match on surname alone.
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()
    value = re.sub(r'\b(assoc|asst|prof|professor|instr|instructor|dr|mr|ms|jr|sr)\b\.?', ' ', value)
    if ',' in value:
        parts = value.split(',', 1)
        value = parts[1] + ' ' + parts[0]
    tokens = [token for token in re.findall(r'[a-z]+', value) if len(token) > 1]
    if tokens and tokens[0] == 'ma':
        tokens[0] = 'maria'
    return ' '.join(tokens)


def link_department_records(apps, schema_editor):
    alias = schema_editor.connection.alias
    Faculty = apps.get_model('people', 'FacultyMember')
    Credit = apps.get_model('people', 'FacultyContribution')
    identities = {}
    for faculty in Faculty.objects.using(alias).all():
        identities.setdefault(name_key(faculty.title), []).append(faculty.pk)

    def add(kind, record, name, role):
        matches = identities.get(name_key(name), [])
        if len(matches) == 1:
            Credit.objects.using(alias).get_or_create(faculty_id=matches[0], **{kind + '_id': record.pk}, defaults={'role': role, 'credited_name': name.strip()})

    for record in apps.get_model('research', 'ResearchProject').objects.using(alias).all():
        add('research', record, record.research_leader, 'Research leader')
        for name in record.team_members.splitlines():
            add('research', record, name, 'Research team member')
    for model, kind, role, separator in [('PublicationRecord', 'publication', 'Author', ';'), ('ConferenceRecord', 'conference', 'Conference paper author (presenter not confirmed)', ',')]:
        for record in apps.get_model('research', model).objects.using(alias).all():
            for name in re.split(r'[;,]|\band\b', record.authors):
                add(kind, record, name, role)
    for record in apps.get_model('extension', 'ExtensionProject').objects.using(alias).all():
        add('extension', record, record.extension_leader, 'Extension leader')
        for field in ('faculty_members', 'lecturers', 'staff', 'research_assistants', 'students'):
            for name in getattr(record, field).splitlines():
                add('extension', record, name, 'Extension team member')


class Migration(migrations.Migration):
    dependencies = [('people', '0010_facultycontribution'), ('research', '0006_department_publications'), ('extension', '0002_department_extension')]
    operations = [migrations.RunPython(link_department_records, migrations.RunPython.noop)]
