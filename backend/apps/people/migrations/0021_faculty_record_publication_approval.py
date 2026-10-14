from django.db import migrations, models


RECORDS = ['facultyexpertise', 'facultysupervisedwork', 'facultypublication', 'facultyconference', 'facultyresearchproject', 'facultyextensionproject', 'facultycreativework', 'facultytrainingseminar', 'facultyachievement', 'facultycontribution']


def retain_existing_publication(apps, schema_editor):
    # Preserve existing records and publication decisions; do not assert new approval.
    for name in RECORDS:
        model = apps.get_model("people", name)
        model.objects.using(schema_editor.connection.alias).filter(is_published=True, approval_reference="").update(
            approval_reference="Existing publication decision retained when approval-reference controls were introduced (people.0021)."
        )


class Migration(migrations.Migration):
    dependencies = [("people", "0020_uniform_msu_iit_institution")]
    operations = [
        migrations.AddField(model_name="facultyexpertise", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultysupervisedwork", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultypublication", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultyconference", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultyresearchproject", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultyextensionproject", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultycreativework", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultytrainingseminar", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultyachievement", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AddField(model_name="facultycontribution", name="approval_reference", field=models.TextField(blank=True, help_text="Record the approving authority, approval date and supporting source before publication.")),
        migrations.AlterField(model_name="facultyexpertise", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultysupervisedwork", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultypublication", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultyconference", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultyresearchproject", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultyextensionproject", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultycreativework", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultytrainingseminar", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultyachievement", name="is_published", field=models.BooleanField(default=False)),
        migrations.AlterField(model_name="facultycontribution", name="is_published", field=models.BooleanField(default=False)),
        migrations.RunPython(retain_existing_publication, migrations.RunPython.noop),
    ]
