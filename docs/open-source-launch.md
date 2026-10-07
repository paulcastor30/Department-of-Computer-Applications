# Open-source launch checklist

This checklist records work still needed outside the contributor documentation. A prepared repository is not confirmation that its license, private reporting channels, or GitHub settings have been activated.

## Release decisions

- [ ] Confirm who owns the original code and who can authorize its release.
- [ ] Choose an open-source license; MIT is the [proposed option](license-proposal.md). Add the approved license with the correct copyright holder, then update README license wording and badge.
- [ ] Audit permissions for logos, photographs, prospectuses, university forms, and third-party code/assets. Record verified ownership and separate terms in an asset notice; do not claim blanket permissions without evidence.
- [ ] Publish a monitored conduct-reporting email and responsible handler in CODE_OF_CONDUCT.md, plus an alternate contact for complaints involving that handler.
- [ ] Publish a monitored security email in SECURITY.md or enable and verify GitHub private vulnerability reporting.
- [ ] Review tracked files and Git history for credentials and private data. Rotate exposed credentials if found. This documentation change does not certify the history is clean.

## GitHub configuration

An administrator must apply and verify these settings on GitHub:

- [ ] Confirm repository visibility and the intended institutional/personal owner.
- [ ] Enable Issues. Add `good first issue`, `help wanted`, `frontend`, `backend`, `documentation`, `accessibility`, and `testing` labels.
- [ ] Protect `main` with pull requests, at least one approving review, resolved review conversations, and required checks `frontend-quality` and `backend-quality`.
- [ ] Prevent routine direct pushes, force pushes, and branch deletion; review any administrator bypass separately.
- [ ] Keep production credentials unavailable to untrusted fork contributions. Review preview/deployment behavior before allowing outside contributions.
- [ ] Confirm the issue and pull request templates appear after they reach the default branch.

The workflow already defines the required checks. Documentation cannot activate branch protection. Do not add a `pull_request_target` workflow that executes untrusted contributor code with secrets.

## Pilot and maintain

- [ ] Have a student follow the quick start from a fresh clone without production access.
- [ ] Publish the five reviewed [starter issue drafts](starter-issues.md), checking they are still relevant and not duplicates.
- [ ] Identify a reviewer for each task and agree a realistic review routine. Avoid promising a response time the team cannot sustain.
- [ ] Confirm who validates official department information; code review does not replace content approval.
- [ ] Invite a small pilot group, record setup obstacles, and improve the guide before a wider announcement.
