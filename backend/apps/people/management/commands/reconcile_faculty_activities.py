import json
from collections import Counter
from django.apps import apps
from django.core.management.base import BaseCommand
from apps.people.reconciliation_v1 import reconcile


class Command(BaseCommand):
    help = "Internal historical activity report (dry run by default; --apply links only exact matches)."

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true")
        parser.add_argument("--database", default="default")

    def handle(self, *args, **options):
        rows = reconcile(apps, options["database"], apply=options["apply"])
        self.stdout.write(json.dumps({"applied": options["apply"], "counts": {status: Counter(r["status"] for r in rows)[status] for status in ("linked_automatically", "already_linked", "unresolved", "conflicting")}, "records": rows}, indent=2))
