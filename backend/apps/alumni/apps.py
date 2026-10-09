from django.apps import AppConfig


class AlumniConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.alumni"

    def ready(self):
        from . import signals  # noqa: F401
