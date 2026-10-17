# Department of Computer Applications website

Website for the Department of Computer Applications, College of Computer Studies, MSU–Iligan Institute of Technology.

[Visit the website](https://msuiit-comapps.vercel.app) · [Report a problem or ask a question](https://github.com/paulcastor30/Department-of-Computer-Applications/issues)

BSCA and MSCA students and graduates are welcome to contribute. You can fix a bug, improve a page, write a test, or help explain the setup. You can use any email address for your GitHub account.

## How it works

The site has two parts. React displays the pages in the browser. Django stores content, provides the API that React reads, and lets staff edit records through Django admin. Some pages also use reference text stored in the frontend.

- `frontend/`: React, TypeScript, and Vite. Pages are in `src/pages/`; shared components are in `src/components/`.
- `backend/`: Django and Django REST Framework. Models, admin screens, and APIs are grouped under `apps/`.
- `docs/`: [task guides and a file map](docs/README.md). Earlier reviews are in `docs/archive/`.
- `scripts/`: repository checks; backend and frontend scripts live with their applications.

## Getting Started

### Prerequisites

- **Python 3.12** (repository pin: 3.12.13)
- **Node.js 22** and **npm**, matching CI (`.nvmrc` is included for nvm users)
- **Git** and a GitHub account to submit contributions

You can run the website on your own computer with SQLite. You do not need a hosting account.

### 1. Clone the repository

```bash
git clone https://github.com/paulcastor30/Department-of-Computer-Applications.git
cd Department-of-Computer-Applications
```

To submit changes, clone your own fork instead; see [how to get your own copy](CONTRIBUTING.md#get-your-own-copy).

### 2. Run the backend

```bash
cd backend
python -m venv .venv
```

If your system has no `python` command, use `python3` on macOS/Linux or `py -3.12` on Windows to create the environment. After activation, use `python` as shown below.

Activate the environment using the command for your shell:

```bash
# macOS / Linux
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies, create the database tables, and start Django:

```bash
python -m pip install -r requirements.txt -c constraints-ci.txt
python manage.py migrate
python manage.py check
python manage.py runserver
```

Backend: `http://127.0.0.1:8000`. Public API: `http://127.0.0.1:8000/api/academics/programs/`.
For local admin access, run `python manage.py createsuperuser` and open `http://127.0.0.1:8000/admin/`.

The backend reads shell environment variables; it does not automatically load `.env`. Its existing `.env.example` describes production configuration. See [local development notes](docs/local-development.md) if production variables are already set in your terminal.

### 3. Run the frontend

In a second terminal, from the repository root:

```bash
cd frontend
npm ci
```

Copy the file that tells the frontend where Django is running:

```bash
# macOS / Linux
cp .env.example .env.local
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env.local
```

```bash
npm run dev
```

Open `http://localhost:8080`. Keep Django running in the first terminal. Restart Vite after changing `.env.local`; `VITE_` variables are public and must never contain secrets.

Your local database has some reference content from migrations, but will differ from the live website. For setup problems, see [troubleshooting](docs/local-development.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the steps to submit your first change. If you are stuck, [open an issue](https://github.com/paulcastor30/Department-of-Computer-Applications/issues/new) with what you tried and the error you saw.

For code details, see the [frontend guide](frontend/README.md) or [backend guide](backend/README.md). The [code of conduct](CODE_OF_CONDUCT.md) covers discussions and reviews. See [SECURITY.md](SECURITY.md) for security reports.

## Find your next step

| Task | Guide |
| --- | --- |
| Find the files for a change | [Documentation and file map](docs/README.md) |
| Check your work | [Testing](docs/testing.md) |
| Fix a setup problem | [Local development](docs/local-development.md) |
| Maintain branches | [Branches and releases](docs/maintenance.md) |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel/Railway deployment. To serve the frontend through Django locally, see [local development](docs/local-development.md#serving-the-frontend-through-django).

## License

A license has not been selected yet. The code is not currently released under an open-source license. Permissions for university logos, photos, forms, and other supplied materials also need to be confirmed.

## Maintainer

[@paulcastor30](https://github.com/paulcastor30)

Remaining release decisions are listed in [maintainer notes](docs/open-source-launch.md).
