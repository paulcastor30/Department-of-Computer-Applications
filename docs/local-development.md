# Local development

Start with the [setup instructions](../README.md#getting-started).

## Editing content locally

From `backend/`, with your Python environment active:

```bash
python manage.py createsuperuser
```

Start Django and sign in at `http://127.0.0.1:8000/admin/`.

To try a homepage edit, add a Hero section with title `Local development example`, slug `local-development-example`, and subtitle `Example for my local site`. Enable `is_published`, save, and reload the homepage. You can also inspect the record at `http://127.0.0.1:8000/api/core/home/`.

This changes your local database. Do not use the live admin for development experiments.

## Common setup problems

| Problem | Try this |
| --- | --- |
| API requests return HTML instead of JSON | Check that `frontend/.env.local` sets `VITE_API_BASE_URL=http://127.0.0.1:8000`, restart Vite, and confirm Django is running. |
| The browser reports a CORS error | Open the frontend at `http://localhost:8080`. If Vite chose another port, check whether another process is using 8080. |
| Django asks for a production database | Check whether your terminal has production environment variables set; see below. |
| Django says a table is missing | Run `python manage.py migrate` in the environment used by your server. |
| The local site differs from the live site | Your local database has its own records. Check Django admin for the content and publication status. |
| The root Django URL cannot find a page | During development, open Vite on port 8080. Django needs a frontend build to serve the pages itself. |

If you still need help, open an issue with your operating system, Python/Node versions, steps you tried, and the error text. Remove passwords and personal information.

## Backend environment variables

Django reads variables from your terminal; it does not automatically load a `.env` file. `backend/.env.example` is a production reference. The local defaults use SQLite and debug mode.

If you previously set production variables in your terminal, clear them before running local Django commands.

macOS/Linux:

```bash
unset DATABASE_URL RAILWAY_ENVIRONMENT RAILWAY_PUBLIC_DOMAIN
export DJANGO_DEBUG=True
```

Windows PowerShell:

```powershell
Remove-Item Env:DATABASE_URL, Env:RAILWAY_ENVIRONMENT, Env:RAILWAY_PUBLIC_DOMAIN -ErrorAction SilentlyContinue
$env:DJANGO_DEBUG = "True"
```

## Serving the frontend through Django

For a local build served by Django, set `VITE_API_BASE_URL=` in `frontend/.env.local`, then run:

```bash
cd frontend
npm run build
cd ../backend
python manage.py collectstatic --noinput
python manage.py runserver
```

These commands start from the repository root. Open `http://127.0.0.1:8000`. Restore `VITE_API_BASE_URL=http://127.0.0.1:8000` when returning to separate Vite and Django development servers.
