from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from apps.alumni.models import GraduateRecord, GraduateObservation
from apps.alumni.workbook_import import extract_workbook


class Command(BaseCommand):
    help = "Import only BSCA/MSCA rows privately. Default is a count-only preview; --apply writes records."

    def add_arguments(self, parser):
        parser.add_argument("paths", nargs="+")
        parser.add_argument("--apply", action="store_true")

    def handle(self, *args, **options):
        try:
            rows = [row for path in options["paths"] for row in extract_workbook(path)]
        except (OSError, ValueError, KeyError) as error:
            raise CommandError(f"Workbook layout could not be read: {type(error).__name__}") from error
        self.stdout.write(f"Eligible source rows: {len(rows)} (BSCA: {sum(r[0]['program'] == 'BSCA' for r in rows)}, MSCA: {sum(r[0]['program'] == 'MSCA' for r in rows)}).")
        if not options["apply"]:
            self.stdout.write("Preview only; no profiles, logins, subscriptions, or database records created.")
            return
        created = observed = 0
        with transaction.atomic():
            for values, observation in rows:
                graduate, new = GraduateRecord.objects.get_or_create(source_key=values["source_key"], defaults=values)
                created += new
                # Preserve staff corrections; fill only fields still missing on repeated imports.
                if not new:
                    if values.get("student_id") and graduate.student_id and values["student_id"] != graduate.student_id:
                        raise CommandError("Conflicting student identifiers for a source identity. Import stopped without applying changes; review the source records privately.")
                    for field, value in values.items():
                        if value and not getattr(graduate, field):
                            setattr(graduate, field, value)
                    graduate.save()
                _, new_observation = GraduateObservation.objects.get_or_create(source_digest=observation["source_digest"], source_sheet=observation["source_sheet"], source_row=observation["source_row"], defaults={"graduate": graduate, **observation})
                observed += new_observation
        self.stdout.write(f"Imported privately: {created} new graduate records; {observed} new source observations. No alumni accounts created and no messages sent.")
