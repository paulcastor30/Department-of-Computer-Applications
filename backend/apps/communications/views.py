from rest_framework import generics
from .models import NewsPost
from .serializers import NewsPostSerializer


class NewsListView(generics.ListAPIView):
    queryset = NewsPost.objects.filter(is_published=True).order_by("-published_at", "-updated_at")
    serializer_class = NewsPostSerializer


class NewsDetailView(generics.RetrieveAPIView):
    queryset = NewsPost.objects.filter(is_published=True)
    serializer_class = NewsPostSerializer
    lookup_field = "slug"