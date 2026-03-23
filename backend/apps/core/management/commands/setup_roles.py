from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

GROUP_MATRIX = {
    "site_admin": {
        "core": {
            "sitesetting": ["view", "add", "change", "delete"],
            "departmentprofile": ["view", "add", "change", "delete"],
            "herosection": ["view", "add", "change", "delete"],
            "quickstat": ["view", "add", "change", "delete"],
        },
        "academics": {
            "program": ["view", "add", "change", "delete"],
        },
        "people": {
            "facultymember": ["view", "add", "change", "delete"],
        },
        "communications": {
            "newspost": ["view", "add", "change", "delete"],
        },
        "quality": {
            "evidencedocument": ["view", "add", "change", "delete"],
        },
    },

    "qa_editor": {
        "core": {
            "departmentprofile": ["view", "change"],
            "herosection": ["view"],
            "quickstat": ["view"],
        },
        "academics": {
            "program": ["view"],
        },
        "people": {
            "facultymember": ["view"],
        },
        "communications": {
            "newspost": ["view"],
        },
        "quality": {
            "evidencedocument": ["view", "add", "change"],
        },
    },

    "program_editor": {
        "academics": {
            "program": ["view", "add", "change"],
        },
        "quality": {
            "evidencedocument": ["view"],
        },
    },

    "faculty_editor": {
        "people": {
            "facultymember": ["view", "add", "change"],
        },
        "quality": {
            "evidencedocument": ["view"],
        },
    },

    "research_editor": {
        "quality": {
            "evidencedocument": ["view", "add", "change"],
        },
        # add research model permissions here later when research models exist
    },

    "communications_editor": {
        "communications": {
            "newspost": ["view", "add", "change"],
        },
        "core": {
            "herosection": ["view", "add", "change"],
            "quickstat": ["view", "change"],
        },
        "quality": {
            "evidencedocument": ["view"],
        },
    },
}


def permission_queryset(app_label: str, model_name: str, actions: list[str]):
    codenames = [f"{action}_{model_name}" for action in actions]
    return Permission.objects.filter(
        content_type__app_label=app_label,
        codename__in=codenames,
    )


class Command(BaseCommand):
    help = "Create and refresh editorial groups with per-model permissions"

    def handle(self, *args, **options):
        for group_name, app_map in GROUP_MATRIX.items():
            group, _ = Group.objects.get_or_create(name=group_name)

            perms = Permission.objects.none()
            for app_label, model_map in app_map.items():
                for model_name, actions in model_map.items():
                    perms = perms | permission_queryset(app_label, model_name, actions)

            group.permissions.set(perms)
            self.stdout.write(
                self.style.SUCCESS(
                    f"{group_name}: assigned {group.permissions.count()} permissions"
                )
            )

        self.stdout.write(self.style.SUCCESS("Role setup complete."))