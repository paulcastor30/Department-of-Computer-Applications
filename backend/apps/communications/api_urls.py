from django.urls import path
from .views import NewsListView, NewsDetailView

from .calendar import EventsView

urlpatterns = [
    path("events/", EventsView.as_view(), name="events-list"),
    path("news/", NewsListView.as_view(), name="news-list"),
    path("news/<slug:slug>/", NewsDetailView.as_view(), name="news-detail"),
]