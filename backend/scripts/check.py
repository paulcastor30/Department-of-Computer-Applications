"""Run backend checks with an isolated database: python scripts/check.py [test labels]."""

import os
from pathlib import Path
import subprocess
import sys
import tempfile


def main():
    backend = Path(__file__).resolve().parents[1]
    with tempfile.TemporaryDirectory(prefix="dca-check-") as directory:
        environment = os.environ.copy()
        environment.update({
            "DJANGO_DEBUG": "True",
            "DATABASE_URL": "sqlite:///" + (Path(directory) / "checks.sqlite3").as_posix(),
            "SECRET_KEY": "local-checks-only-not-for-production",
            "DJANGO_SETTINGS_MODULE": "dca_site.settings",
        })
        commands = [
            ["check"],
            ["makemigrations", "--check", "--dry-run"],
            ["collectstatic", "--noinput", "--verbosity", "0"],
            ["test", *sys.argv[1:]],
        ]
        for arguments in commands:
            print("Running: python manage.py " + " ".join(arguments), flush=True)
            result = subprocess.run(
                [sys.executable, str(backend / "manage.py"), *arguments],
                cwd=backend,
                env=environment,
            )
            if result.returncode:
                return result.returncode
    return 0


if __name__ == "__main__":
    sys.exit(main())
