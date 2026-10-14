# Alumni Connections & Career Updates

The `/alumni` page is open for BSCA/MSCA registration using private access keys,
as requested. Email-link verification remains available when real email delivery
is configured; it is not required for access-key registration. No bulk outreach,
public directory, public stories, or automatic staff accounts are created.

## Alumni workflow

1. Create an account using an email address, full name, program/year, and fresh
   agreement to the current notice. Optional questions collect structured names,
   former student ID, graduation semester, sex, contact information and residence.
2. Record current employment, self-employment, further study, or other activity.
   Details include employer/business, title, industry, work city/country, work
   arrangement, actual duties, skills/tools, degree alignment and explanation,
   dates, concurrent study, exams/eligibility, and program feedback. Work and study
   can overlap. Dates and optional details are not inferred from blank answers.
3. Save the one-time access key in a password manager or download the private key
   file. The server stores only its password hash. Keys never appear in URLs,
   browser storage, source notes, public APIs, or normal staff record forms.
4. Return using the registered email and key. A 30-minute single-save session is
   held only in memory. Refreshing requires signing in again.
5. Choose to keep the current career activity, add a new current activity, or add
   a previous role. Career entries are appended. Historical additions do not
   replace current employment. Contact-only edits do not duplicate roles. Old
   entries show reporting dates separately from alumni-provided employment dates.
6. Network opportunities and mentoring permissions are separate optional choices.
   Public stories or disclosure to partners require separate permission.

Access-key registration proves possession of a credential, not email ownership
or alumni affiliation. Neither imported records nor matching names automatically
verify affiliation. Email verification has its own timestamp. Staff review the
person against department records separately. Changes to identity reset review.

## Long-term policy and opening

The user explicitly selected retention without automatic expiry, career history
preservation, and opening with private access keys. Migration 0007 activates these
settings and a notice describing program evaluation and alumni networking. The
contact is Paul Rodolf P. Castor, Department chairperson, at
paulrodolf.castor@g.msuiit.edu.ph. Correction/deletion requests remain possible;
indefinite retention means no automatic age-based deletion, not guaranteed storage
regardless of infrastructure or an irrevocable refusal to delete a record.

`purge_alumni_records --apply` respects indefinite retention and does not delete
accounts or career history, even if a numeric retention period is also present.
It still removes old transient email-link requests and expired sessions. Schedule
it daily on the production host. Without `--apply` it reports only counts.

## Supplied graduate files

The supplied tracer workbooks contain the Computer Applications 2024 batch,
reported in 1st Quarter 2026 and 3rd Quarter 2026. The 2025 workbook contains an
all-program roster; only explicit BSCA/MSCA rows are imported. The initial local
import contains 120 graduate records and 120 source observations (118 BSCA, 2
MSCA). Original files are unchanged and are not copied into the repository or
public website assets.

Use the private import command:

```sh
python manage.py import_alumni_workbooks /private/path/first.xlsx /private/path/second.xlsx /private/path/roster.xlsx
python manage.py import_alumni_workbooks /private/path/first.xlsx /private/path/second.xlsx /private/path/roster.xlsx --apply
```

The first command previews counts only. Imports are transactional and repeatable;
source digest/sheet/row prevents duplicate observations. Name/program/batch keys
identify source records; conflicting student IDs stop the import for private
review. Distinct people with the same name should be reconciled by staff using
student IDs before evaluation. Staff corrections are not overwritten by repeated
imports. All original reporting periods and remarks are retained. Blank marks
remain unknown; work and study flags can overlap. Numeric Philippine mobile
numbers recover their leading zero when the source is a ten-digit mobile number.
The roster's institutional `School Email` column is not substituted for a
student's `Email Address`. Other programs and total rows are excluded.

Imports do not create alumni accounts, subscriptions, messages, or verified email
claims. Staff must confirm ownership before linking a graduate source record to
an alumni account. Private source observations remain separate from self-reports.

## Staff workflow

Run `python manage.py configure_alumni_roles` after migrations to create limited
Alumni coordinators and Alumni chairperson groups. This creates no users and
assigns nobody. Give individual staff accounts only their required permissions.
Coordinators can review accounts and source records, link confirmed matches,
inspect history, and maintain opportunities. The chairperson group additionally
controls configuration, account deletion, and identity-confirmed key recovery.
Neither group grants all-site superuser or admissions-decision powers.

