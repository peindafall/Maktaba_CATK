from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from apps.users.permissions import IsAdminUser
from .models import Document
from .serializers import DocumentListSerializer, DocumentDetailSerializer, DocumentCreateUpdateSerializer
from .services import DocumentService

document_service = DocumentService()


class DocumentViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'language', 'document_type']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'description_fr']
    ordering_fields = ['created_at', 'downloads_count', 'views_count']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return Document.objects.all().select_related('category', 'author')
        return Document.objects.filter(is_published=True).select_related('category', 'author')

    def get_serializer_class(self):
        if self.action == 'list':
            return DocumentListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return DocumentCreateUpdateSerializer
        return DocumentDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        doc = self.get_object()
        document_service.increment_downloads(doc.id)
        serializer = DocumentDetailSerializer(doc, context={'request': request})
        return Response({'file_url': serializer.data.get('file_url')})
