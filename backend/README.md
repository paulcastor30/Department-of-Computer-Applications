# Backend README

This folder contains the **Django backend** for the Department of Computer Applications website.

The backend is responsible for:

- content management through Django admin
- public API endpoints for the React frontend
- media and file handling
- editorial roles and permissions
- structured data for accreditation and quality related content

## Current stack

The backend uses Django 6.0.3 together with Django REST framework and `django-cors-headers`.【turn189303view0†L0-L0】【turn837861view2†L0-L2】

The settings currently show domain apps under `apps.core`, `apps.academics`, `apps.people`, `apps.research`, `apps.extension`, `apps.communications`, and `apps.quality`.【turn837861view2†L1-L2】

## Backend structure

A typical backend layout in this project is:

```text
backend/
├── apps/
│   ├── core/
│   ├── academics/
│   ├── people/
│   ├── research/
│   ├── extension/
│   ├── communications/
│   └── quality/
├── dca_site/
├── manage.py
└── db.sqlite3
```

## Responsibilities by app

### `apps.core`
Cross cutting content such as site settings, homepage data, department profile, hero sections, and quick stats.

### `apps.academics`
Programs, curriculum related data, educational objectives, student outcomes, and academic FAQs.

### `apps.people`
Faculty and staff directory data, profile content, qualifications, and achievements.

### `apps.research`
Research areas, projects, publications, laboratories, and metrics.

### `apps.extension`
Community extension programs, partnerships, outcomes, and service impact.

### `apps.communications`
News, events, downloadable resources, and public contact related content.

### `apps.quality`
Evidence documents, accreditation ready structures, and quality support metadata.

## Local setup

From the `backend` folder:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Useful commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
python manage.py shell
```

If the project includes custom management commands such as role setup, run them after migrations:

```bash
python manage.py setup_roles
```

## API design direction

The backend is moving toward:

- serializers per app
- read only public endpoints for public content
- admin driven content editing
- explicit permissions and editorial roles
- incremental replacement of hardcoded placeholders

Examples of API namespaces expected in this structure:

```text
/api/core/
/api/academics/
/api/people/
/api/communications/
/api/quality/
```

## Admin and editorial workflow

Django admin is the internal editorial interface. The intent is to support roles such as:

- site_admin
- qa_editor
- program_editor
- faculty_editor
- research_editor
- communications_editor

These roles should be permission based, not superuser based.

## Backend contribution ideas

### Good first issues
- improve admin labels and help text
- add `verbose_name` and `verbose_name_plural`
- add serializer tests
- clean up duplicated logic
- improve docstrings and comments

### Intermediate issues
- add list and detail endpoints for remaining models
- improve queryset filtering and ordering
- add pagination to public endpoints
- add media previews in admin
- strengthen validation for important models

### Advanced issues
- add structured accreditation mapping support
- implement custom publish permissions
- improve search across models
- add CI checks for backend code quality

## Development expectations

- keep models explicit and well named
- add migrations for all model changes
- prefer small, reviewable pull requests
- avoid mixing unrelated schema and API changes
- keep admin usability in mind when designing models

## Notes for contributors

This backend is being built incrementally. Some modules may still be in transition while the repository moves from a thin Django shell to a fuller content and API backend. Contributions that improve structure, readability, and maintainability are valuable.

## Institutional source of truth

Store department-level activity in `ResearchProject`, `PublicationRecord`, `ConferenceRecord` or `ExtensionProject`, then link faculty using `FacultyContribution`. Do not duplicate those facts in faculty-specific activity models. Historical activity models are deprecated for new institutional entries, retained for review, and editable for corrections. Education, expertise, supervised work, creative work, professional development and achievements remain faculty-specific.

See [institutional contributions and CI](../docs/institutional-contributions-and-ci.md) for reconciliation commands, editor permissions, migrations and the backend quality gate. Install this folder's requirements with `python -m pip install -r requirements.txt`.
