from django.urls import include, path

urlpatterns = [
    path("core/", include("apps.core.api_urls")),
    path("academics/", include("apps.academics.api_urls")),
    path("people/", include("apps.people.api_urls")),
    path("communications/", include("apps.communications.api_urls")),
    path("quality/", include("apps.quality.api_urls")),
]