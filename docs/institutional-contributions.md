# Institutional contributions

Department-level activity is stored once in the appropriate institutional model and linked to faculty using `FacultyContribution`. Faculty profiles read the shared record at request time; correcting its title, year, DOI, withdrawal or publishing status updates every profile presentation.

| Preserved historical faculty model | Authoritative institutional source | Identity evidence for automatic reconciliation |
| --- | --- | --- |
| FacultyResearchProject | ResearchProject | Exact normalized title and exact reporting period |
| FacultyPublication | PublicationRecord | Exact DOI, or exact normalized title and year; reject conflicting supplied DOI/year/authors/venue |
| FacultyConference | ConferenceRecord | Exact normalized paper title, conference name and year; reject contradictory event date |
| FacultyExtensionProject | ExtensionProject | Exact normalized title and reporting year |

Normalization uses Unicode NFKC, case folding and whitespace normalization, with DOI URL/prefix removal. It does not discard title punctuation, match surnames, use fuzzy similarity, or treat a completion year as a reporting period. A project start/end range is comparable to a reporting range; a single year requires identical supplied start and end years or an explicit implementation period. Insufficient, ambiguous or contradictory evidence is reported for Department review, never silently merged. Multiple candidates or conflicting candidates prevent automatic linking.

## Editor workflow

1. Create/correct the shared activity in **Research → Research projects / Publication records / Conference records**, or **Extension → Extension projects**.
2. Add faculty in that record's **Faculty contributions** inline, or **People → Faculty contributions**, or the faculty profile's contributions inline. Select exactly one source. Search faculty and source titles; filter type, role, link visibility and source visibility; inspect source title/year in the contribution list.
3. Enter only a role supported by evidence. An unspecified role remains blank. Author does not establish presenter; participant does not establish leader.
4. Publish both the institutional record and the contribution to display it publicly. Directory counts follow the same visibility policy.

The four historical activity tables remain intact for reconciliation and historical corrections. Their admin forms and profile inlines do not permit new entries. Existing records remain editable, with a warning and an optional **reconciled contribution** field for Department-confirmed matches. The field must refer to the same faculty and activity type. Linked copies stay internal, even if a shared source/link is unpublished, so unpublished authoritative content cannot reappear through the old copy. Unmatched approved (`is_published`) records remain visible. Public pages do not label records as legacy. Related contributions/sources cannot be deleted while historical records protect them; unpublish instead, or explicitly resolve the historical link first.

Education, expertise, supervised works without institutional equivalents, creative works, professional development and achievements remain faculty-specific. Do not create a competing schema for department-level institutional activities. Later relationships between research, publications and student work can reference existing shared records; none are introduced here.

Run `python manage.py setup_roles` explicitly when refreshing existing editorial groups. The faculty editor can link shared records (with view access for autocomplete); the research editor can edit institutional activities and their faculty links. This command replaces group permission sets according to its existing documented matrix; review custom group permissions before running it. No production permissions are changed automatically by these migrations.

## Safe transition and internal report

- `0012_historical_activity_links` adds nullable protected links on the four historical models and permits unspecified contribution roles. It changes no historical metadata.
- `0013_reconcile_historical_activities` runs versioned deterministic reconciliation, creating/confirming credits and connecting confident matches. Existing staff credit roles and publishing choices are preserved; new credits use the historical publishing choice and only explicitly supplied roles. Repeated runs are idempotent.
- All original rows and authored fields remain. No shared activity is synthesized from unresolved faculty data.
- Data-migration reversal deliberately leaves confirmed credits/links intact to preserve later staff edits. Schema reversal removes only the new link columns; original historical records survive. Downgrading also restores the older application's display policy and can reintroduce duplication. Use a backup and review before rollback.

From `backend/`, run:

```bash
python manage.py reconcile_faculty_activities             # read-only report
python manage.py reconcile_faculty_activities --apply     # exact confirmed identity evidence only
```

The internal JSON report has `linked_automatically`, `already_linked`, `unresolved`, and `conflicting` counts, per-record reasons and candidate IDs. Dry-run automatic counts are proposed actions, not applied changes. Keep reports internal. For unresolved/conflicting rows, staff should review the original evidence and attach a verified contribution, correct metadata only when justified, or retain a faculty-specific historical item. Do not promote such rows into shared records automatically.

For current test commands, see [Testing](testing.md). Historical execution results are in the [archive](archive/institutional-contributions-verification.md).
