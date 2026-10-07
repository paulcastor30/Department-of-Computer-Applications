# Local development and troubleshooting

Use the [README quick start](../README.md#getting-started). CI uses Python 3.12 (the repository pins 3.12.13) and Node.js 22. The committed npm lockfile and backend CI constraints keep installs aligned with CI.

## Configuration

The backend reads process environment variables with `os.getenv`; it does **not** automatically load a `.env` file. `backend/.env.example` is a production configuration reference, not a required local setup step. A clean local environment defaults to debug mode and SQLite. Do not copy production database credentials into your development environment.

The frontend reads `frontend/.env.local` through Vite. Copy `frontend/.env.example` to it and restart Vite after changes. Its local API address is `http://127.0.0.1:8000`. Use the frontend at `http://localhost:8080`; both localhost and 127.0.0.1 on port 8080 are allowed by the backend's local CORS settings.

If your shell already has production environment values, use a clean development terminal. On macOS/Linux, you can run backend commands against local defaults with:

```bash
unset DATABASE_URL RAILWAY_ENVIRONMENT RAILWAY_PUBLIC_DOMAIN
export DJANGO_DEBUG=True
```

On Windows PowerShell:

```powershell
Remove-Item Env:DATABASE_URL, Env:RAILWAY_ENVIRONMENT, Env:RAILWAY_PUBLIC_DOMAIN -ErrorAction SilentlyContinue
$env:DJANGO_DEBUG = "True"
```

## Local data without production access

Migrations introduce some program reference content. A new database is not a copy of the live website, so empty faculty/news/research lists can be expected. Never download a production database to fill them.

To practice editing, run `python manage.py createsuperuser` from `backend/` with your environment active, then visit `http://127.0.0.1:8000/admin/`. Create a Hero section with title `Local development example`, slug `local-development-example`, subtitle `Synthetic content for local development only`, and `is_published` enabled. Leave the image and links blank. Use this only in your local database; do not deploy it or enter it in the live admin. View `http://127.0.0.1:8000/api/core/home/` and the homepage to inspect the result.

For permissions work, `python manage.py setup_roles` creates the existing editorial groups. Your local superuser can administer your local database; it has no connection to production accounts.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| API requests return HTML or a JSON parse error | Check `.env.local`, confirm `VITE_API_BASE_URL`, restart Vite, and check that Django is running on port 8000. |
| Browser reports a CORS error | Open Vite on port 8080 using localhost or 127.0.0.1. If Vite selected another port because 8080 is busy, stop the other local process or configure a matching local CORS origin. |
| Database configuration demands PostgreSQL | Check for inherited production environment variables; use the local environment instructions above. |
| Admin says a table is missing | Run `python manage.py migrate` with the same environment/database used by the server. |
| A list is empty | Check local admin for published records. Empty local data does not necessarily indicate a bug. |
| Frontend dependency install fails | Use Node 22 and `npm ci` in `frontend/`; include the error text in a contribution question. |
| Python package install fails | Check Python 3.12 and the active virtual environment; use the constrained install from the README. |
| Root Django URL cannot find the frontend | During development open Vite on port 8080; serving the SPA through Django requires a frontend build. |

For single-origin testing, see [deployment instructions](../DEPLOYMENT.md). A split-development API address embedded in a frontend build must be replaced with the intended production configuration before deployment.
