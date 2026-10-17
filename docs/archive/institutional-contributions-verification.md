# Institutional contributions: historical verification

Archived from the original implementation report. Counts and deployment statements describe that execution, not current repository status.

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
