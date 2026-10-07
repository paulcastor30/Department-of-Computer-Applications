# Backend

Django stores the website content and provides the admin screens. Django REST Framework exposes data for the React frontend.

Follow the [main setup instructions](../README.md#getting-started) first. Settings are in `dca_site/settings.py`; API routes start in `dca_site/api_urls.py`.

## Where to edit

Apps are under `apps/`:

- `core`: site settings, homepage sections, and project prototypes.
- `academics`: programs, curriculum information, and the SOJT guide.
- `people`: faculty profiles and links to their department activities.
- `communications`: news, events, and resources.
- `research`: projects, publications, and conference records.
- `extension`: extension projects.
- `quality`: evidence documents.

Within each app, `models.py` defines the database records, `admin.py` configures their editing screens, `serializers.py` defines the API fields, and `views.py` handles requests. `api_urls.py` maps URLs to views; `tests.py` contains tests.

## Local admin

With your Python environment active, run from this folder:

```bash
python manage.py createsuperuser
```

Start Django and open `http://127.0.0.1:8000/admin/`. The account you create belongs to your local database.

To create the existing editorial permission groups:

```bash
python manage.py setup_roles
```

## Model changes

After editing a model, create and apply its migration:

```bash
python manage.py makemigrations
python manage.py migrate
```

Include the generated migration file in your pull request. Add a new migration for a new change rather than rewriting an old applied migration.

## Faculty and department activities

Research projects, publications, conference records, and extension projects are stored as department records. `FacultyContribution` links people to those records. See [the content workflow](../docs/institutional-contributions-and-ci.md) before changing these relationships.

## Checks

Run from this folder with your Python environment active:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for submitting a change.
