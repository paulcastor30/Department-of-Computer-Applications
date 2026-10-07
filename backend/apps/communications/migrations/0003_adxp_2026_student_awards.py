from datetime import datetime, timedelta, timezone

from django.db import migrations


def seed_report(apps, schema_editor):
    NewsPost = apps.get_model("communications", "NewsPost")
    NewsPost.objects.using(schema_editor.connection.alias).get_or_create(
        slug="computer-applications-students-win-awards-adxp-2026",
        defaults={
            "title": "Computer Applications students win awards at ADXP 2026",
            "category": "NEWS",
            "summary": (
                "Tristan E. Listanco won the ADXP University Icon 2026 title, "
                "while Mark Lorenze B. Bonggot earned second runner-up in the "
                "Project Demonstration Category at Analog Devices Philippines’ Academe Expo."
            ),
            "body": (
                "Computer Applications students received awards at Academe Expo 2026 "
                "(ADXP 2026), hosted by Analog Devices, Inc. Philippines in General "
                "Trias, Cavite, on 16–17 September 2026.\n\n"
                "Tristan E. Listanco (BSCA-4) won the ADXP University Icon 2026 "
                "(U-ICON) championship and became MSU-IIT’s first ADI Student "
                "Ambassador. Mark Lorenze B. Bonggot (BSCA-1) took second runner-up "
                "in the Project Demonstration Category, coached by Excel Van O. "
                "Jondonero of the Department of Computer Applications.\n\n"
                "The expo connected students with industry through competitions, "
                "workshops, facility tours, and mentoring. MSU-IIT published its "
                "report on 7 October 2026."
            ),
            "source_url": "https://www.msuiit.edu.ph/news/news-detail.php?id=2575",
            "published_at": datetime(2026, 10, 7, tzinfo=timezone(timedelta(hours=8))),
            "is_published": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [("communications", "0002_verified_department_reports")]

    operations = [migrations.RunPython(seed_report, migrations.RunPython.noop)]
