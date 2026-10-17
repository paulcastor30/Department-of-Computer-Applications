# Testing

Run commands from the folder shown. Start with the checks for the part you changed; CI runs the complete checks for every pull request.

## Documentation

From the repository root:

```bash
python scripts/check_docs.py
```

This checks local Markdown link targets and heading anchors. Also read the edited instructions and verify any commands you changed. External links need a separate manual check.

## Frontend

From `frontend/`, after `npm ci`:

```bash
npm run check
```

This runs TypeScript, lint, unit tests, the production build, and page metadata checks. CI uses the same command. During development, `npm run test:watch` reruns unit tests as you edit.

For visible changes, check the page at a narrow width and use its controls with the keyboard.

### Browser navigation and accessibility

From `frontend/`:

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

This runs navigation and automated accessibility checks without screenshot baselines, so contributors on Windows, Linux, and macOS can use the same command. On Linux, Playwright may also require system libraries: `npx playwright install --with-deps chromium`.

Playwright starts a preview of `dist` on port 4173. Rebuild after source changes. Browser API responses are fixtures; these checks do not verify a running Django backend.

### Visual comparisons

```bash
npm run test:visual
```

The committed screenshots are macOS references. The macOS browser CI job runs `npm run test:e2e:all`, including visual comparisons. Linux and Windows contributors can use CI for those comparisons. Do not create platform baselines just to bypass a failure. See the [baseline review procedure](../frontend/e2e/README.md).

Lighthouse is an additional maintainer check: start `npm run preview` and run `npm run audit:lighthouse`. It needs a configured backend to assess populated API-backed pages.

## Backend

Activate the Python environment created during [setup](../README.md#getting-started). From `backend/`:

```bash
python scripts/check.py
```

This runs Django checks, checks for missing migrations, collects static files needed by admin tests, and runs the test suite. It uses a temporary SQLite database and local settings regardless of database variables in your shell. Your development database is unchanged. CI uses this command too.

To focus on one app while working:

```bash
python scripts/check.py apps.people
```

For model changes, create and apply migrations against your local development database before running the checks:

```bash
python manage.py makemigrations
python manage.py migrate
```

Include the new migration in your pull request. Keep existing applied migrations intact.

## When a check fails

Read the first error, fix it, and rerun the affected check. If you need help, include the command and error text in a draft pull request. Remove private records and credentials. Describe which checks passed and which remain blocked.
