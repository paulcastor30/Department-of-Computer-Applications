from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.alumni.models import AlumniSettings, AlumniProfile, AlumniEmailLink, AlumniUpdateSession


class Command(BaseCommand):
    help = "Preview expired alumni records and access links; --apply deletes them under the configured retention period."

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true")

    def handle(self, *args, **options):
        now = timezone.now()
        config = AlumniSettings.objects.filter(pk=1).first()
        profiles = AlumniProfile.objects.none()
        if config and config.retention_days:
            profiles = AlumniProfile.objects.filter(alumni_updated_at__lt=now - timedelta(days=config.retention_days))
        links = AlumniEmailLink.objects.filter(created_at__lt=now - timedelta(hours=48))
        sessions = AlumniUpdateSession.objects.filter(expires_at__lt=now)
        self.stdout.write(f"Eligible for deletion: {profiles.count()} profiles, {links.count()} email-link requests, {sessions.count()} expired sessions.")
        if options["apply"]:
            profiles.delete()
            links.delete()
            sessions.delete()
            self.stdout.write("Eligible records deleted.")
        else:
            self.stdout.write("Preview only. Use --apply to delete. No names, email addresses, or tokens are printed.")
