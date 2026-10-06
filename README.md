<div align="center">

<img src="frontend/src/assets/ccs-logo.png" alt="College of Computer Studies logo" width="96" height="96">

# Department of Computer Applications — Official Website

**Department of Computer Applications · College of Computer Studies · MSU–Iligan Institute of Technology**

A CMS-backed, accreditation-aware department website built with a **Django REST** backend and a **React + TypeScript** frontend.

[![Live Site](https://img.shields.io/badge/Live%20Site-msuiit--comapps.vercel.app-0A7C3F?style=flat-square&logo=vercel&logoColor=white)](https://msuiit-comapps.vercel.app)
[![Last Commit](https://img.shields.io/github/last-commit/paulcastor30/Department-of-Computer-Applications?style=flat-square)](https://github.com/paulcastor30/Department-of-Computer-Applications/commits/main)
[![Issues](https://img.shields.io/github/issues/paulcastor30/Department-of-Computer-Applications?style=flat-square)](https://github.com/paulcastor30/Department-of-Computer-Applications/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)
[![License](https://img.shields.io/badge/License-TBD-lightgrey?style=flat-square)](#license)

![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0-092E20?style=flat-square&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django%20REST%20Framework-A30000?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-prod-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?style=flat-square&logo=vitest&logoColor=white)

[Live Demo](https://msuiit-comapps.vercel.app) · [Report a Bug](https://github.com/paulcastor30/Department-of-Computer-Applications/issues/new) · [Request a Feature](https://github.com/paulcastor30/Department-of-Computer-Applications/issues/new) · [Deployment Guide](DEPLOYMENT.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)

---

## Overview

This repository powers the public website of the **Department of Computer Applications (DCA)** at **MSU–IIT**. It is designed to read like a formal, student-facing academic department site while giving department staff a structured, permission-controlled way to manage content, including evidence artefacts used for accreditation and quality-assurance work.

The project is developed as an **open-source, contributor-friendly codebase**. The frontend began as a polished static UI and is being migrated, page by page, to Django-backed content. Some pages are already fully dynamic; others remain placeholder-driven until their backend models land. That incremental state is expected.

### Design Principles

| Principle | What it means in practice |
| --- | --- |
| **Academic & restrained** | Formal tone, no promotional copy, no invented statistics |
| **Evidence-aware** | First-class support for accreditation evidence (AACCUP, AUN-QA, CHED COPC/COE) |
| **Editor-friendly** | Content lives in Django admin; non-developers can publish without touching code |
| **Accessible & responsive** | Semantic markup, labelled controls, mobile-first layouts |
| **Maintainable** | Small domain apps, typed API contracts, shared hooks, no clever code |

---

## Key Features

- **Headless CMS workflow**: Django admin as the editorial interface, DRF read-only endpoints for the public site.
- **Domain-driven backend**: separate apps for `core`, `academics`, `people`, `communications`, `quality`, `research`, and `extension`.
- **Role-based editorial permissions**: one command provisions the `site_admin`, `qa_editor`, `program_editor`, `faculty_editor`, `research_editor`, and `communications_editor` groups.
- **Publishable content model**: every public entity carries `slug`, `is_published`, `featured`, `sort_order`, and audit timestamps.
- **Faculty directory & profiles**: filterable by classification, programme, and expertise; profiles aggregate education, publications, projects, supervised theses, and more.
- **Programme pages**: BSCA and MSCA content (PEOs, outcomes, tracks, curriculum structure, thesis information, documents) served from the API with graceful placeholder fallback.
- **Accreditation evidence registry**: evidence documents tagged by framework and area code, linkable to programmes and faculty.
- **Site-wide search & SEO helpers**: header search, per-page `<Seo>` metadata, and breadcrumbs.
- **Flexible deployment**: split deployment (Vercel + Railway) *or* single-origin, where Django serves the built SPA.
- **Type-safe frontend**: TypeScript API types, TanStack Query hooks, and a shadcn/ui component library on Radix primitives.

---

## Architecture

The project is a monorepo with two main parts:

| Layer | Responsibility |
| --- | --- |
| **Django** (`backend/`) | Admin and content management, REST API endpoints, media, permissions, and structured accreditation evidence |
| **React + Vite** (`frontend/`) | The public-facing experience: routing, data fetching, UI, and accessibility |

The backend is configured with Django 6.0.3, Django REST Framework, and `django-cors-headers`, and is organised into domain apps (`core`, `academics`, `people`, `research`, `extension`, `communications`, `quality`). The frontend uses React Router for navigation and TanStack Query for data fetching, with scripts for development, build, linting, preview, and tests defined in `frontend/package.json`.

> [!NOTE]
> Some pages remain partially static while their backend models and APIs are being introduced. Incremental improvement is expected and welcome.

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| **Backend** | Django, Django REST Framework, `django-cors-headers` |
| **Database** | SQLite (local development), PostgreSQL (production) |
| **Frontend** | React, TypeScript, Vite, React Router, TanStack Query |
| **Styling & UI** | Tailwind CSS, Radix UI-based components (shadcn/ui) |
| **Testing** | Vitest |
| **Hosting** | Vercel (frontend), Railway (backend), or single-origin Django |

---

## Repository Structure

```text
Department-of-Computer-Applications/
├── backend/            # Django project and domain apps
├── frontend/           # React + Vite frontend
├── DEPLOYMENT.md       # Deployment guide
└── requirements.txt    # Python dependencies
```

---

## Getting Started

### Prerequisites

- **Python** 3.12
- **Node.js** and **npm**
- **Git**

### 1. Clone the repository

```bash
git clone https://github.com/paulcastor30/Department-of-Computer-Applications.git
cd Department-of-Computer-Applications
```

### 2. Run the backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

> [!TIP]
> See `frontend/package.json` for the full list of scripts, including linting, preview, and tests.

### 4. Production-style local test

To have Django serve the built frontend (single-origin mode):

```bash
cd frontend
npm run build

cd ../backend
python manage.py collectstatic --noinput
python manage.py runserver
```

---

## Deployment

Two deployment models are supported:

- **Split deployment**: frontend on Vercel, backend on Railway.
- **Single-origin**: Django serves the built SPA.

See the [Deployment Guide](DEPLOYMENT.md) for full instructions.

---

## Roadmap

- [ ] Finish wiring the first CMS-backed pages: Home, About, Programs, Faculty, News
- [ ] Expand the backend editorial workflow by role
- [ ] Strengthen documentation for setup and contribution
- [ ] Add tests for APIs and admin behaviour
- [ ] Improve deployment instructions for contributors

---

## Contributing

Contributions at all levels are welcome.

### Where to Start

| Level | Ideas |
| --- | --- |
| **Beginner** | Fix typos or improve documentation; improve placeholder text; add loading and empty states; improve accessibility labels and alt text; refine responsive spacing and layout consistency; add tests for existing views and serializers |
| **Intermediate** | Connect React pages to existing API endpoints; improve admin usability; add filters, search, and pagination; add reusable UI components; improve error handling and API hooks; add contributor-friendly setup scripts |
| **Advanced** | Design and implement new backend models; improve editorial workflow and permissions; add accreditation evidence structures; optimise query performance and serializer design; harden deployment and CI workflows; improve search architecture and observability |

If you are unsure where to begin, start with documentation, accessibility, or UI cleanup.

### Workflow

1. **Fork** the repository.
2. **Create** a feature branch.
3. **Make** one focused change at a time.
4. **Test** your change locally.
5. **Open** a pull request with a clear summary.

Suggested branch naming:

```text
feature/home-api-integration
fix/faculty-admin-filter
docs/update-readme
```

### Principles

- Keep changes focused and reviewable.
- Prefer readable code over clever code.
- Write for maintainability.
- Preserve accessibility and responsiveness.
- Document non-obvious decisions.
- Do not break existing public routes without discussion.

### Issue Labels

`good first issue` · `frontend` · `backend` · `documentation` · `accessibility` · `testing` · `help wanted`

---

## License

A license has not yet been selected for this project. Until one is added, all rights are reserved by default.

---

## Maintainers

This repository is currently maintained by the project owner ([@paulcastor30](https://github.com/paulcastor30)) and is open to community contributions.

## Thesis Process Guide

The student-facing guide is available at `/thesis-guide` for BSCA and MSCA. Process content, deadlines, checklists, document metadata and download paths are centralized in `frontend/src/content/thesisProcess.ts`. See [maintenance and document-control notes](docs/thesis-process-guide.md) before changing institutional requirements. No database or login is used.

## Homepage orientation

Beginner-facing homepage explanations and source/maintenance notes are documented in [Homepage orientation](docs/homepage-orientation.md). Actual program facts, research and student-project examples continue to use Django CMS data.

## Institutional data and CI

Department-level research, publications, conferences and extension activities are stored once in shared institutional records and linked to faculty through `FacultyContribution`. Historical faculty activity copies remain available for reconciliation; new duplicate institutional entries are disabled in admin. Qualifications, expertise and other personal profile records remain faculty-specific.

[Editor workflow, reconciliation audit/report, migration behavior and local CI commands](docs/institutional-contributions-and-ci.md) explain the transition and the required merge-check configuration.

[CI workflow](.github/workflows/ci.yml) verifies PRs targeting `main` and pushes to `main` through **frontend-quality** (install, typecheck, lint, tests, build, sharing metadata) and **backend-quality** (install, Django check, migration consistency, tests). CI verifies code; Vercel and Railway continue to deploy the application. Required branch checks must be configured separately in GitHub.
