from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import F
from django.http import FileResponse, Http404
import os

from apps.core.pagination import StandardResultsSetPagination
from .models import Teaching
from .serializers import TeachingListSerializer, TeachingDetailSerializer, TeachingCreateUpdateSerializer
from .services import TeachingService
from apps.users.permissions import IsAdminUser
from apps.users.models import Favorite, ContentTypeChoice

teaching_service = TeachingService()


class TeachingViewSet(viewsets.ModelViewSet):
    # Permet aux @action(throttle_scope=...) de limiter certains endpoints (compteurs, questions)
    throttle_scope = None
    queryset = Teaching.objects.filter(status='published').select_related('category', 'author').prefetch_related('tags')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'category__slug': ['exact'],
        'language': ['exact'],
        'is_featured': ['exact'],
        'status': ['exact'],
    }
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
        if self.action in ('favorite', 'my_favorites'):
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.is_admin:
            return Teaching.objects.all().select_related('category', 'author').prefetch_related('tags')
        return Teaching.objects.filter(status='published').select_related('category', 'author').prefetch_related('tags')

    def _serve_pdf(self, teaching, as_attachment):
        if not teaching.pdf_file:
            raise Http404('Aucun fichier PDF')
        try:
            # .open() fonctionne avec le disque local ET un stockage S3 (contrairement à .path)
            fh = teaching.pdf_file.open('rb')
        except (FileNotFoundError, OSError):
            raise Http404('Fichier introuvable sur le serveur')
        return FileResponse(
            fh,
            as_attachment=as_attachment,
            filename=os.path.basename(teaching.pdf_file.name),
            content_type='application/pdf',
        )

    # --- Téléchargement forcé (GET) ---
    @action(detail=True, methods=['get'], permission_classes=[AllowAny], throttle_scope='counters')
    def download(self, request, pk=None):
        teaching = self.get_object()
        response = self._serve_pdf(teaching, as_attachment=True)
        Teaching.objects.filter(pk=teaching.pk).update(downloads_count=F('downloads_count') + 1)
        return response

    # --- Lecture en ligne (GET) : renvoie le fichier inline (les vues sont comptées via POST /view/) ---
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def read(self, request, pk=None):
        teaching = self.get_object()
        return self._serve_pdf(teaching, as_attachment=False)

    # --- Incrémenter les vues (appelé par le frontend lors de l'ouverture du PDF) ---
    @action(detail=True, methods=['post'], permission_classes=[AllowAny], throttle_scope='counters')
    def view(self, request, pk=None):
        teaching = self.get_object()
        Teaching.objects.filter(pk=teaching.pk).update(views_count=F('views_count') + 1)
        teaching.refresh_from_db(fields=['views_count'])
        return Response({'views_count': teaching.views_count})

    # --- Favoris ---
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def favorite(self, request, pk=None):
        teaching = self.get_object()
        favorite = Favorite.objects.filter(
            user=request.user,
            content_type=ContentTypeChoice.TEACHING,
            content_id=teaching.id
        ).first()
        if favorite:
            favorite.delete()
            is_favorited = False
        else:
            Favorite.objects.create(
                user=request.user,
                content_type=ContentTypeChoice.TEACHING,
                content_id=teaching.id,
                title=teaching.title_fr
            )
            is_favorited = True
        return Response({'is_favorited': is_favorited, 'teaching_id': str(teaching.id)})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_favorites(self, request):
        user = request.user
        favorites = Favorite.objects.filter(user=user, content_type=ContentTypeChoice.TEACHING)
        teaching_ids = [fav.content_id for fav in favorites]
        teachings = Teaching.objects.filter(id__in=teaching_ids, status='published')
        serializer = TeachingListSerializer(teachings, many=True, context={'request': request})
        return Response(serializer.data)

    # --- Actions existantes ---
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        queryset = teaching_service.get_featured()
        serializer = TeachingListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def popular(self, request):
        try:
            limit = max(1, min(int(request.query_params.get('limit', 10)), 50))
        except ValueError:
            limit = 10
        queryset = teaching_service.get_popular(limit)
        serializer = TeachingListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)