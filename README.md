# Department of Computer Applications Website

Public website project for the **Department of Computer Applications**. This repository combines a modern React frontend with a Django backend so the public site can stay fast, polished, and easy to browse while the department team manages content, pages, and structured evidence from the backend.

## Why this project exists

The goal is to build a department website that is:

- modern, clean, academic, and student focused
- easy to maintain by contributors and non developer editors
- ready to support structured content for accreditation and quality assurance work
- open to contributors from **beginners to experts**

This repository is intentionally being shaped as an open source project. That means contributions are welcome across design, frontend, backend, content structure, accessibility, documentation, testing, and deployment.

## Current architecture

The repository currently has a `backend` folder, a `frontend` folder, and a root `requirements.txt` file, with Django serving as the backend and a Vite based React frontend for the public user interface.【turn837861view0†L200-L208】【turn189303view0†L0-L0】

The backend is configured with Django 6.0.3, Django REST framework, and `django-cors-headers`, and is structured around domain apps such as `core`, `academics`, `people`, `research`, `extension`, `communications`, and `quality`.【turn837861view2†L0-L2】

The frontend uses Vite with React, TypeScript, React Router, React Query, and a Tailwind based component setup, with scripts for development, build, linting, preview, and tests already defined in `package.json`.【turn663442view0†L0-L0】

## Repository structure

```text
Department-of-Computer-Applications/
├── backend/        # Django project and backend apps
├── frontend/       # React + Vite frontend
└── requirements.txt
```

## Tech stack

### Backend
- Django
- Django REST framework
- django-cors-headers
- SQLite for local development

### Frontend
- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Radix UI based components
- Vitest

## Development workflow

### 1. Backend

From the project root:

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

### 3. Production style local test

If you want Django to serve the built frontend:

```bash
cd frontend
npm run build

cd ../backend
python manage.py collectstatic --noinput
python manage.py runserver
```

## Contribution guide

We welcome contributors at all levels.

### Good beginner contributions
- fix typos or improve documentation
- improve placeholder text
- add loading and empty states
- improve accessibility labels and alt text
- refine responsive spacing and layout consistency
- add tests for existing views and serializers

### Intermediate contributions
- connect React pages to existing API endpoints
- improve admin usability
- add filters, search, and pagination
- add reusable UI components
- improve error handling and API hooks
- add contributor friendly setup scripts

### Advanced contributions
- design and implement new backend models
- improve editorial workflow and permissions
- add accreditation evidence structures
- optimize query performance and serializer design
- harden deployment and CI workflows
- improve search architecture and observability

## How to contribute

1. Fork the repository
2. Create a feature branch
3. Make one focused change at a time
4. Test your change locally
5. Open a pull request with a clear summary

Suggested branch naming:

```text
feature/home-api-integration
fix/faculty-admin-filter
docs/update-readme
```

## Contribution principles

- keep changes focused and reviewable
- prefer readable code over clever code
- write for maintainability
- preserve accessibility and responsiveness
- document non obvious decisions
- do not break existing public routes without discussion

## Recommended first issues

A useful issue board for this project would include labels such as:

- `good first issue`
- `frontend`
- `backend`
- `documentation`
- `accessibility`
- `testing`
- `help wanted`

## What contributors should know

This project is moving toward a model where:

- **React** handles the public facing experience
- **Django** handles admin, content, API endpoints, media, permissions, and structured evidence

That means some pages may remain partially static while their backend models and APIs are still being introduced. Incremental improvement is expected and acceptable.

## Suggested next milestones

- finish wiring the first CMS backed pages: Home, About, Programs, Faculty, News
- expand the backend editorial workflow by role
- strengthen documentation for setup and contribution
- add tests for APIs and admin behavior
- improve deployment instructions for contributors

## License

Add a license file before wider community onboarding. For an open source academic web project, a permissive license such as MIT or Apache 2.0 is usually the simplest option.

## Maintainers

This repository is currently maintained by the project owner and open to community contributions. If you want to contribute but are unsure where to start, begin with documentation, accessibility, or UI cleanup.
