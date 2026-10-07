# Contributing

BSCA and MSCA students and graduates are welcome, including first-time contributors. You can help with documentation, accessibility, testing, bug reports, frontend work, or backend work. Choose tasks by interest and experience, rather than degree level. No university email address, student ID, transcript, or proof of graduation is required for a public contribution.

Before submitting code, check the [license status](README.md#license). The project is preparing for an open-source release; licensing is still pending. Do not assume permission to reuse institutional assets.

## Find a task and get help

Start with an issue labelled `good first issue` or `help wanted`. If none are available, open a task proposal describing a small improvement. Comment on an existing issue before starting so maintainers can help avoid duplicate work. You can ask basic questions in an issue or a draft pull request. Never post passwords, student records, or private reports there.

Discuss new features, dependencies, schema changes, and changes to official academic information before implementing them. A small documentation or bug fix can go straight to a pull request. Participation does not guarantee acceptance, academic credit, or official department endorsement.

## Set up locally

Follow the [README quick start](README.md#getting-started), then [local development notes](docs/local-development.md). You do not need production credentials, a paid hosting account, or access to the live admin. Keep your database and local credentials out of Git.

## Your first pull request

1. Sign in to GitHub and fork this repository.
2. Clone **your fork**, replacing `YOUR-USERNAME` below.

```bash
git clone https://github.com/YOUR-USERNAME/Department-of-Computer-Applications.git
cd Department-of-Computer-Applications
git remote add upstream https://github.com/paulcastor30/Department-of-Computer-Applications.git
git switch -c docs/my-first-change
```

3. Make one focused change. Use `fix/`, `feature/`, or `docs/` in branch names as appropriate.
4. Run the checks relevant to your change below. For UI work, inspect desktop and narrow-screen layouts and keyboard navigation.
5. Review your changes before committing. Ensure no local files or private data are included.

```bash
git diff
git status --short
git add path/to/changed-file
git commit -m "Describe the change"
git push -u origin docs/my-first-change
```

6. On GitHub, open a pull request from your branch to this repository's `main`. Complete the template: explain the problem, change, and verification. Link an issue if one exists; include screenshots for visible changes without personal data.
7. Open a **draft** pull request if you need help before finishing. Maintainers may request changes. Push updates to the same branch; a new pull request is unnecessary.

Before starting another task, update your fork's main branch:

```bash
git switch main
git fetch upstream
git merge --ff-only upstream/main
git push origin main
```

If Git reports a conflict or refuses the update, ask for help in your pull request before using reset or force push.

## Checks before review

For frontend changes, run from `frontend/`:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run check:sharing
```

For backend changes, activate your environment and run from `backend/`:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

If you deliberately change models, first generate and inspect migrations with `python manage.py makemigrations`, then run `python manage.py migrate`. Commit the migration files. Never edit already-applied migrations to introduce a new change.

For documentation-only changes, check links, command paths, spelling, and formatting. You do not need new tests for prose edits. For behavior changes, add or update tests that demonstrate the behavior. Explain checks you could not run and include the actual error; do not mark an unrun check as passed. GitHub CI runs frontend and backend checks on pull requests to `main`.

## Project conventions

- Preserve Django-backed content and the existing API → hook → page → component flow. See the [frontend](frontend/README.md) and [backend](backend/README.md) guides.
- Preserve accessibility, responsive layouts, and public routes. Avoid unnecessary dependencies and unrelated formatting changes.
- Do not invent accreditation, rankings, statistics, faculty details, curricula, admission rules, or thesis policies. Missing official information is “To be provided by the Department”; information needing confirmation is “To be validated by the Department”.
- Use **Undergraduate Thesis** for BSCA and **Master’s Thesis or Graduate Thesis** for MSCA. Official content changes need department validation as well as code review.
- Use synthetic local examples; never commit database dumps, completed student forms, private evidence, access tokens, or uploads containing personal data.
- Only submit material you have permission to contribute. Identify sources and third-party licensing when adding assets or copied code.
- If you use an AI assistant, review its output, verify factual claims, and run applicable checks yourself. Do not send confidential department or student data to it.

## Review and community

The repository owner, [@paulcastor30](https://github.com/paulcastor30), coordinates code review. Contributors use forks and pull requests; production access is not part of normal contribution. Maintainers decide whether a change fits the project, and authorized department reviewers validate institutional facts. A code merge does not establish academic policy approval.

Be patient while reviews are pending; no response-time guarantee is currently offered. Give specific, respectful feedback and credit contributors in merged pull requests. Follow the [code of conduct](CODE_OF_CONDUCT.md). Use the [security policy](SECURITY.md) for vulnerabilities, rather than public bug reports.
