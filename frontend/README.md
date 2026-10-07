# Frontend

React and TypeScript render the website pages. Vite runs the development server and builds the files for deployment.

Follow the [main setup instructions](../README.md#getting-started) first.

## Where to edit

- `src/pages/`: page components, grouped by section.
- `src/components/`: components used across pages.
- `src/hooks/`: functions that load API data using TanStack Query.
- `src/lib/api.ts`: the shared helper for API requests.
- `src/types/api.ts`: TypeScript definitions for API data.
- `src/test/`: tests.
- `public/`: files served directly, including downloadable documents.

## Example: the BSCA page

`src/pages/programs/BSCA.tsx` calls `usePrograms()` from `src/hooks/useAcademics.ts` to load program records from Django. It selects BSCA and passes the data to `src/pages/programs/ProgramDetailPage.tsx`, which renders the page. `programData.ts` in the same folder contains reference text used when fields are missing.

To change the shared page layout, look in `ProgramDetailPage.tsx`. To change an official program record, check the Django model and admin instead of adding a second copy of the content to the page.

## API address

For local development, copy `.env.example` to `.env.local`. It sets:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart Vite after editing it. These values are included in browser code, so do not put secrets here.

For separate frontend/backend deployments, set the backend URL in the frontend hosting environment. For a build served by Django on the same origin, leave `VITE_API_BASE_URL` empty. See [deployment instructions](../DEPLOYMENT.md).

## Checks

Run from this folder:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run check:sharing
```

`npm run test:watch` reruns tests as you edit. `npm run preview` serves the production build locally.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for submitting a change.
