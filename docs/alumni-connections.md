# Alumni Connections & Career Updates

The public `/alumni` page serves BSCA and MSCA graduates, including alumni of
both programs. It includes a private update flow, learning links, department
announcements, and staff-managed opportunities. There is no public profile
directory or public career-outcome API.

## Update flow

1. Request a link using an accessible email address. The email request alone
   does not create a profile or subscribe anyone to announcements.
2. Follow the email link and explicitly confirm verification. Links expire
   after 30 minutes and can only be used once. Tokens are stored as SHA-256
   hashes; the URL fragment avoids placing tokens in server request logs.
3. A 30-minute bearer session exists only in browser memory. Refreshing requires
   a new link. Sessions authorize only the verified mailbox's own update and
   become unusable after a successful save.
4. Alumni provide name and at least one graduation year, with optional career
   details, employer/role, interests, and phone. Announcements and mentoring
   choices are separate, unchecked for new profiles, and editable later.
5. Saving requires fresh agreement to the current notice version. Email
   ownership is distinct from affiliation verification. Staff review BSCA/MSCA
   status against department records. Changes to name/degree years reset review.

Sensitive responses use `Cache-Control: no-store`. No profile details are
returned by a public GET endpoint. Browser rendering does not store tokens or
profiles in local/session storage. Limits apply by mailbox and client identity,
with an additional DRF throttle. Configure trusted proxy handling in production
and ensure the proxy sanitizes forwarded client headers.

## Department decisions and activation

The contact role is **Department chairperson**, as requested. No individual
chair email address or official retention policy has been assumed.
Public submissions start closed. In Django admin → Alumni update settings:

- Supply the chairperson's designated mailbox.
- Supply the approved privacy notice and version, stating purposes, staff
  access, correction/deletion contact, and retention.
- Set the retention period in days after the last update by the alumnus.
- Configure and test outbound SMTP using the variables in `backend/.env.example`.
  Set `ALUMNI_EMAIL_ENABLED=True` and the public frontend origin in
  `ALUMNI_PUBLIC_URL`. Do not use dummy, console, file-based, or in-memory mail
  for production. Use a durable production database and HTTPS.
- Schedule `python manage.py purge_alumni_records --apply` daily in the hosting
  scheduler before opening submissions. Running without `--apply` previews only.
  It removes stale profiles under the selected period, link-request records
  older than 48 hours, and expired sessions. It prints counts, not personal data.
- Enable “Accepting updates” once these are supplied. The API stays closed if
  notice/contact/retention or mail configuration is missing.

Tests use synthetic `example.org` addresses and in-memory mail. Local browser
verification uses a separate disposable database and file-based mail; no real
alumni or external recipients are used.

## Staff access

Give only authorized staff Django `view_alumniprofile` permission; add change
and delete permissions according to their role. Access is checked by Django
admin, not by hiding frontend links. The private dashboard filters by program,
graduation year, primary career activity, mentoring preference, and last alumni
update. BSCA/MSCA totals overlap for dual-program graduates.

The affiliation-verification action records staff reviewer and date. Career
information remains self-reported. Staff edits do not reset the alumni update
date used for retention. Do not treat respondent counts as employment rates or
a graduating-class census. There are no bulk mail/reminder sends or public
story publication features in this version.

Manage opportunities in Django admin. Only published entries appear publicly;
closed opportunities are excluded. No jobs, partnerships, or events are seeded.

Deletion/correction requests go to the chairperson via the configured mailbox.
Staff can delete the profile in admin; associated email-link requests and
update sessions are deleted automatically. Email-address changes require staff handling
and renewed ownership verification, not an unchecked form edit.

Deployment: apply the alumni migrations, configure mail/privacy settings,
build the frontend, and publish `/alumni` metadata. Existing staff accounts,
program records, and student resources remain in their existing systems.
