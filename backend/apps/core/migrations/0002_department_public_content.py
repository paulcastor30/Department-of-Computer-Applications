import re
from django.db import migrations
from django.utils import timezone

CONTACTS = {'site_name': 'Department of Computer Applications', 'short_name': 'DCA', 'primary_email': 'ccs.ca@g.msuiit.edu.ph', 'primary_phone': '+63 221 2002, local 4112', 'address': '1st floor, College of Computer Studies\nMindanao State University-Iligan Institute of Technology\nAndres Bonifacio Avenue, Tibanga, 9200 Iligan City, Philippines'}
OVERVIEW = 'The Department of Computer Applications is part of the College of Computer Studies at MSU–Iligan Institute of Technology. Our BSCA program brings together software, firmware (software that controls devices), and hardware to develop embedded and connected systems for real-world use.'


def missing_or_test(value):
    text = (value or "").strip()
    return not text or bool(re.fullmatch(r"[asdf]{6,}", text, re.IGNORECASE)) or text.rstrip(".").casefold() == "to be provided by the department"


def populate_public_content(apps, schema_editor):
    Setting = apps.get_model("core", "SiteSetting")
    Profile = apps.get_model("core", "DepartmentProfile")
    alias = schema_editor.connection.alias
    setting = Setting.objects.using(alias).order_by("id").first()
    if setting is None:
        Setting.objects.using(alias).create(**CONTACTS)
    else:
        updates = {field: value for field, value in CONTACTS.items() if missing_or_test(getattr(setting, field))}
        if updates:
            Setting.objects.using(alias).filter(pk=setting.pk).update(**updates, updated_at=timezone.now())
    profile = Profile.objects.using(alias).order_by("id").first()
    if profile is None:
        Profile.objects.using(alias).create(title="About the Department", overview=OVERVIEW)
    else:
        updates = {}
        if missing_or_test(profile.overview):
            updates["overview"] = OVERVIEW
        # No separate university-approved department vision/mission was supplied.
        for field in ("vision", "mission", "goals", "outcomes_mapping_note"):
            if re.fullmatch(r"[asdf]{6,}", (getattr(profile, field) or "").strip(), re.IGNORECASE):
                updates[field] = ""
        if updates:
            Profile.objects.using(alias).filter(pk=profile.pk).update(**updates, updated_at=timezone.now())


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]
    operations = [migrations.RunPython(populate_public_content, migrations.RunPython.noop)]
