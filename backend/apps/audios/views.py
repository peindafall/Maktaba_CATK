import os

from django.http import FileResponse, Http404
from rest_framework import status, viewsets
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
    # Permet aux @action(throttle_scope=...) de limiter certains endpoints (compteurs, questions)
    throttle_scope = None
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'category__slug': ['exact'],
        'language': ['exact'],
        'is_published': ['exact'],
    }
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

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], throttle_scope='counters')
    def play(self, request, pk=None):
        audio = self.get_object()
        audio_service.increment_plays(audio.id)
        audio.refresh_from_db(fields=['plays_count'])
        return Response({'plays_count': audio.plays_count})

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny], throttle_scope='counters')
    def download(self, request, pk=None):
        """
        GET  : incrémente le compteur et renvoie le FICHIER en pièce jointe (Content-Disposition: attachment).
               C'est ce qui déclenche un vrai téléchargement, y compris sur iPhone (app Fichiers > Téléchargements)
               et Android (dossier Téléchargements). L'attribut HTML « download » est ignoré entre domaines
               différents (netlify.app -> onrender.com), d'où ce changement.
        POST : ancien comportement (JSON avec l'URL) conservé pour l'application mobile.
        """
        audio = self.get_object()
        if not audio.audio_file:
            raise Http404('Aucun fichier audio')
        audio_service.increment_downloads(audio.id)

        filename = os.path.basename(audio.audio_file.name)
        if request.method == 'GET':
            try:
                fh = audio.audio_file.open('rb')
            except (FileNotFoundError, OSError):
                raise Http404('Fichier introuvable sur le serveur')
            return FileResponse(fh, as_attachment=True, filename=filename)

        audio.refresh_from_db(fields=['downloads_count'])
        return Response({
            'audio_url': request.build_absolute_uri(audio.audio_file.url),
            'download_url': request.build_absolute_uri(request.path),
            'downloads_count': audio.downloads_count,
            'filename': filename,
        })
