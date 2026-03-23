# Frontend README

This folder contains the **React frontend** for the Department of Computer Applications website.

The frontend is responsible for:

- the public facing website experience
- responsive layout and navigation
- page templates and reusable UI components
- API integration with the Django backend
- fast, readable, student friendly presentation

## Current stack

The frontend uses Vite with React and TypeScript, with scripts for `dev`, `build`, `build:dev`, `lint`, `preview`, `test`, and `test:watch` already defined in `package.json`. It also includes React Router, TanStack Query, Tailwind CSS, Vitest, and a Radix based component ecosystem.【turn663442view0†L0-L0】

## Frontend goals

This site should be:

- modern and professional
- warm and welcoming
- fast to scan
- accessible and responsive
- credible for academic and accreditation contexts
- easy for contributors to extend without rewriting the whole app

## Local setup

From the `frontend` folder:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run build:dev
npm run lint
npm run preview
npm run test
```

## Suggested frontend structure

```text
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   └── assets/
├── public/
├── package.json
└── vite.config.ts
```

## Frontend architecture direction

The preferred pattern in this project is:

- reusable layout and section components
- one shared API helper
- app specific hooks for backend data
- page by page replacement of hardcoded content
- React Query for data fetching and caching

Typical flow:

```text
Django API -> frontend hook -> page component -> reusable UI sections
```

## Contribution ideas

### Good first issues
- improve spacing and alignment
- refine mobile responsiveness
- add loading, empty, and error states
- improve accessibility and semantics
- update placeholder imagery and alt text
- clean up minor UI inconsistencies

### Intermediate issues
- connect pages to live API endpoints
- improve search and filtering UX
- add reusable content cards and evidence blocks
- improve page level metadata and breadcrumbs
- add test coverage for shared components and hooks

### Advanced issues
- refactor large pages into smaller sections
- improve data fetching patterns and cache strategy
- optimize bundle size and image loading
- improve route level code organization
- build a stronger design token and theme system

## Frontend contribution rules

- do not rewrite whole pages unless necessary
- prefer incremental replacement of static placeholders
- keep existing routes stable when possible
- use shared hooks and helpers instead of repeated raw `fetch` calls
- keep accessibility in scope for every UI change
- preserve the visual direction of a modern academic website

## Recommended integration order

When connecting backend data, do it incrementally:

1. Home
2. About
3. Programs
4. Faculty
5. News and Events
6. Research later, after backend models are ready

This keeps the site usable while the backend evolves.

## Testing mindset

Frontend changes should be checked for:

- layout integrity on mobile and desktop
- accessible headings and labels
- graceful behavior when API data is empty
- consistent typography and color usage
- no broken internal links

## Notes for contributors

This frontend started from a strong static UI foundation and is being migrated toward a CMS backed experience. That means not every page is fully dynamic yet, and that is expected. Useful contributions include both visual polish and data integration.
