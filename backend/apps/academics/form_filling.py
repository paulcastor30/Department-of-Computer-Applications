"""Fill reviewed thesis PDF templates in memory without reflowing source pages."""
from functools import lru_cache
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import unicodedata
from urllib.parse import unquote, urlsplit

from django.conf import settings
from pypdf import PdfReader, PdfWriter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

ASSETS = Path(__file__).parent / "form_templates" / "bsca"
FONTS = {"serif": ("BSCAFormSerif", "LiberationSerif-Regular.ttf"), "sans": ("BSCAFormSans", "LiberationSans-Regular.ttf")}


def assets_for(program_code="BSCA"):
    if program_code not in ("BSCA", "MSCA"):
        raise ValueError("Unsupported form collection")
    return ASSETS if program_code == "BSCA" else ASSETS.parent / "msca"


@lru_cache(maxsize=2)
def catalog(program_code="BSCA"):
    return json.loads((assets_for(program_code) / "catalog.json").read_text())


def supported_form(document):
    """Only selected original files in their own program receive this action."""
    code = document.program.code
    if code not in ("BSCA", "MSCA") or not document.is_public or document.file:
        return None
    url = urlsplit(document.url)
    if url.netloc not in ("", "msuiit-comapps.vercel.app"):
        return None
    for form_id, form in catalog(code).items():
        if unquote(url.path) == f"/thesis-forms/{code.lower()}/" + form["source_filename"]:
            return form_id if template_is_current(form_id, code) else None
    return None


def template_is_current(form_id, program_code="BSCA"):
    form = catalog(program_code)[form_id]
    assets = assets_for(program_code)
    source = assets / "originals" / form["source_filename"]
    frontend_source = settings.REPO_DIR / "frontend" / "public" / "thesis-forms" / program_code.lower() / form["source_filename"]
    if frontend_source.is_file() and sha256(frontend_source.read_bytes()).hexdigest() != form["source_sha256"]:
        return False
    pdf = assets / (form_id + ".pdf")
    return (source.is_file() and pdf.is_file()
            and sha256(source.read_bytes()).hexdigest() == form["source_sha256"]
            and sha256(pdf.read_bytes()).hexdigest() == form["pdf_sha256"])


def public_schema(form_id, program_code="BSCA"):
    form = catalog(program_code)[form_id]
    return {
        "id": form_id, "title": form["title"], "paper_size": form.get("paper_size", "A4"), "note": form.get("note", ""),
        "filename": f"{program_code}-{form_id}-filled.pdf",
        "fields": [{key: field[key] for key in ("key", "label", "max_length", "multiline", "choices") if key in field} for field in form["fields"]],
    }


@lru_cache(maxsize=2)
def register_font(style="serif"):
    name, filename = FONTS[style]
    pdfmetrics.registerFont(TTFont(name, str(ASSETS / filename)))
    return pdfmetrics.getFont(name)


class FormInputError(ValueError):
    def __init__(self, errors):
        self.errors = errors
        super().__init__("Check the highlighted entries. The original layout cannot expand.")


def _lines_for_slots(value, slots, size, multiline, font_name):
    """Wrap into existing lines only; never shrink text, clip it or move a page."""
    lines = []
    remaining = value
    for slot in slots:
        width = slot["width"] - 4
        if not remaining:
            lines.append("")
            continue
        if not multiline:
            if pdfmetrics.stringWidth(remaining, font_name, size) > width:
                raise ValueError("This entry is too wide for the original blank. Shorten it or use the blank Word form.")
            lines.append(remaining)
            remaining = ""
            continue
        # Respect explicit line breaks; wrap at spaces without breaking words.
        paragraph, separator, rest = remaining.partition("\n")
        words = paragraph.split()
        line = ""
        consumed = 0
        for word in words:
            trial = (line + " " + word).strip()
            if pdfmetrics.stringWidth(trial, font_name, size) > width:
                break
            line = trial
            consumed += 1
        if not line:
            raise ValueError("A word is too wide for the original blank. Shorten it or use the blank Word form.")
        lines.append(line)
        leftover = " ".join(words[consumed:])
        remaining = ((leftover + ("\n" if separator else "") + rest) if leftover else rest).strip()
    if remaining:
        raise ValueError("This entry needs more lines than the original form provides. Shorten it or use the blank Word form.")
    return lines


def fill_pdf(form_id, values, program_code="BSCA"):
    form = catalog(program_code)[form_id]
    if not isinstance(values, dict):
        raise FormInputError({"_form": "Enter the form details as text fields."})
    allowed = {f["key"] for f in form["fields"]}
    errors = {key: "This field is not part of this form." for key in values if key not in allowed}
    font = register_font(form.get("font", "serif"))
    font_name = font.fontName
    placements = []
    filled = False
    for field in form["fields"]:
        key = field["key"]
        raw = values.get(key, "")
        if not isinstance(raw, str):
            errors[key] = "Enter text for this field."
            continue
        value = unicodedata.normalize("NFC", raw.strip())
        if len(value) > field["max_length"]:
            errors[key] = f"Use no more than {field['max_length']} characters."
            continue
        if any(unicodedata.category(c).startswith("C") and c != "\n" for c in value):
            errors[key] = "Remove unsupported control characters."
            continue
        if not field["multiline"] and "\n" in value:
            errors[key] = "Use a single line for this field."
            continue
        if any(ord(c) not in font.face.charToGlyph for c in value if c != "\n"):
            errors[key] = "Some characters are unavailable in the form font. Use the blank Word form for this entry."
            continue
        if not value:
            continue
        if field.get("choices"):
            if value not in {choice["value"] for choice in field["choices"]}:
                errors[key] = "Choose one of the listed options."
                continue
            placements.extend((slot, "X", field["font_size"]) for slot in field["choice_slots"].get(value, []))
            filled = True
            continue
        filled = True
        flows = {}
        for i, slot in enumerate(field["slots"]):
            flows.setdefault(slot.get("flow", i + 1 if slot.get("repeat") else 0), []).append(slot)
        try:
            for slots in flows.values():
                lines = _lines_for_slots(value, slots, field["font_size"], field["multiline"], font_name)
                placements.extend((slot, text, field["font_size"]) for slot, text in zip(slots, lines) if text)
        except ValueError as error:
            errors[key] = str(error)
    if not filled and not errors:
        errors["_form"] = "Enter at least one detail, or download the blank Word form."
    if errors:
        raise FormInputError(errors)
    reader = PdfReader(assets_for(program_code) / (form_id + ".pdf"))
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    for number, page in enumerate(writer.pages):
        page_placements = [p for p in placements if p[0]["page"] == number]
        if not page_placements:
            continue
        stream = BytesIO()
        canvas = Canvas(stream, pagesize=(float(page.mediabox.width), float(page.mediabox.height)), pageCompression=1)
        for slot, text, size in page_placements:
            canvas.setFont(font_name, size)
            canvas.drawString(slot["x"] + 2, float(page.mediabox.height) - slot["baseline"], text)
        canvas.save()
        page.merge_page(PdfReader(stream).pages[0])
    output = BytesIO()
    writer.write(output)
    return output.getvalue()
