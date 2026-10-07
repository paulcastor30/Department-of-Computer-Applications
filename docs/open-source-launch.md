# Maintainer notes before release

- Choose a license and confirm the copyright holder. MIT was suggested; no license has been applied yet.
- Check permissions for university logos, photos, forms, and third-party material.
- Add a private reporting contact to the code of conduct and security policy.
- Check tracked files and Git history for credentials or private records.
- Configure GitHub to require a pull request review and the existing `frontend-quality` and `backend-quality` checks before merging to `main`.
- Have a student try the setup from a fresh clone and record where they get stuck.

These GitHub settings have not been configured by the documentation changes. The CI workflow is in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