The private dashboard filters program, graduation year, review, career activity,
work country, alignment, further study, exams, and networking choices. Search
supports employer, role, actual duties, city, industry, and skills. It shows
self-report counts and, when authorized, source-roster linkage counts. These are
not whole-cohort employment rates. Dual-program alumni count in both programs;
work and study counts can overlap. Earlier source reports do not establish a
person's present employment without an updated response.

Private admin exports cover current alumni details, all retained career entries,
and graduate source observations. CSV responses are uncached and escape formula
prefixes. Keep exported files private; spreadsheet exports may require text import
for phone numbers or IDs with leading zeros.

For lost keys, confirm the requester against departmental records and a known
private contact. Staff with `reset_alumni_access` plus change permission select
one account and issue a replacement. The key is shown only once in an uncached
staff response; prior keys and sessions are revoked. The staff action is logged
without the key. Provide it through an agreed private channel. This feature sends
no automatic email. For deletion requests, the authorized chairperson can delete
the account; career entries and access records are removed and source links are
cleared. Separately review source-roster records if a request covers those too.

## Verification and deployment

Production requires the existing durable database, HTTPS frontend/backend,
correct origins, a non-default secret, restricted staff accounts, and database
backups consistent with the department's long-term policy. Do not expose local
SQLite files or commit graduate files, credentials, keys, or exports. Apply the
alumni migrations, import the supplied files privately on the production backend,
configure staff groups, build the frontend, and deploy both services together.
Local SQLite imports do not automatically migrate to the deployed database.

Tests use synthetic addresses and records. Full browser checks use an isolated
throwaway database, not the real imported graduate roster. No alumni were emailed.

## Tracer acceptance and remaining field test

The quick form starts with no activity selected. Alumni choose a current activity
or explicitly choose “Prefer not to say”; contact-only updates require no new
activity answer. Optional detailed questions remain collapsed. New API records
with an omitted activity retain a blank answer, separate from “Prefer not to say”.
Existing stored answers and career history are preserved. Earlier default
“Prefer not to say” responses cannot retrospectively be identified as deliberate
choices. Do not reclassify those as missing or as explicit refusals.

Staff can export an outcome summary from selected alumni accounts grouped by
program, graduation year, latest reported activity, and work-degree alignment.
Blank activity/alignment is reported separately. Alignment for non-working
respondents is marked not applicable. Both-program graduates count once in each
program; the sum is not a unique-person total. Supplied contacts, verified email
ownership, affiliation review, and contact permissions remain separate.

Graduate roster coverage export counts linked responses against the selected
roster records in each program/year. It separately counts unlinked graduates and
program/year mismatches; mismatches do not count as linked responses. Select the
complete intended cohort before using its percentage. This measures roster
linkage, not successful outreach, current reachability, whole-population employment,
or representativeness. Staff must confirm identities before linking records.
Source tracing observations remain separate from these account summaries.

### Human usability trial (pending)

Record the trial in `alumni-usability-trial.csv`; its empty rows are a worksheet,
not results. Use `alumni-campaign-plan.csv` to record department-selected coverage
targets and follow-up dates.

Recruit ten consenting alumni spanning BSCA/MSCA where available, mobile/desktop,
and different levels of technical confidence. Use a test environment and synthetic
or participant-approved information. Do not send invitations automatically.

Ask each participant to complete a basic tracer, save their access key, then
return and update one contact detail. Record elapsed time from opening the page
through saving the key, completion, help needed, confusing wording, ability to
return, device, and whether they understood the optional questions. Avoid storing
keys or personal answers in the trial notes. The 3–5-minute estimate is provisional.

Suggested stopping targets: eight of ten finish the basic task in five minutes;
nine of ten finish without help; all completed updates save accurately without
losing history or changing contact choices. If return access is a repeated
obstacle, resolve it and retest before signing off. A small usability sample is
not evidence of representative graduate outcomes or accreditation compliance.

For the tracing campaign, department staff must document intended program/year
cohorts, eligible roster counts, response targets, follow-up dates, and treatment
of nonresponse. No response-rate target is invented or automatically approved.
Use cohort coverage and outcome summaries together, with their missing-answer
counts and selection scope, when preparing quality-assurance reports.
