# Deployment

## Railway backend

Deploy the `backend` folder to Railway. The backend service includes its own `requirements.txt`, `Procfile`, and `start.sh`.

Set these Railway variables:

```text
DJANGO_DEBUG=False
SECRET_KEY=<a long random secret>
ALLOWED_HOSTS=<your-railway-domain>
CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>
CSRF_TRUSTED_ORIGINS=https://<your-railway-domain>,https://<your-vercel-domain>
```

Add a Railway Postgres database to the project and connect it to the backend service. Railway will provide `DATABASE_URL` automatically. The deployed backend requires `DATABASE_URL`; this prevents admin users and CMS content from being lost on redeploy.

After attaching Postgres, run:

```bash
python manage.py migrate
python manage.py createsuperuser
```

Local development still falls back to SQLite when `DATABASE_URL` is not set.

## Vercel frontend

Set this Vercel variable so the deployed frontend calls Railway:

```text
VITE_API_BASE_URL=https://<your-railway-domain>
```

The value may include `/api`, but it does not need to. The frontend handles both forms.

## Vercel Web Analytics

The React frontend includes `@vercel/analytics/react`. It records the initial page
view and subsequent React Router navigation. Local development uses development
mode; production builds send page views to Vercel.

1. Open the frontend project in Vercel and enable **Web Analytics** if it is not already enabled.
2. Deploy the updated frontend (including `package.json` and `package-lock.json`).
3. Visit the production site and navigate between pages.
4. Open the project's **Analytics** tab to view visitor counts, page views, referrers, countries, devices, and traffic over the selected date range.

Collection begins after the integration is deployed; previous visits are not
backfilled. Web Analytics is anonymous and does not reveal visitor names or email
addresses. It shows aggregate traffic over time rather than a named attendance log.

No Railway or Django changes are needed. If visits do not appear, check browser
content blockers and the analytics script/page-view requests in the Network tab.

Reference: https://vercel.com/docs/analytics/quickstart
