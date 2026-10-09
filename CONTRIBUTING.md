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

Follow the [setup instructions](README.md#getting-started) to run the website.

Create a branch for your change. A branch keeps this work separate from `main`:

```bash
git switch -c fix/describe-your-change
```

## Find the code

For a page change, start in `frontend/src/pages/`. For example, the BSCA page is `frontend/src/pages/programs/BSCA.tsx`; it uses the shared layout in `ProgramDetailPage.tsx` beside it.

For a backend change, start in the relevant folder under `backend/apps/`. For example, program records are defined in `backend/apps/academics/models.py`. The [frontend](frontend/README.md) and [backend](backend/README.md) guides explain the other files.

Keep your first pull request to one change so it is easier to explain and review.

## Check your change

For documentation, read the edited text and check its links and commands.

For frontend code, run these from `frontend/`:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run check:sharing
```

These check TypeScript errors, code rules, tests, the production build, and page-sharing metadata. For a visible change, also check the page on a narrow screen and try its controls with the keyboard.

For backend code, activate your Python environment and run these from `backend/`:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

These check Django configuration, missing migration files, and backend tests. If you changed a model, run `python manage.py makemigrations` and `python manage.py migrate` first, then include the new migration in your submission.

If a check fails and you cannot work out why, include the error in your pull request and ask for help.

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

## Working with department content

Get department confirmation before changing admission rules, curricula, thesis requirements, accreditation claims, or other official information. Keep content that is managed in Django connected to Django.

Use **Undergraduate Thesis** for BSCA and **Master’s Thesis or Graduate Thesis** for MSCA. Follow AGENTS.md for public-content and verification rules.

Keep passwords, student records, completed forms, and database backups out of commits and screenshots. Check permission before adding someone else's code, photos, or documents.
