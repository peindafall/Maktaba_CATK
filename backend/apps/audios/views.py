from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from apps.users.permissions import IsAdminUser
from .models import Audio
from .serializers import AudioListSerializer, AudioDetailSerializer, AudioCreateUpdateSerializer
from .services import AudioService

audio_service = AudioService()


class AudioViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'language', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'description_fr']
    ordering_fields = ['created_at', 'plays_count', 'downloads_count']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return Audio.objects.all().select_related('category')
        return Audio.objects.filter(is_published=True).select_related('category')

    def get_serializer_class(self):
        if self.action == 'list':
            return AudioListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return AudioCreateUpdateSerializer
        return AudioDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=True, methods=['post'])
    def play(self, request, pk=None):
        audio = self.get_object()
        audio_service.increment_plays(audio.id)
        return Response({'plays_count': audio.plays_count + 1})

    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        audio = self.get_object()
        audio_service.increment_downloads(audio.id)
        serializer = AudioDetailSerializer(audio, context={'request': request})
        return Response({'audio_url': serializer.data.get('audio_url')})
