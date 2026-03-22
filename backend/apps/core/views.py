from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SiteSetting, DepartmentProfile, HeroSection, QuickStat
from .serializers import (
    SiteSettingSerializer,
    DepartmentProfileSerializer,
    HeroSectionSerializer,
    QuickStatSerializer,
)


class SiteSettingsView(APIView):
    def get(self, request):
        site_settings = SiteSetting.objects.order_by("id").first()
        if not site_settings:
            return Response({})
        return Response(SiteSettingSerializer(site_settings).data)


class DepartmentProfileView(APIView):
    def get(self, request):
        profile = DepartmentProfile.objects.order_by("id").first()
        if not profile:
            return Response({})
        return Response(DepartmentProfileSerializer(profile).data)


class HomePayloadView(APIView):
    def get(self, request):
        site_settings = SiteSetting.objects.order_by("id").first()
        department_profile = DepartmentProfile.objects.order_by("id").first()
        hero_sections = HeroSection.objects.filter(is_published=True).order_by("sort_order", "title")
        quick_stats = QuickStat.objects.all().order_by("sort_order", "label")

        data = {
            "site_settings": SiteSettingSerializer(site_settings).data if site_settings else {},
            "department_profile": DepartmentProfileSerializer(department_profile).data if department_profile else {},
            "hero_sections": HeroSectionSerializer(hero_sections, many=True).data,
            "quick_stats": QuickStatSerializer(quick_stats, many=True).data,
        }
        return Response(data)