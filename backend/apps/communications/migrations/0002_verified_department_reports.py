from datetime import datetime, timezone
from django.db import migrations, models

REPORTS = [
    {
        "slug": "vermisense-rcite-2026",
        "title": "VermiSense research recognised at RCITE 2026",
        "summary": "Computer Applications researchers presented a smart vermicomposting system with monitoring and notifications at RCITE 2026.",
        "body": "At RCITE 2026 on 17–18 September 2026, VermiSense received first runner-up in the Best Presenter for the Poster Category. The university report names Junie Jebreel Botawan II, Jarmaine Mesbahoddin Abdul and Binyusoph Sansarona as its authors.\n\nThe project connects computing with compost-bin monitoring. The recognition concerns the poster presentation; it does not establish the system’s effectiveness or commercial availability.",
        "source_url": "https://msuiit.edu.ph/news/news-detail.php?id=2570",
        "published_at": datetime(2026, 9, 28, tzinfo=timezone.utc),
    },
    {
        "slug": "my-comapps-workshop-2024",
        "title": "my.ComApps brings microcontroller learning to students",
        "summary": "The department’s my.ComApps extension program held a microcontroller workshop at St. Michael’s College on 24–26 April 2024.",
        "body": "MSU-IIT reported the launch of the Computer Applications department’s my.ComApps extension program on 24 May 2024. Apple Rose Alce led the project, with Kyle Christian Belono as training assistant.\n\nThe workshop at St. Michael’s College on 24–26 April 2024 introduced students to microcontrollers. This is a record of a past activity. Contact the department about current workshops and participation arrangements.",
        "source_url": "https://msuiit.edu.ph/news/news-detail.php?id=1862",
        "published_at": datetime(2024, 5, 24, tzinfo=timezone.utc),
    },
]

def seed_reports(apps, schema_editor):
    NewsPost = apps.get_model("communications", "NewsPost")
    for report in REPORTS:
        NewsPost.objects.get_or_create(slug=report["slug"], defaults={**report, "category": "NEWS", "is_published": True})

class Migration(migrations.Migration):
    dependencies = [("communications", "0001_initial")]
    operations = [
        migrations.AddField(model_name="newspost", name="source_url", field=models.URLField(blank=True, help_text="Official source supporting this report.")),
        migrations.RunPython(seed_reports, migrations.RunPython.noop),
    ]
