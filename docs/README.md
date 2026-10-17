# Documentation

New here? Follow the [setup](../README.md#getting-started), then [make your first contribution](../CONTRIBUTING.md). You only need the feature guide for the part you are changing.

## Find the right file

Paths below start at the repository root.

| I want to change… | Start here | Read when needed |
| --- | --- | --- |
| A page layout or component | `frontend/src/pages/`, `frontend/src/components/` | [Frontend guide](../frontend/README.md) |
| Menus, footer links, or search destinations | `frontend/src/content/siteContent.ts`, `frontend/src/components/layout/` | [Navigation](information-architecture.md) |
| A URL or page route | `frontend/src/App.tsx` | Preserve existing public URLs |
| Colors, typography, or spacing | `frontend/src/index.css`, `frontend/tailwind.config.ts` | Reuse existing shared components |
| Program content or curriculum records | Django admin; `backend/apps/academics/` for code | [Publication controls](content-publication-controls.md) |
| Faculty profiles or education | Django admin; `backend/apps/people/` for code | [Content standards](../AGENTS.md), [shared activities](institutional-contributions.md) |
| News, events, or record search | `backend/apps/communications/`, `backend/apps/core/search.py` | [Search and calendar](search-and-calendar.md) |
| Program and thesis form tools | `frontend/src/components/ProgramForms.tsx`, `backend/apps/academics/form_filling.py` | [Program forms](bsca-form-filling.md), [Registrar forms](registrar-form-filling.md) |
| Shifting or transfer evaluation | `frontend/src/pages/TransferEvaluationPortal.tsx`, `backend/apps/academics/evaluation_views.py` | [Evaluation workflow](transfer-evaluation.md) |
| Alumni forms and reports | `frontend/src/components/AlumniTraceForm.tsx`, `backend/apps/alumni/` | [Alumni workflow](alumni-connections.md) |
| Tests or CI | `frontend/src/test/`, `frontend/e2e/`, `backend/apps/*/test*.py`, `.github/workflows/` | [Testing](testing.md) |

## Feature and content guides

- [Local development and troubleshooting](local-development.md)
- [Homepage](homepage-orientation.md)
- [Thesis guide](thesis-process-guide.md) and [SOJT guide](sojt-process-guide.md)
- [Learning resources](learning-resources.md)
- [Department staff access](department-staff-access.md)
- [Content publishing and source notes](website-publishing.md)

## Maintaining the repository

- [Deployment](../DEPLOYMENT.md)
- [Branches and releases](maintenance.md)
- [Outstanding release decisions](open-source-launch.md)
- [Historical reviews and evidence](archive/README.md)

The archive preserves earlier observations and decisions. Use current guides and source code for implementation; an old test count or deployment note does not describe today's state.
