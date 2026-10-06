"""Versioned, conservative matcher used by migration and internal review command.

Do not change matching rules here after release; create a new version instead.
No faculty names are matched. Existing faculty foreign keys establish identity.
"""
import re
import unicodedata
from django.db import transaction

KINDS = {
    "research": ("FacultyResearchProject", "research", "ResearchProject"),
    "publication": ("FacultyPublication", "research", "PublicationRecord"),
    "conference": ("FacultyConference", "research", "ConferenceRecord"),
    "extension": ("FacultyExtensionProject", "extension", "ExtensionProject"),
}


def normalized(value):
    return " ".join(unicodedata.normalize("NFKC", str(value or "")).casefold().split())


def doi_key(value):
    return re.sub(r"^(?:https?://(?:dx\.)?doi\.org/|doi:\s*)", "", normalized(value))


def period(row):
    # A completion year alone is not a reporting period.
    if row.start_year and row.end_year:
        return str(row.start_year) if row.start_year == row.end_year else f"{row.start_year}-{row.end_year}"
    return normalized(row.implementation_period)


def match(row, kind, sources):
    title_candidates = [s for s in sources if normalized(row.title) == normalized(s.title)]
    candidates = title_candidates
    if kind == "publication" and doi_key(row.doi):
        doi_candidates = [s for s in sources if doi_key(s.doi) == doi_key(row.doi)]
        candidates = list({s.pk: s for s in title_candidates + doi_candidates}.values())
    if not candidates:
        return None, "unresolved", "No exact title or DOI candidate", []
    matches, conflicts = [], []
    for source in candidates:
        if kind == "publication":
            if row.doi and source.doi and doi_key(row.doi) != doi_key(source.doi):
                conflicts.append(source.pk); continue
            if row.year and row.year != source.year:
                conflicts.append(source.pk); continue
            identity = bool(doi_key(row.doi) and doi_key(row.doi) == doi_key(source.doi)) or bool(row.year and row.year == source.year and normalized(row.title) == normalized(source.title))
            # Differing supplied metadata needs review, even with title/year evidence.
            if any(normalized(getattr(row, f)) and normalized(getattr(row, f)) != normalized(getattr(source, f)) for f in ("authors", "venue")):
                conflicts.append(source.pk); continue
        elif kind == "conference":
            identity = bool(row.year == source.year and normalized(row.conference_name) and normalized(row.conference_name) == normalized(source.conference))
            if row.year and row.year != source.year or row.event_date and not source.starts_on <= row.event_date <= source.ends_on:
                conflicts.append(source.pk); continue
        else:
            identity = bool(period(row) and period(row) == normalized(source.reporting_year))
            if period(row) and period(row) != normalized(source.reporting_year):
                conflicts.append(source.pk); continue
        if identity:
            matches.append(source)
    if len(matches) == 1 and not conflicts:
        return matches[0], "matched", "Exact identity evidence", [matches[0].pk]
    status = "conflicting" if conflicts else "unresolved"
    reason = "Conflicting supplied metadata" if conflicts else "Ambiguous candidates or insufficient period/event evidence"
    return None, status, reason, [s.pk for s in candidates]


def reconcile(apps, alias="default", apply=False):
    Credit = apps.get_model("people", "FacultyContribution")
    report = []
    with transaction.atomic(using=alias):
        for kind, (legacy_name, app, source_name) in KINDS.items():
            Legacy = apps.get_model("people", legacy_name)
            sources = list(apps.get_model(app, source_name).objects.using(alias).all())
            for row in Legacy.objects.using(alias).order_by("pk"):
                item = {"kind": kind, "legacy_id": row.pk, "faculty_id": row.faculty_id, "title": row.title}
                if row.reconciled_contribution_id:
                    item.update(status="already_linked", reason="Explicit reconciliation link", contribution_id=row.reconciled_contribution_id)
                else:
                    source, status, reason, ids = match(row, kind, sources)
                    item.update(status=status, reason=reason, candidate_ids=ids)
                    if source:
                        lookup = {"faculty_id": row.faculty_id, kind + "_id": source.pk}
                        credit = Credit.objects.using(alias).filter(**lookup).first()
                        item["status"] = "already_linked" if credit else "linked_automatically"
                        if apply:
                            if credit is None:
                                # Only explicit historical roles; never infer authorship from a name.
                                credit, _ = Credit.objects.using(alias).get_or_create(**lookup, defaults={"role": getattr(row, "role", ""), "is_published": row.is_published})
                            Legacy.objects.using(alias).filter(pk=row.pk).update(reconciled_contribution_id=credit.pk)
                            item["contribution_id"] = credit.pk
                report.append(item)
    return report
