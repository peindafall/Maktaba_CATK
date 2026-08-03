from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category
from .serializers import CategoryListSerializer, CategoryDetailSerializer, CategoryCreateUpdateSerializer
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
        return []

    @action(detail=False, methods=['get'])
    def roots(self, request):
        roots = Category.objects.filter(is_active=True, parent=None).prefetch_related('children')
        serializer = CategoryDetailSerializer(roots, many=True)
        return Response(serializer.data)
