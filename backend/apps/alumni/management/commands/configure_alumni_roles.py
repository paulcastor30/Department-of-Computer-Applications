from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Configure limited alumni staff groups without creating accounts or assigning users."

    def handle(self, *args, **options):
        common = ["view_alumniprofile", "change_alumniprofile", "view_alumnicareerentry", "view_graduaterecord", "change_graduaterecord", "view_graduateobservation", "view_alumniopportunity", "add_alumniopportunity", "change_alumniopportunity"]
        for name, codes in {"Alumni coordinators": common, "Alumni chairperson": common + ["view_alumnisettings", "change_alumnisettings", "delete_alumniprofile", "reset_alumni_access"]}.items():
            group, _ = Group.objects.get_or_create(name=name)
            group.permissions.set(Permission.objects.filter(content_type__app_label="alumni", codename__in=codes))
            self.stdout.write(f"Configured {name}. No users created or assigned.")
