# Confirmed decisions — Apple Rose B. Alce

Department owner confirmation in this chat, 9 October 2026:

- Bachelor’s completion year: **2017**.
- Master of Science in Computer Applications completion year: **2020**.
- Public expertise, in supplied order: **Embedded Systems**; **Internet of Things (IoT)**; **Machine Learning (ML)**; **Artificial Intelligence of Things (AIoT)**.

## Implemented scope

Migration `0016_alce_confirmed_education_and_expertise` targets the existing Alce profile by institutional email, with exact full-name fallback and an ambiguity guard. It updates only the audited bachelor’s and MSCA title/institution variants to the confirmed years. It neither creates education entries nor deletes, merges, reclassifies, renames or changes publication flags on education records. Both suspected MSCA entries remain separate pending identity confirmation. PhD entries remain untouched.

The migration sets the four supplied expertise areas as the public expertise list and as newline-separated specialization text. The old live expertise title `asdf` is retained internally with publication disabled. Other expertise types (e.g., research interests), other faculty and unrelated profile content are preserved. The four confirmed expertise titles are maintained idempotently.

## Before / after and application status

- Local education ID 3: 2017 → 2017 (already correct).
- Local education ID 2: 2020 → 2020 (already correct).
- Local specialization text: comma-separated versions of the same four areas → one area per line.
- Local structured expertise: no entries → four confirmed published entries.
- Expected production education ID 3: 2016 → 2017.
- Expected production education ID 2: 2021 → 2020.
- Expected production education ID 5: 2020 → 2020 (already correct).
- Expected production expertise ID 1 (`asdf`): published → internal/unpublished; four confirmed public expertise entries added or reused.

Production changes have **not** been applied or deployed. Production IDs are evidence references, not hardcoded migration targets; recheck current CMS data before deployment. The source snapshot and exact-source evidence tables remain historical audit evidence and are not rewritten to pretend the older values never existed.

The full-site compact redesign, institution/title normalization, suspected duplicate consolidation, Alce’s doctoral status, legacy `vbv` background and all other faculty corrections remain pending approval. No unconfirmed qualification is corrected by inference.

Local migration applied successfully. Verified all 65 local education rows against the audit snapshot: unchanged (the local bachelor’s and MSCA years were already correct). Four published expertise entries now exist in the supplied order. Django system checks, all 17 people tests, migration consistency and whitespace checks passed. No frontend code was changed.

## Approved wording update

The owner requested “Ongoing” instead of “Ongoing study; degree not yet completed.” Migration 0017 shortens only that exact existing note, without changing qualification status, dates, publication flags, or unknown doctoral records. Applied locally to Alce and Caparida (two notes). The public group heading is also changed from “Ongoing study” to “Ongoing.” The original import migration and audit evidence remain unchanged. Production is not deployed. All 18 people tests and Django system checks passed.
