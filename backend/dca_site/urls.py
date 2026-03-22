from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from dca_app.views import FrontendAppView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("dca_site.api_urls")),
    re_path(r"^(?!api/|admin/|assets/|media/).*$", FrontendAppView.as_view(), name="frontend"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])