# Embedded Systems & IoT Learning Resources

Resources and Current Students share `/resources#learning-resources`. Django
stores a searchable catalogue with three starter cards and 24 results per page.
Topic groupings support independent study, not a required BSCA course sequence.
IoT/connectivity, programming, devices, software quality, data/AI, foundations,
projects, and optional specialist topics are all visible.

## Imported collection and license

All 788 bullet-linked resource entries between the upstream “Don't Know Where
to Start” and “History” headings are retained, including repeated listings.
Source commit: `0738fcbd8fa3f3382d6958cc851829543475cdba`; imported 2026-10-09.
The original diagram, career narrative, third-party quoted definitions, and
prose are not reproduced. This is a BSCA adaptation of the resource collection.

`backend/apps/academics/data/learning-roadmap-v1.json` is frozen migration
input. Do not edit it after deployment; use a new version and migration for
updates. `backend/scripts/import_learning_roadmap.py` parses the pinned README,
verifies that no bullet-linked entries were skipped, retains source topics,
and adds an HTTPS prefix to one source URL that lacked a scheme.

The adapted collection and accompanying additions to it are CC BY-SA 4.0.
The UI identifies authors, source version, changes, original disclaimer,
license, and reuse scope. Downloadable collection, attribution, and full license
are in `frontend/public/learning-resources/`. Linked books/courses remain at
their providers and have separate rights. The notice does not relicense
university branding or unrelated website content.

## Staff editing and updates

Use Academics → Learning resources in Django admin. “Is published” controls
public access; drafts are excluded from the read-only API. Retain ROADMAP,
source section, source link, and attribution when editing imported entries.
Titles containing “engineering” identify actual provider resources, not the
department degree. “Start here” highlights selected starter entries.

Imported beginner labels reflect the upstream curator. Prices, prerequisites,
language, and link availability have not all been independently checked.
Review them before assigning a resource to students. The UI states the import
date and advises checking provider access conditions.

The downloadable JSON is the initial adapted snapshot, not a live export of
admin edits. Update the download and change notes when revising the collection.
Deployment requires migrations 0032–0036 and the frontend update.
