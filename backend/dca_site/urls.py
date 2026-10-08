from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from apps.core.frontend_views import FrontendAppView
from django.views.static import serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("dca_site.api_urls")),
    re_path(r"^(?!(api|admin|assets|media)(/|$)).*$", FrontendAppView.as_view(), name="frontend"),
]

if settings.DEBUG:
    # Public originals and identity images must resolve before the local SPA fallback.
    public = settings.REPO_DIR / "frontend" / "public"
    public_patterns = [path(filename, serve, {"path": filename, "document_root": public}) for filename in ("ca-logo.png", "ccs-logo.png", "favicon.ico")]
    for folder in ("registar-forms", "thesis-forms", "curricula"):
        public_patterns += static(f"/{folder}/", document_root=public / folder)
    urlpatterns = public_patterns + urlpatterns

if settings.DEBUG and settings.STATICFILES_DIRS:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
