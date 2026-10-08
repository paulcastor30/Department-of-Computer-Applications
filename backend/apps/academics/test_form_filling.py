from hashlib import sha256
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.conf import settings
from django.db import connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext
from pypdf import PdfReader
from rest_framework.test import APIClient

from .form_filling import ASSETS, assets_for, catalog, fill_pdf, FormInputError, supported_form, template_is_current
from .models import Program, ProgramDocument
from .serializers import ProgramDocumentSerializer


class BSCAFormFillingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.program, _ = Program.objects.update_or_create(code="BSCA", defaults={"title": "BSCA", "slug": "bsca", "is_published": True})
        self.documents = {}
        for form_id, form in catalog().items():
            self.documents[form_id], _ = ProgramDocument.objects.update_or_create(
                program=self.program, url="/thesis-forms/bsca/" + form["source_filename"],
                defaults={"title": form["title"], "is_public": True, "form_group": "PROPOSAL"},
            )

    def test_scope_and_template_integrity_for_all_eleven_forms(self):
        self.assertEqual(len(catalog()), 11)
        for form_id, form in catalog().items():
            with self.subTest(form=form_id):
                self.assertTrue(template_is_current(form_id))
                self.assertEqual(supported_form(self.documents[form_id]), form_id)
                self.assertEqual(ProgramDocumentSerializer(self.documents[form_id]).data["fillable_form_id"], form_id)
                original = settings.REPO_DIR / "frontend/public/thesis-forms/bsca" / form["source_filename"]
                self.assertEqual(sha256(original.read_bytes()).hexdigest(), form["source_sha256"])
        graduate, _ = Program.objects.update_or_create(code="MSCA", defaults={"title": "MSCA", "slug": "msca", "is_published": True})
        document = ProgramDocument(program=graduate, url=self.documents["019"].url)
        self.assertIsNone(supported_form(document))
        document.program = self.program
        document.url = "https://example.org" + document.url
        self.assertIsNone(supported_form(document))

    def test_schema_and_download_only_for_public_documents(self):
        response = self.client.get("/api/academics/forms/bsca/019/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["paper_size"], "A4")
        self.assertNotIn("slots", response.data["fields"][0])
        self.documents["019"].is_public = False
        self.documents["019"].save()
        # Seeded documents can share the same canonical URL on existing databases.
        ProgramDocument.objects.filter(program=self.program).exclude(pk=self.documents["019"].pk).delete()
        self.assertEqual(self.client.get("/api/academics/forms/bsca/019/").status_code, 404)
        self.assertEqual(self.client.post("/api/academics/forms/bsca/019/", {"student_1": "Maria Santos"}, format="json").status_code, 404)
        self.assertEqual(self.client.get("/api/academics/forms/bsca/999/").status_code, 404)

    def test_download_preserves_page_content_geometry_and_embeds_entry_font(self):
        for form_id, form in catalog().items():
            with self.subTest(form=form_id):
                field = form["fields"][0]
                source = PdfReader(ASSETS / (form_id + ".pdf"))
                response = self.client.post(f"/api/academics/forms/bsca/{form_id}/", {field["key"]: "Maria Santos"}, format="json")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response["Content-Type"], "application/pdf")
                self.assertEqual(response["Cache-Control"], "private, no-store")
                self.assertIn("attachment;", response["Content-Disposition"])
                result = PdfReader(BytesIO(response.content))
                self.assertEqual(len(source.pages), len(result.pages))
                for before, after in zip(source.pages, result.pages):
                    for old, new in zip(list(before.mediabox) + list(before.cropbox), list(after.mediabox) + list(after.cropbox)):
                        self.assertAlmostEqual(float(old), float(new), places=5)
                    self.assertTrue(after.extract_text().startswith(before.extract_text()))
                self.assertIn("Maria Santos", " ".join(page.extract_text() for page in result.pages))
                fonts = result.pages[field["slots"][0]["page"]]["/Resources"]["/Font"].values()
                self.assertTrue(any("/FontFile2" in font.get_object().get("/FontDescriptor", {}) for font in fonts))

    def test_two_page_forms_repeat_names_and_titles(self):
        for form_id in ("020", "023"):
            result = PdfReader(BytesIO(fill_pdf(form_id, {"student_name": "Maria Santos", "thesis_title": "Environmental Monitoring"})))
            for page in result.pages:
                self.assertIn("Maria Santos", page.extract_text())
                self.assertIn("Environmental Monitoring", page.extract_text())

    def test_invalid_inputs_are_rejected_without_clipping_or_layout_changes(self):
        for values in [{}, [], {"student_1": 12}, {"student_1": "W" * 60}, {"student_1": "A\nB"},
                       {"student_1": "A\x00B"}, {"student_1": "😀"}, {"student_1": "A" * 61}, {"approval": "Approved"}]:
            with self.subTest(values=values), self.assertRaises(FormInputError):
                fill_pdf("019", values)
        response = self.client.post("/api/academics/forms/bsca/019/", {"student_1": "W" * 60}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_1", response.data["fields"])

    def test_long_titles_use_existing_lines_and_overflow_is_rejected(self):
        title = "An Embedded System for Classroom Environmental Monitoring and Automated Ventilation"
        result = PdfReader(BytesIO(fill_pdf("020", {"thesis_title": title})))
        for page in result.pages:
            self.assertIn("Automated Ventilation", page.extract_text())
        with self.assertRaises(FormInputError):
            fill_pdf("020", {"thesis_title": "W" * 200})

    def test_generation_does_not_write_student_details_to_database_or_templates(self):
        snapshots = {file: file.read_bytes() for file in ASSETS.rglob("*") if file.is_file()}
        with CaptureQueriesContext(connection) as queries:
            response = self.client.post("/api/academics/forms/bsca/019/", {"student_1": "Private Student Name"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(any(query["sql"].split()[0] in ("INSERT", "UPDATE", "DELETE") for query in queries))
        for file, data in snapshots.items():
            self.assertEqual(file.read_bytes(), data)

    def test_backend_only_deployment_keeps_templates_available(self):
        with TemporaryDirectory() as root, self.settings(REPO_DIR=Path(root)):
            self.assertTrue(template_is_current("019"))

    def test_changed_original_disables_the_fill_action(self):
        with TemporaryDirectory() as root:
            original = Path(root) / "frontend/public/thesis-forms/bsca" / catalog()["019"]["source_filename"]
            original.parent.mkdir(parents=True)
            original.write_bytes(b"different form version")
            with self.settings(REPO_DIR=Path(root)):
                self.assertIsNone(supported_form(self.documents["019"]))


class MSCAFormFillingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.program, _ = Program.objects.update_or_create(code="MSCA", defaults={"title": "MSCA", "slug": "msca", "is_published": True})
        self.documents = {}
        for form_id, form in catalog("MSCA").items():
            self.documents[form_id], _ = ProgramDocument.objects.update_or_create(
                program=self.program, url="/thesis-forms/msca/" + form["source_filename"],
                defaults={"title": form["title"], "is_public": True, "form_group": "PROPOSAL"},
            )

    def test_exact_ten_forms_and_program_isolation(self):
        self.assertEqual(set(catalog("MSCA")), {"017", "019", "020", "021", "022", "023", "024", "025", "ccs-13", "ccs-14"})
        for form_id, document in self.documents.items():
            self.assertTrue(template_is_current(form_id, "MSCA"))
            self.assertEqual(ProgramDocumentSerializer(document).data["fillable_form_id"], form_id)
            form = catalog("MSCA")[form_id]
            original = settings.REPO_DIR / "frontend/public/thesis-forms/msca" / form["source_filename"]
            self.assertEqual(sha256(original.read_bytes()).hexdigest(), form["source_sha256"])
        other, _ = Program.objects.update_or_create(code="BSCA", defaults={"title": "BSCA", "slug": "bsca"})
        document = ProgramDocument(program=other, url=self.documents["019"].url, is_public=True)
        self.assertIsNone(supported_form(document))
        document.program = self.program
        document.url = "/thesis-forms/msca/FORM 018 Request for Change of Adviser Panel Member.docx"
        self.assertIsNone(supported_form(document))
        self.assertEqual(self.client.get("/api/academics/forms/msca/018/").status_code, 404)
        self.assertEqual(self.client.get("/api/academics/forms/bsca/ccs-13/").status_code, 404)

    def test_all_downloads_preserve_content_geometry_fonts_and_privacy(self):
        assets = assets_for("MSCA")
        snapshots = {file: file.read_bytes() for file in assets.rglob("*") if file.is_file()}
        for form_id, form in catalog("MSCA").items():
            with self.subTest(form=form_id):
                schema = self.client.get(f"/api/academics/forms/msca/{form_id}/")
                self.assertEqual(schema.status_code, 200)
                self.assertNotIn("slots", schema.data["fields"][0])
                with CaptureQueriesContext(connection) as queries:
                    response = self.client.post(f"/api/academics/forms/msca/{form_id}/", {"student_name": "Maria Santos"}, format="json")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response["Content-Type"], "application/pdf")
                self.assertEqual(response["Cache-Control"], "private, no-store")
                self.assertIn(f'MSCA-{form_id}-filled.pdf', response["Content-Disposition"])
                self.assertFalse(any(q["sql"].split()[0] in ("INSERT", "UPDATE", "DELETE") for q in queries))
                result = PdfReader(BytesIO(response.content))
                source = PdfReader(assets / (form_id + ".pdf"))
                self.assertEqual(len(source.pages), len(result.pages))
                for before, after in zip(source.pages, result.pages):
                    for old, new in zip(list(before.mediabox) + list(before.cropbox), list(after.mediabox) + list(after.cropbox)):
                        self.assertAlmostEqual(float(old), float(new), places=5)
                    self.assertTrue(after.extract_text().startswith(before.extract_text()))
                self.assertIn("Maria Santos", result.pages[0].extract_text())
                self.assertTrue(any("/FontFile2" in f.get_object().get("/FontDescriptor", {}) for f in result.pages[0]["/Resources"]["/Font"].values()))
        for file, data in snapshots.items():
            self.assertEqual(file.read_bytes(), data)

    def test_original_paper_sizes_and_second_pages_are_retained(self):
        for form_id, size in [("ccs-13", (612, 1008)), ("ccs-14", (612, 792))]:
            response = self.client.get(f"/api/academics/forms/msca/{form_id}/")
            self.assertIn("Legal" if form_id == "ccs-13" else "Letter", response.data["paper_size"])
            page = PdfReader(BytesIO(fill_pdf(form_id, {"student_name": "Maria Santos"}, "MSCA"))).pages[0]
            self.assertEqual((float(page.mediabox.width), float(page.mediabox.height)), size)
        for form_id in ("020", "023"):
            result = PdfReader(BytesIO(fill_pdf(form_id, {"student_name": "Maria Santos", "thesis_title": "Environmental Monitoring"}, "MSCA")))
            self.assertEqual(len(result.pages), 2)
            for page in result.pages:
                self.assertIn("Maria Santos", page.extract_text())
                self.assertIn("Environmental Monitoring", page.extract_text())
        self.assertEqual(len(PdfReader(BytesIO(fill_pdf("024", {"student_name": "Maria Santos"}, "MSCA"))).pages), 2)

    def test_publication_choices_and_table_fields_validate_without_clipping(self):
        result = PdfReader(BytesIO(fill_pdf("ccs-14", {"publication_intention": "do_not_publish", "publication_reason": "Pending publication plans"}, "MSCA")))
        self.assertIn("Pending publication plans", result.pages[0].extract_text())
        self.assertIn("X", result.pages[0].extract_text())
        table = PdfReader(BytesIO(fill_pdf("ccs-13", {"cross_registration_1_course": "CS201", "cross_registration_1_units": "3", "transfer_applied": "no"}, "MSCA")))
        self.assertIn("CS201", table.pages[0].extract_text())
        for values in [{"student_name": "W" * 80}, {"cross_registration_1_units": "WWWWW"}, {"thesis_selection": "dissertation"}, {"overall_evaluation": "Passed"}]:
            with self.subTest(values=values), self.assertRaises(FormInputError):
                fill_pdf("ccs-13", values, "MSCA")

    def test_hidden_unpublished_and_changed_templates_are_unavailable(self):
        self.program.is_published = False
        self.program.save()
        self.assertEqual(self.client.get("/api/academics/forms/msca/019/").status_code, 404)
        self.program.is_published = True
        self.program.save()
        ProgramDocument.objects.filter(program=self.program).update(is_public=False)
        self.assertEqual(self.client.post("/api/academics/forms/msca/019/", {"student_name": "Maria Santos"}, format="json").status_code, 404)
        with TemporaryDirectory() as root:
            with self.settings(REPO_DIR=Path(root)):
                self.assertTrue(template_is_current("019", "MSCA"))
            original = Path(root) / "frontend/public/thesis-forms/msca" / catalog("MSCA")["019"]["source_filename"]
            original.parent.mkdir(parents=True)
            original.write_bytes(b"different template version")
            with self.settings(REPO_DIR=Path(root)):
                self.assertFalse(template_is_current("019", "MSCA"))


class PrintedSignatoryNameTests(TestCase):
    def test_names_in_all_supported_collections_are_printable_without_authorizing_decisions(self):
        from .form_filling import public_schema
        for code in ("BSCA", "MSCA", "REGISTRAR"):
            for form_id, form in catalog(code).items():
                with self.subTest(collection=code, form=form_id):
                    names = [f for f in form["fields"] if f.get("section") == "Signatory names"]
                    if not names:
                        continue  # Some request forms contain no official signatory name blank.
                    self.assertTrue(all(not f.get("choices") for f in names))
                    result = fill_pdf(form_id, {f["key"]: "Dr. Ana Cruz" for f in names}, code)
                    reader = PdfReader(BytesIO(result))
                    self.assertIn("Dr. Ana Cruz", "\n".join(p.extract_text() for p in reader.pages))
                    for f in names:
                        for slot in f["slots"]:
                            page = reader.pages[slot["page"]]
                            self.assertGreaterEqual(slot["x"], 0)
                            self.assertLessEqual(slot["x"] + slot["width"], float(page.mediabox.width))
                            self.assertLess(slot["baseline"], float(page.mediabox.height))
                    self.assertTrue(any(f.get("section") == "Signatory names" for f in public_schema(form_id, code)["fields"]))
                    with self.assertRaises(FormInputError):
                        fill_pdf(form_id, {"approval_decision": "Approved", "signature": "signed"}, code)
