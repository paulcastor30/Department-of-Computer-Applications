"""Build the versioned catalogue from the pinned upstream README; no network writes.

Usage: python scripts/import_learning_roadmap.py README.md
The original headings are retained for traceability. Symbols become text labels.
"""
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
COMMIT = "0738fcbd8fa3f3382d6958cc851829543475cdba"
SOURCE = f"https://github.com/m3y54m/Embedded-Engineering-Roadmap/blob/{COMMIT}/README.md"


def plain(value):
    return re.sub(r"[\U0001f000-\U0001ffff\u200b-\u200f\ufe0f\u2700-\u27bf]", "", value).strip()


def category(headings):
    main = headings.get(3, "")
    section = " / ".join(headings.values())
    if main in {"FPGA Development", "AUTOSAR Architecture", "Appendix-A: Advanced Topics"} or any(term in section for term in ("Automotive Protocols", "PCIe", "Functional Safety")):
        return "ADVANCED"
    if main in {"Programming Fundamentals", "Programming Languages"}:
        return "PROGRAMMING"
    if main in {"Interfaces, Protocols & Communication Technologies", "IoT (Internet of Things)"}:
        return "IOT"
    if main in {"Digital Signal Processing", "Control Theory", "Edge AI"}:
        return "DATA"
    if main in {"Operating Systems", "Debugging", "Build System", "Software Development Life Cycle (SDLC) Models", "Version Control Systems", "Testing", "Embedded Security", "IDEs", "VS Code Extensions", "PlatformIO", "Embedded GUI"}:
        return "SOFTWARE"
    if main == "Electronics":
        return "FOUNDATIONS"
    if main in {"Arduino", "Microcontrollers", "Using Test Equipment", "Prototyping Skills", "Memory Technologies & File Systems", "Hardware Simulation / Emulation", "Sensors & Actuators"}:
        return "EMBEDDED"
    return "EXPLORE"


def parse(text):
    headings, resources = {}, []
    active = False
    expected = 0
    for line in text.splitlines():
        line = line.rstrip()
        if line.startswith("## 😕"):
            active = True
        if line == "## History":
            break
        if not active:
            continue
        heading = re.match(r"^(#{2,5}) (.+)$", line)
        if heading:
            depth = len(heading[1])
            headings = {level: title for level, title in headings.items() if level < depth}
            headings[depth] = plain(heading[2])
        if not line.startswith("- ["):
            continue
        expected += 1
        match = re.match(r"^- \[(.+?)\]\((.*)\)(?:\s+-\s+.*)?$", line)
        if not match:
            raise ValueError(f"Cannot parse resource: {line}")
        title, url = plain(match[1]), match[2]
        # A Markdown link may be followed by a description; keep only its URL.
        if ") - " in url:
            url = url.split(") - ", 1)[0]
        if not urlsplit(url).scheme:
            url = "https://" + url
        if urlsplit(url).scheme not in {"http", "https"}:
            raise ValueError(f"Unsupported URL: {url}")
        kind = "Book" if "📘" in match[1] else "Video / course" if "🎞" in match[1] else "Article" if "📝" in match[1] else "Website / reference"
        path = " / ".join(title for depth, title in sorted(headings.items()) if depth >= 3)
        digest = hashlib.sha256(f"{path}|{title}|{url}".encode()).hexdigest()[:16]
        resources.append(dict(slug=f"roadmap-{digest}-{len(resources)}", title=title, url=url, topic=category(headings),
            provider=urlsplit(url).netloc.removeprefix("www."), description="", resource_type=kind,
            level="BEGINNER" if "👶" in match[1] else "ALL", access_note="Access and cost vary; check the provider.",
            source_collection="ROADMAP", source_section=path, source_url=SOURCE, start_here=False,
            sort_order=100 + len(resources), is_published=True))
    assert len(resources) == expected
    assert len({resource["slug"] for resource in resources}) == expected
    return resources


if __name__ == "__main__":
    resources = parse(Path(sys.argv[1]).read_text())
    target = ROOT / "apps/academics/data/learning-roadmap-v1.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps({"source_commit": COMMIT, "source_url": SOURCE,
        "source_title": "Embedded Systems Engineering Roadmap", "authors": "m3y54m and contributors",
        "imported_on": "2026-10-09", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
        "changes": "Regrouped into BSCA learning topics; source symbols converted to text labels; one schemeless URL prefixed with HTTPS. Original topic paths retained. The career narrative and diagram are not reproduced.",
        "notice": "The original repository does not endorse specific paid resources and is not affiliated with or financially supported by providers. Authors do not endorse this website. Licensed material is provided without warranties; linked provider materials have separate rights.",
        "resources": resources}, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported all {len(resources)} resource entries.")
