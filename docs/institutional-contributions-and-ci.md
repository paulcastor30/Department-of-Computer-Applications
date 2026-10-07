# Institutional contributions and CI checks

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

### Available-data audit

The supplied local `backend/db.sqlite3` had none of the faculty activity/contribution tables. Auditing a separate temporary SQLite database built from all repository migrations found **0 historical rows in each of the four models**, **0 automatic reconciliations**, **0 requiring manual review**, and **0 ambiguous/conflicting historical rows**. Existing shared seeds and contribution seed migration remain unchanged. These are repository-seed counts, not production CMS counts. Production Railway content was not accessed; run the internal report there to establish actual authored-data counts. Synthetic tests exercise exact matches, all four types, conflicts, ambiguity, unpublished records, preserved history and corrections.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and pull requests targeting `main`. It has read-only repository permissions and no deployment secrets or deployment commands. Dependency caches cover the npm lockfile and backend requirements and CI constraints. Obsolete runs for the same PR are cancelled; main runs use unique commit groups and are not cancelled.

Stable required status names:

- **frontend-quality**: Node 22, `npm ci`, typecheck, ESLint, full Vitest suite, production build (including page metadata generation), sharing verification.
- **backend-quality**: Python from `backend/.python-version` (3.12.13), dependency installation, Django system check, migration drift check, complete Django tests with isolated SQLite and a public CI-only secret key. No production database credentials or PostgreSQL service are needed for the current tests.

Frontend has a committed npm lockfile. Backend CI installs the existing declared requirements with `python -m pip install -r requirements.txt -c constraints-ci.txt`. The small constraints file pins the verified dependency resolution, including transitive packages, so compatible upstream releases do not silently change CI. Deployment requirements remain unchanged; update CI constraints deliberately when changing dependencies. Existing non-fatal lint/build warnings and dependency audit findings are not converted into blocking gates.

Run the same checks locally:

```bash
cd frontend
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run check:sharing
```

```bash
cd backend
python -m pip install -r requirements.txt -c constraints-ci.txt
# Use a temporary database if local environment settings reference production.
export DJANGO_DEBUG=True
export DATABASE_URL=sqlite:////tmp/dca-quality.sqlite3
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

CI verifies code. Vercel deploys the frontend and Railway deploys the backend through the existing configuration. CI does not introduce a second deployment mechanism or change routing, deployment files, homepage content, Thesis Process Guide or SOJT Process Guide.

### Required merge checks

After the new workflow has run, open GitHub repository → Settings → Rules → Rulesets (or Branches → Branch protection) → target `main` → Require status checks before merging → choose **frontend-quality** and **backend-quality**, then enable/save the rule. Review bypass actors and direct-push policy with the repository owner. Workflow files alone do not enforce merge protection, and verification does not gate provider auto-deployments of direct pushes to main. Configure required checks before allowing merges. No branch protection is claimed active merely because CI exists.

## Implementation verification

Local full checks passed: TypeScript (app and Vite configuration), ESLint (two existing warnings), **107 frontend tests across 17 files**, production build, sharing metadata verification, Django system check, migration drift check and **43 backend tests**. New tests cover historical reconciliation of all four types, ambiguous/weak/conflicting evidence, idempotent migration, preservation of unpublished/historical rows and staff decisions, single-source/unique-link constraints, manual link validation, admin deprecation, directory counts and authoritative title corrections. A frontend regression keeps approved unrelated same-title records in different years instead of hiding them by title alone.

Browser checks against the built frontend and temporary seeded backend loaded the homepage, directory, faculty profile, research landing/projects, publications, conferences, extension, Thesis Process Guide and SOJT Process Guide with the expected headings, main landmarks and skip links. No JavaScript page errors were recorded. Local Vercel analytics emits its expected missing-provider-script log. Browser checks are a regression smoke check, not a complete accessibility audit.

Dependency installation reported **38 existing npm findings: 6 moderate, 30 high and 2 critical**. They are reported separately and were not upgraded or made blocking as part of this task. Deployment dependency ranges remain unpinned; CI has a separate verified constraints file.

The GitHub integration returned **403 Resource not accessible by integration** for `main` branch-protection inspection. Protection was not modified or verified; the required-check configuration above remains a manual step.

Railway compatibility checks also passed production static-file collection and Gunicorn application configuration loading against the temporary database. Deployment configuration files were unchanged.
