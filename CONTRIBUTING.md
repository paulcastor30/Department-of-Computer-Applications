# Contributing

BSCA and MSCA students and graduates are welcome. You do not need to know the whole project to make your first change.

## Choose a change

Start with a problem you can describe: an unclear instruction, a broken link, a page that does not fit your phone, or a bug you can reproduce. Check [existing issues](https://github.com/paulcastor30/Department-of-Computer-Applications/issues) to see whether someone is already working on it.

If you need help choosing, open an issue and tell us what you would like to work on. For a larger feature, explain your idea in an issue before writing the code.

## Get your own copy

On GitHub, click **Fork** on this repository. A fork is a copy under your account where you can save your changes.

Clone your fork, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR-USERNAME/Department-of-Computer-Applications.git
cd Department-of-Computer-Applications
```

You have already cloned the repository. Continue with [running the backend](README.md#2-run-the-backend), then run the frontend in a second terminal.

Create a branch for your change. A branch keeps this work separate from `main`:

```bash
git switch -c fix/describe-your-change
```

## Find the code

Use the [task and file map](docs/README.md#find-the-right-file) to find the part you need. The [frontend](frontend/README.md) and [backend](backend/README.md) guides explain how those files work together.

Keep your first pull request to one change so it is easier to explain and review. For content managed in Django, edit the local admin records to try the change; do not add duplicate records to React.

## Check your change

| Changed files | Run | Folder |
| --- | --- | --- |
| Documentation | `python scripts/check_docs.py`, then read the edited instructions | Repository root |
| Frontend code or dependencies | `npm run check` | `frontend/` |
| Backend code or dependencies | `python scripts/check.py` with your Python environment active | `backend/` |
| Visible page behavior | Build, then `npm run test:e2e`; also check keyboard use and a narrow screen | `frontend/` |

The [testing guide](docs/testing.md) explains browser installation, visual comparisons, focused tests, and migrations. If a check fails and you need help, include the error in a draft pull request.

## Send your change for review

Check which files changed, then save and upload your work. Replace `path/to/changed-file` with the file you edited; repeat `git add` for each file you want to include.

```bash
git diff
git status --short
git add path/to/changed-file
git commit -m "Describe what you changed"
git push -u origin fix/describe-your-change
```

On GitHub, open your fork and click **Compare & pull request**. Set the destination to this repository's `main` branch. A pull request asks the maintainer to review and merge your change.

Explain what was wrong, what you changed, and how you checked it. Add a screenshot if the page looks different. You can open a **draft pull request** to ask for help with unfinished work.

If the reviewer asks for an update, edit the files, commit, and push to the same branch. The existing pull request will update automatically.

## Keep your fork up to date

Do this with a clean working tree before starting another change. Add the original repository once:

```bash
git remote add upstream https://github.com/paulcastor30/Department-of-Computer-Applications.git
```

Then update your local `main` and fork:

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

Start a new branch for the next change. If the fast-forward merge fails, stop and ask for help; keep your commits intact. After a pull request is merged, see [branch cleanup](docs/maintenance.md#after-a-pull-request-is-merged).

## Working with department content

Get department confirmation before changing admission rules, curricula, thesis requirements, accreditation claims, or other official information. Keep content that is managed in Django connected to Django.

Use **Undergraduate Thesis** for BSCA and **Master’s Thesis or Graduate Thesis** for MSCA. Follow AGENTS.md for public-content and verification rules.

Keep passwords, student records, completed forms, and database backups out of commits and screenshots. Check permission before adding someone else's code, photos, or documents.
