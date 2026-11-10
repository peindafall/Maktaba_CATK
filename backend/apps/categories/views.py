from django.db.models import Count, Q
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category
from .serializers import (
    CategoryCreateUpdateSerializer,
    CategoryDetailSerializer,
    CategoryListSerializer,
    CategoryMiniSerializer,
)
from apps.users.permissions import IsAdminUser


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).prefetch_related('children')
    filter_backends = []

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return CategoryCreateUpdateSerializer
        return CategoryDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=False, methods=['get'])
    def roots(self, request):
        roots = Category.objects.filter(is_active=True, parent=None).prefetch_related('children')
        serializer = CategoryDetailSerializer(roots, many=True)
        return Response(serializer.data)



class VideoThemeListView(generics.ListAPIView):
    """Thèmes (catégories) qui contiennent au moins une émission publiée — pour filtrer les vidéos."""

    serializer_class = CategoryMiniSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        return (
            Category.objects.filter(is_active=True)
            .annotate(n=Count('videos', filter=Q(videos__is_published=True)))
            .filter(n__gt=0)
            .order_by('order', 'name_fr')
        )
