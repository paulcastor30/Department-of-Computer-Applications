from datetime import timedelta
import hashlib
import secrets
from urllib.parse import urlsplit
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from .models import AlumniSettings, AlumniProfile, AlumniEmailLink, AlumniUpdateSession, AlumniOpportunity
from .serializers import EmailInput, TokenInput, ProfileInput, ProfileOutput, OpportunitySerializer


def digest(token):
    return hashlib.sha256(token.encode()).hexdigest()


def configuration():
    return AlumniSettings.objects.filter(pk=1).first()


def ready(config):
    mail_ready = settings.ALUMNI_EMAIL_ENABLED and settings.EMAIL_BACKEND not in {"django.core.mail.backends.dummy.EmailBackend", "django.core.mail.backends.console.EmailBackend"}
    if settings.EMAIL_BACKEND == "django.core.mail.backends.smtp.EmailBackend":
        mail_ready = mail_ready and bool(settings.EMAIL_HOST and settings.DEFAULT_FROM_EMAIL)
    if not settings.DEBUG and settings.EMAIL_BACKEND in {"django.core.mail.backends.locmem.EmailBackend", "django.core.mail.backends.filebased.EmailBackend"}:
        mail_ready = False
    origin = urlsplit(settings.ALUMNI_PUBLIC_URL)
    origin_ready = origin.scheme == "https" or (settings.DEBUG and origin.scheme == "http" and origin.hostname in {"localhost", "127.0.0.1"})
    return bool(config and config.accepting_updates and config.contact_email and config.privacy_notice and config.notice_version and config.retention_days and mail_ready and origin_ready)


class AlumniThrottle(AnonRateThrottle):
    rate = "60/hour"
    scope = "alumni"


class PrivateAlumniView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AlumniThrottle]

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "no-store"
        response["Referrer-Policy"] = "no-referrer"
        return response

    def require_open(self):
        config = configuration()
        if not ready(config):
            return None
        return config


class AlumniConfigurationView(PrivateAlumniView):
    def get(self, request):
        config = configuration()
        return Response({"accepting_updates": ready(config), "contact_label": config.contact_label if config else "Department chairperson",
            "contact_email": config.contact_email if config else "", "privacy_notice": config.privacy_notice if config else "",
            "notice_version": config.notice_version if config else "", "retention_days": config.retention_days if config else None})


class RequestUpdateLinkView(PrivateAlumniView):
    def post(self, request):
        if not self.require_open():
            return Response({"detail": "Alumni updates are currently unavailable. Please contact the department chairperson."}, status=503)
        serializer = EmailInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        now = timezone.now()
        request_hash = digest(settings.SECRET_KEY + AlumniThrottle().get_ident(request))
        recent = AlumniEmailLink.objects.filter(created_at__gte=now - timedelta(minutes=15))
        message = {"detail": "If delivery is available, a secure update link will arrive shortly. Check your inbox and spam folder. The link expires in 30 minutes."}
        # Database limits complement the per-process DRF throttle without revealing membership.
        if recent.filter(email=email).count() >= 3 or recent.filter(request_hash=request_hash).count() >= 10:
            return Response(message)
        token = secrets.token_urlsafe(32)
        link = AlumniEmailLink.objects.create(email=email, token_hash=digest(token), request_hash=request_hash, expires_at=now + timedelta(minutes=30))
        url = f"{settings.ALUMNI_PUBLIC_URL.rstrip('/')}/alumni#alumni-token={token}"
        try:
            delivered = send_mail("Your BSCA / MSCA alumni update link", f"You requested a private alumni update link.\n\n{url}\n\nThis link expires in 30 minutes and can be used once. If you did not request it, ignore this email. No alumni profile has been created or changed by requesting this link.", settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
            if not delivered:
                raise RuntimeError("Email was not accepted")
        except Exception:
            link.used_at = now
            link.save(update_fields=["used_at"])
            return Response({"detail": "The update email could not be sent. Please try again later or contact the department chairperson."}, status=503)
        return Response(message)


class VerifyUpdateLinkView(PrivateAlumniView):
    def post(self, request):
        if not self.require_open():
            return Response({"detail": "Alumni updates are currently unavailable."}, status=503)
        serializer = TokenInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        now = timezone.now()
        with transaction.atomic():
            link = AlumniEmailLink.objects.select_for_update().filter(token_hash=digest(serializer.validated_data["token"]), used_at__isnull=True, expires_at__gt=now).first()
            if not link:
                raise ValidationError({"detail": "This link is invalid, expired, or already used. Please request a new link."})
            link.used_at = now
            link.save(update_fields=["used_at"])
            token = secrets.token_urlsafe(32)
            AlumniUpdateSession.objects.create(email=link.email, token_hash=digest(token), expires_at=now + timedelta(minutes=30))
            profile = AlumniProfile.objects.filter(email=link.email).first()
        return Response({"session_token": token, "email": link.email, "profile": ProfileOutput(profile).data if profile else None, "expires_in_minutes": 30})


class SaveAlumniProfileView(PrivateAlumniView):
    def post(self, request):
        config = self.require_open()
        if not config:
            return Response({"detail": "Alumni updates are currently unavailable."}, status=503)
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer ") or len(header) > 110:
            raise PermissionDenied("Request a secure email link before saving your details.")
        serializer = ProfileInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        if values["notice_version"] != config.notice_version:
            raise ValidationError({"detail": "The privacy notice has changed. Reload the page and request a new link before saving."})
        now = timezone.now()
        with transaction.atomic():
            session = AlumniUpdateSession.objects.select_for_update().filter(token_hash=digest(header[7:]), used_at__isnull=True, expires_at__gt=now).first()
            if not session:
                raise PermissionDenied("Your update session has expired or was already used. Please request a new link.")
            profile = AlumniProfile.objects.select_for_update().filter(email=session.email).first()
            if profile and any(getattr(profile, key) != values.get(key) for key in ("full_name", "bsca_year", "msca_year")):
                profile.verification_status = "PENDING"
                profile.reviewed_by = None
                profile.reviewed_at = None
            if not profile:
                profile = AlumniProfile(email=session.email)
            for key, value in values.items():
                setattr(profile, key, value)
            profile.email_verified_at = now
            profile.consented_at = now
            profile.alumni_updated_at = now
            profile.save()
            session.used_at = now
            session.save(update_fields=["used_at"])
        return Response({"detail": "Your alumni details have been saved privately. Email ownership is verified; alumni affiliation is reviewed separately by the department."})


class AlumniOpportunityListView(generics.ListAPIView):
    queryset = AlumniOpportunity.objects.filter(is_published=True)
    serializer_class = OpportunitySerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def get_queryset(self):
        return super().get_queryset().filter(Q(closes_on__isnull=True) | Q(closes_on__gte=timezone.localdate()))
