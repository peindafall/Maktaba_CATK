from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from apps.users.permissions import IsAdminUser
from .models import Video
from .serializers import VideoListSerializer, VideoDetailSerializer, VideoCreateUpdateSerializer
from .services import VideoService

video_service = VideoService()


class VideoViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'description_fr']
    ordering_fields = ['published_at', 'views_count', 'created_at']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return Video.objects.all()
        return Video.objects.filter(is_published=True)

    def get_serializer_class(self):
        if self.action == 'list':
            return VideoListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return VideoCreateUpdateSerializer
        return VideoDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        video = self.get_object()
        video_service.increment_views(video.id)
        return Response({'views_count': video.views_count + 1})

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category', '')
        queryset = self.get_queryset().filter(category=category) if category else self.get_queryset()
        serializer = VideoListSerializer(queryset[:20], many=True, context={'request': request})
        return Response(serializer.data)
