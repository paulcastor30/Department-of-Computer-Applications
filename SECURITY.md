# Security policy

## Reporting a vulnerability

Do not disclose exploitable vulnerabilities, credentials, or personal records in a public issue or pull request.

**Private security contact: pending maintainer confirmation.** Before launch, the maintainer must publish a monitored private reporting email here or enable and verify GitHub private vulnerability reporting for this repository. Neither channel is confirmed by this file. Do not assume a reporting link or email exists until it has been verified.

A private report should include the affected component or revision, a description of the impact, and minimal reproduction steps using synthetic data. Avoid accessing other people's records or disrupting the live website. Coordinate any public disclosure with the maintainer after a fix is available.

## Maintenance scope

The maintainer currently targets the latest code on `main`; there is no published support commitment for older snapshots or a response-time guarantee. The frontend and backend CI checks help detect regressions but are not a security audit.

## Contributor handling of sensitive data

Use local SQLite and a local admin account. Never commit production environment files, database backups, private accreditation evidence, completed forms, or student records. Frontend variables prefixed `VITE_` are public browser configuration and must never contain secrets. If a secret is exposed, notify the maintainer privately; deleting the current file does not remove its Git history or revoke the credential.
