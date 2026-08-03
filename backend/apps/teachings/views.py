from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from .models import Teaching
from .serializers import TeachingListSerializer, TeachingDetailSerializer, TeachingCreateUpdateSerializer
from .services import TeachingService
from apps.users.permissions import IsAdminUser

teaching_service = TeachingService()


class TeachingViewSet(viewsets.ModelViewSet):
    queryset = Teaching.objects.filter(status='published').select_related('category', 'author').prefetch_related('tags')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'language', 'is_featured', 'status']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'description_fr']
    ordering_fields = ['published_at', 'views_count', 'downloads_count', 'created_at']
    ordering = ['-published_at']
    pagination_class = StandardResultsSetPagination

    def get_serializer_class(self):
        if self.action == 'list':
            return TeachingListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return TeachingCreateUpdateSerializer
        return TeachingDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_admin:
            return Teaching.objects.all().select_related('category', 'author').prefetch_related('tags')
        return Teaching.objects.filter(status='published').select_related('category', 'author').prefetch_related('tags')

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def download(self, request, pk=None):
        teaching = self.get_object()
        teaching_service.increment_downloads(teaching.id)
        serializer = TeachingDetailSerializer(teaching, context={'request': request})
        return Response({'pdf_url': serializer.data.get('pdf_file_url')})

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = teaching_service.get_featured()
        serializer = TeachingListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def popular(self, request):
        limit = int(request.query_params.get('limit', 10))
        queryset = teaching_service.get_popular(limit)
        serializer = TeachingListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
