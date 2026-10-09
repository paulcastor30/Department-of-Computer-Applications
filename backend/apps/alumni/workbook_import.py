"""Read the supplied graduate workbook layouts without public copies or dependencies."""
import hashlib
import re
import unicodedata
from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET

NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PROGRAMS = {"BACHELOR OF SCIENCE IN COMPUTER APPLICATIONS": "BSCA", "MASTER OF SCIENCE IN COMPUTER APPLICATIONS": "MSCA"}


def text(value):
    return str(value or "").strip()


def key_for(program, year, family, first):
    parts = [program, str(year), family, first]
    normalized = "|".join(" ".join(unicodedata.normalize("NFKC", x).casefold().split()) for x in parts)
    return hashlib.sha256(normalized.encode()).hexdigest()


def phone(value):
    value = text(value)
    if re.fullmatch(r"\d+\.0", value):
        value = value[:-2]
    if re.fullmatch(r"9\d{9}", value):
        value = "0" + value
    return value


def rows_by_sheet(path):
    with ZipFile(path) as archive:
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            for si in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("s:si", NS):
                shared.append("".join(t.text or "" for t in si.findall(".//s:t", NS)))
        links = {r.attrib["Id"]: r.attrib["Target"] for r in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        for sheet in workbook.findall("s:sheets/s:sheet", NS):
            target = links[sheet.attrib[f"{{{REL}}}id"]]
            target = target.lstrip("/") if target.startswith("/") else "xl/" + target
            rows = []
            for row in ET.fromstring(archive.read(target)).findall("s:sheetData/s:row", NS):
                values = {}
                for cell in row.findall("s:c", NS):
                    letters = re.match(r"[A-Z]+", cell.attrib["r"])[0]
                    index = 0
                    for letter in letters:
                        index = index * 26 + ord(letter) - 64
                    value = cell.find("s:v", NS)
                    value = value.text if value is not None else ""
                    if cell.attrib.get("t") == "s":
                        value = shared[int(value)]
                    elif cell.attrib.get("t") == "inlineStr":
                        value = "".join(t.text or "" for t in cell.findall(".//s:t", NS))
                    values[index - 1] = text(value)
                if any(values.values()):
                    rows.append((int(row.attrib["r"]), values))
            yield sheet.attrib["name"], rows


def paired_flag(row, yes, no):
    y, n = marked(row.get(yes, "")), marked(row.get(no, ""))
    if y and n:
        return None  # Conflicting cells remain available in source remarks, never guessed.
    return True if y else False if n else None


def marked(value):
    return text(value).upper() in {"1", "1.0", "X", "✓", "TRUE"}


def extract_workbook(path):
    path = Path(path)
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    records = []
    for sheet, rows in rows_by_sheet(path):
        if sheet == "Computer Applications":
            meta = {index: row for index, row in rows}
            period = next((v for v in meta.get(8, {}).values() if "Quarter" in v), "")
            batch = next((v for v in meta.get(9, {}).values() if re.search(r"\b20\d{2}\b", v)), "")
            year_match = re.search(r"\b20\d{2}\b", batch)
            if not year_match:
                raise ValueError("The Computer Applications sheet has no batch year.")
            year = int(year_match[0])
            program = None
            for index, row in rows:
                family, first = row.get(0, ""), row.get(1, "")
                heading = family.upper()
                if heading.startswith(("BACHELOR OF", "MASTER OF")):
                    program = PROGRAMS.get(heading)
                    continue
                if index <= 11 or not program or not family or not first or heading.startswith(("TOTAL", "GRAND", "FAMILY")) or family.replace(".", "").isdigit():
                    continue
                remarks = " | ".join(v for column, v in sorted(row.items()) if column >= 14)
                conflicts = [label for label, a, b in [("sex", 3, 4), ("tracing status", 5, 6), ("alignment", 10, 11), ("exam", 12, 13)] if marked(row.get(a)) and marked(row.get(b))]
                if conflicts:
                    remarks += " | Conflicting source marks: " + ", ".join(conflicts)
                records.append(({"source_key": key_for(program, year, family, first), "family_name": family, "first_name": first, "program": program, "graduation_year": year, "phone": phone(row.get(2)), "sex": "M" if marked(row.get(3)) and not marked(row.get(4)) else "F" if marked(row.get(4)) and not marked(row.get(3)) else ""},
                    {"source_file": path.name, "source_sheet": sheet, "source_row": index, "source_digest": digest, "reporting_period": period,
                     "traced": paired_flag(row, 5, 6), "employed": True if marked(row.get(7)) else None, "further_study": True if marked(row.get(8)) else None, "unemployed": True if marked(row.get(9)) else None,
                     "aligned": paired_flag(row, 10, 11), "exam_passed": paired_flag(row, 12, 13), "remarks": remarks.strip(" | ")}))
        else:
            # Only roster rows explicitly identifying one of the two DCA programs.
            for index, row in rows:
                info = row.get(9, "")
                match = re.search(r"Course:\s*(.+)", info, re.I)
                program = PROGRAMS.get(match[1].strip().upper()) if match else None
                years = re.findall(r"\b20\d{2}\b", info)
                if not program or not years or not row.get(0) or not row.get(1):
                    continue
                year = int(years[-1])
                family, first = row[0], row[1]
                email = row.get(7, "")
                if email and not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
                    email = ""
                records.append(({"source_key": key_for(program, year, family, first), "family_name": family, "first_name": first, "middle_name": row.get(2, ""), "student_id": row.get(3, ""), "program": program, "graduation_year": year,
                    "graduation_period": info.split("Course:", 1)[0].replace("Graduated:", "").strip(), "permanent_address": row.get(4, ""), "phone": phone(row.get(5)), "landline": phone(row.get(6)), "email": email.lower()},
                    {"source_file": path.name, "source_sheet": sheet, "source_row": index, "source_digest": digest, "reporting_period": "Graduate roster", "remarks": info}))
    return records
