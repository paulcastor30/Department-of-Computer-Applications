from django.http import HttpResponse
from rest_framework.exceptions import NotFound
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from .form_filling import catalog, fill_pdf, FormInputError, public_schema, supported_form
from .models import ProgramDocument


class FormDownloadThrottle(SimpleRateThrottle):
    scope = "bsca_form_download"
    rate = "30/min"

    def get_cache_key(self, request, view):
        if request.method != "POST":
            return None
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


class BSCAFormView(APIView):
    program_code = "BSCA"
    authentication_classes = []
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]
    throttle_classes = [FormDownloadThrottle]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "private, no-store"
        response["X-Content-Type-Options"] = "nosniff"
        return response

    def get_form(self, form_id):
        if form_id not in catalog(self.program_code):
            raise NotFound("This form is not available for online filling.")
        documents = ProgramDocument.objects.select_related("program").filter(
            program__code=self.program_code, program__is_published=True, is_public=True,
        )
        if not any(supported_form(document) == form_id for document in documents):
            raise NotFound("This form is not available for online filling.")
        return public_schema(form_id, self.program_code)

    def get(self, request, form_id):
        return Response(self.get_form(form_id))

    def post(self, request, form_id):
        schema = self.get_form(form_id)
        if int(request.META.get("CONTENT_LENGTH") or 0) > 16384:
            return Response({"detail": "The form details are too large."}, status=413)
        try:
            content = fill_pdf(form_id, request.data, self.program_code)
        except FormInputError as error:
            return Response({"detail": str(error), "fields": error.errors}, status=400)
        response = HttpResponse(content, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{schema["filename"]}"'
        return response


class MSCAFormView(BSCAFormView):
    program_code = "MSCA"
