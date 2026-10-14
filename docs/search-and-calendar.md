# Record search and dated activities

## Search

The header keeps page/topic matches available and adds debounced public-record search from `/api/core/search/?q=...`. Results include faculty/staff, approved expertise, programs, publications, research/conference records, student projects, community work, announcements, learning resources and public forms. Search requires two characters, accepts at most 160 characters, matches all words and limits results. It never searches approval references, editorial/source notes, alumni submissions or student evaluation records.

Publication changes are reflected by Django. Faculty specialization search uses the same visibility boundary as the public directory. Form results link to actual record anchors; closed document sections open when reached. Learning-resource results select the matching catalogue title. API failures retain page matches and a retry control.

## Events and deadlines

`/news/events` is a dedicated upcoming/ongoing and past-date view, backed by `/api/communications/events/?view=upcoming&kind=all`. Supported kinds are `events`, `deadlines`, `conferences`, and `all`. Philippine local dates determine whether an entry is upcoming, ongoing or past.

Django NewsPost admin includes actual start/end dates, optional Philippine activity time, deadline date, location and supplied activity status. Calendar dates are never inferred from publication dates or reporting years. Dates can be attached to an existing announcement without creating a duplicate record. End dates cannot precede start dates; an activity time requires a date. Missing times stay omitted. Cancelled/postponed entries retain their supplied status.

Published research conference records appear in a distinct `Research conference dates` category and link to their paper records. Withdrawn records are excluded. This category does not label conferences as department-hosted events or assert attendance.

The page is linked from announcements, the homepage and footer. Existing undated announcements remain visible in news and are omitted from the calendar. No new event dates or deadlines were seeded.

## Deployment

Deploy the Django changes and run `python manage.py migrate` before deploying the frontend that calls the new search/events endpoints. The communications migration adds optional fields without changing existing reports. The academics migrations record the explicit 2026-10-15 authorization of the existing SOJT guide text, as described in `sojt-process-guide.md`.

Checks cover publication/private-data boundaries, query limits, form destinations, actual dates, ongoing/today deadlines, cancellation, withdrawn conferences, filtering, empty/error states and search keyboard navigation.
