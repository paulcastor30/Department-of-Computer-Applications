# Alumni location reference snapshot

`location-options.json` is served by Django through the alumni configuration API.
It contains reference choices, not alumni records. Snapshot retrieved 2026-10-15.

- Philippine names/codes: https://psgc.cloud/api/provinces,
  https://psgc.cloud/api/cities-municipalities, https://psgc.cloud/api/regions.
  Provider documentation: https://psgc.cloud/api-docs. Underlying public
  classification: https://psa.gov.ph/classification/psgc (PSA, CC BY 4.0).
- Country/territory English names: Unicode CLDR territories.json,
  https://github.com/unicode-org/cldr-json/tree/main/cldr-json/cldr-localenames-full/main/en.
  Unicode License: https://www.unicode.org/license.txt.

Transformation retains province/city names, removes Manila sub-municipalities,
trims surrounding whitespace, sorts names and groups NCR cities under Metro Manila and other cities without a province-code parent
under Cities outside provinces. It does not infer a province for independent cities. Country
choices retain two-letter territory entries, excluding aggregate and pseudo-region
codes. No codes, locations or alumni addresses are inferred or auto-populated.

PSA's direct spreadsheet download was blocked (HTTP 403). PSGC Cloud's snapshot
is not claimed to be the latest 2026 PSA publication: its region list and some
counts differ from PSA's current release. Selection groups do not reproduce the provider's older regional hierarchy. Retain the unlisted-city and
other-country controls and reconcile this snapshot against a newer downloadable
PSA file when available. Do not overwrite existing alumni answers during updates.

The form makes no live calls to these third parties and sends them no alumni data.
Existing nonmatching country/city/semester answers remain selectable unchanged.
