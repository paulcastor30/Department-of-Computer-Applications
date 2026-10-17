"""Check repository Markdown links using only Python's standard library."""

from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


def without_code(text):
    return re.sub(r"^(`{3,}|~{3,}).*?^\1[^\n]*$", "", text, flags=re.M | re.S)


def anchors(path):
    text = without_code(path.read_text(encoding="utf-8"))
    result = set(re.findall(r'(?:id|name)=[\"\']([^\"\']+)[\"\']', text))
    counts = {}
    for heading in re.findall(r"^#{1,6}\s+(.+?)\s*#*\s*$", text, flags=re.M):
        heading = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", heading)
        slug = re.sub(r"[^\w\- ]", "", heading.lower()).replace(" ", "-")
        count = counts.get(slug, 0)
        result.add(f"{slug}-{count}" if count else slug)
        counts[slug] = count + 1
    return result


def main():
    paths = subprocess.check_output(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "*.md"],
        cwd=ROOT,
    ).decode().split("\0")
    errors = []
    checked = 0
    for name in sorted(set(paths) - {""}):
        source = ROOT / name
        if not source.is_file():
            continue
        checked += 1
        text = without_code(source.read_text(encoding="utf-8"))
        for match in re.finditer(r"\]\((<[^>]+>|[^\s)]+)(?:\s+[\"'][^\n]*?[\"'])?\)", text):
            destination = match[1].strip("<>")
            url = urlsplit(destination)
            if url.scheme or url.netloc:
                continue
            if url.path.startswith("/"):
                errors.append(f"{name}: use a repository-relative link: {destination}")
                continue
            target = source.parent / unquote(url.path) if url.path else source
            if not target.exists():
                errors.append(f"{name}: missing target: {destination}")
            elif url.fragment and target.suffix == ".md" and unquote(url.fragment) not in anchors(target):
                errors.append(f"{name}: missing heading: {destination}")
    for error in errors:
        print(error)
    print(f"Checked {checked} Markdown files; {len(errors)} broken local links.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
