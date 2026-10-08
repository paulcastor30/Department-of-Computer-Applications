from io import BytesIO
from django.core.cache import cache
from django.test import TestCase
from django.db import connection
from django.test.utils import CaptureQueriesContext
from pypdf import PdfReader
from rest_framework.test import APIClient
from .models import RegistrarForm
from .form_filling import catalog, assets_for, fill_pdf, template_is_current, FormInputError


class RegistrarFormTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()

    def test_seeded_catalog_original_downloads_and_public_scope(self):
        response = self.client.get("/api/academics/forms/registrar/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 11)
        self.assertEqual({f["fillable_form_id"] for f in response.data}, set(catalog("REGISTRAR")))
        for item in response.data:
            self.assertIn("/registar-forms/", item["href"])
            self.assertTrue(template_is_current(item["form_id"], "REGISTRAR"))
        RegistrarForm.objects.filter(form_id="001").update(is_public=False)
        self.assertEqual(len(self.client.get("/api/academics/forms/registrar/").data), 10)
        self.assertEqual(self.client.get("/api/academics/forms/registrar/001/").status_code, 404)
        self.assertEqual(self.client.post("/api/academics/forms/registrar/001/", {"date": "2026"}, format="json").status_code, 404)
        self.assertEqual(self.client.get("/api/academics/forms/registrar/999/").status_code, 404)

    def test_replaced_original_disables_filling_but_remains_downloadable(self):
        RegistrarForm.objects.filter(form_id="001").update(url="https://example.org/replacement.docx")
        item = self.client.get("/api/academics/forms/registrar/").data[0]
        self.assertEqual(item["href"], "https://example.org/replacement.docx")
        self.assertIsNone(item["fillable_form_id"])
        self.assertEqual(self.client.get("/api/academics/forms/registrar/001/").status_code, 404)

    def test_all_downloads_keep_original_pages_text_and_vector_fonts_without_writes(self):
        for form_id, form in catalog("REGISTRAR").items():
            with self.subTest(form=form_id):
                schema = self.client.get(f"/api/academics/forms/registrar/{form_id}/").data
                self.assertNotIn("slots", schema["fields"][0])
                values = {form["fields"][0]["key"]: "10/08/2026" if form["fields"][0]["key"] == "date" else "Santos"}
                with CaptureQueriesContext(connection) as queries:
                    response = self.client.post(f"/api/academics/forms/registrar/{form_id}/", values, format="json")
                self.assertEqual(response.status_code, 200)
                self.assertFalse(any(q["sql"].lstrip().upper().startswith(("INSERT", "UPDATE", "DELETE")) for q in queries))
                self.assertEqual(response["Cache-Control"], "private, no-store")
                self.assertIn(f"REGISTRAR-{form_id}-filled.pdf", response["Content-Disposition"])
                blank = PdfReader(assets_for("REGISTRAR") / (form_id + ".pdf"))
                filled = PdfReader(BytesIO(response.content))
                self.assertEqual(len(blank.pages), len(filled.pages))
                for a, b in zip(blank.pages, filled.pages):
                    for x, y in zip(a.mediabox, b.mediabox):
                        self.assertAlmostEqual(float(x), float(y), places=5)
                    for line in a.extract_text().splitlines():
                        self.assertIn(line, b.extract_text())
                fonts = filled.pages[0]["/Resources"]["/Font"].get_object()
                self.assertTrue(any("/FontFile2" in f.get_object().get("/FontDescriptor", {}) for f in fonts.values()))
        self.assertEqual(self.client.get("/api/academics/forms/registrar/011/").data["paper_size"], "Letter (8.5 × 11 inches)")

    def test_official_fields_unknown_choices_and_overflow_are_rejected(self):
        for values in [{"grade_obtained": "1.0"}, {"student_name": "W" * 90}, {"semester": "1\n2"}]:
            with self.assertRaises(FormInputError):
                fill_pdf("011", values, "REGISTRAR")
        with self.assertRaises(FormInputError):
            fill_pdf("003", {"request_type": "made-up"}, "REGISTRAR")
        result = fill_pdf("003", {"request_type": "type_1", "student_name": "Maria Santos", "father": "Juan Santos"}, "REGISTRAR")
        pages = PdfReader(BytesIO(result)).pages
        self.assertIn("Maria Santos", pages[0].extract_text())
        self.assertIn("Juan Santos", pages[1].extract_text())
        self.assertIn("X", pages[0].extract_text())
