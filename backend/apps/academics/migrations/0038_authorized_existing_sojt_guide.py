"""Publish only the exact supplied guide authorized by the user on 2026-10-15."""
import hashlib
import json
from datetime import date
from django.db import migrations

AUTHORIZED_CONTENT_HASH = 'acc06c3b3f7636c985b98923ebba8a3f6c1516c8820507556ce8473a93446ba8'
AUTHORIZATION = "Project user authorized existing SOJT guide text unchanged in chat on 2026-10-15: use it as is for now."


def publish_authorized_guide(apps, schema_editor):
    Guide = apps.get_model("academics", "SOJTGuide")
    rows = Guide.objects.using(schema_editor.connection.alias)
    guide = rows.filter(slug="bsca", is_published=False).first()
    if guide is None:
        return
    actual = hashlib.sha256(json.dumps(guide.content, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    if actual != AUTHORIZED_CONTENT_HASH:
        return  # Preserve editor changes; they were not covered by the authorization.
    rows.filter(pk=guide.pk).update(is_published=True, reviewed_on=date(2026, 10, 15),
        approval_reference=AUTHORIZATION, approved_content_hash=actual)


class Migration(migrations.Migration):
    dependencies = [("academics", "0037_sojtguide_approved_content_hash")]
    operations = [migrations.RunPython(publish_authorized_guide, migrations.RunPython.noop)]
