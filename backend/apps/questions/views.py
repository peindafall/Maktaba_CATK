import logging

from django.conf import settings
from django.db.models import F
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from apps.users.permissions import IsAdminUser
from apps.categories.models import Category
from apps.users.services import safe_send_mail

from .models import Question
from .serializers import (
    MyQuestionSerializer,
    QuestionCreateUpdateSerializer,
    QuestionDetailSerializer,
    QuestionListSerializer,
    QuestionSubmitSerializer,
)

logger = logging.getLogger(__name__)


class QuestionViewSet(viewsets.ModelViewSet):
    # Permet aux @action(throttle_scope=...) de limiter certains endpoints (compteurs, questions)
    throttle_scope = None
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'category__slug': ['exact'],
        'is_published': ['exact'],
        'source': ['exact'],
    }
    search_fields = ['title_fr', 'title_en', 'title_ar', 'question_fr', 'keywords']
    ordering_fields = ['created_at', 'views_count']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_authenticated and hasattr(self.request.user, 'is_admin') and self.request.user.is_admin:
            return Question.objects.all().select_related('category').prefetch_related('answers')
        return Question.objects.filter(is_published=True).select_related('category').prefetch_related('answers')

    def get_serializer_class(self):
        if self.action == 'list':
            return QuestionListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return QuestionCreateUpdateSerializer
        return QuestionDetailSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminUser()]
        if self.action == 'mine':
            return [IsAuthenticated()]
        return [AllowAny()]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny], throttle_scope='ask_question')
    def ask(self, request):
        """
        Permet à un visiteur (ou un membre connecté) de poser une question au Professeur.
        La question est enregistrée NON publiée ; l'admin y répond (audio et/ou texte) dans
        l'administration, puis coche « publiée » pour l'afficher sur le site.
        """
        serializer = QuestionSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None

        if not user and not data.get('email'):
            return Response(
                {'email': ['Indiquez votre email pour être prévenu de la réponse (ou connectez-vous).']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        lang = data.get('language', 'fr')
        category = None
        if data.get('category'):
            category = Category.objects.filter(pk=data['category'], is_active=True).first()

        question = Question.objects.create(
            # title_fr est obligatoire : on y met toujours le texte d'origine (l'admin pourra traduire)
            title_fr=data['title'],
            title_en=data['title'] if lang == 'en' else '',
            title_ar=data['title'] if lang == 'ar' else '',
            question_fr=data['question'],
            question_en=data['question'] if lang == 'en' else '',
            question_ar=data['question'] if lang == 'ar' else '',
            category=category,
            is_published=False,
            source=Question.SOURCE_PUBLIC,
            status=Question.STATUS_PENDING,
            submitted_by=user,
            submitter_name=(data.get('name') or (user.username if user else ''))[:120],
            submitter_email=(user.email if user else data.get('email', '')),
            submitter_language=lang,
        )

        notify = getattr(settings, 'QUESTIONS_NOTIFY_EMAIL', '')
        if notify:
            safe_send_mail(
                f'Nouvelle question sur Maktaba CATK : {question.title_fr[:80]}',
                f"De : {question.submitter_name or 'Anonyme'} <{question.submitter_email}>\n\n"
                f'{data["question"]}\n\nRépondez depuis l\'administration Django.',
                [notify],
            )

        return Response(
            {'id': str(question.id), 'detail': 'Votre question a bien été envoyée. Merci !'},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Questions envoyées par l'utilisateur connecté (avec leur statut)."""
        qs = Question.objects.filter(submitted_by=request.user).prefetch_related('answers').order_by('-created_at')
        return Response(MyQuestionSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], throttle_scope='counters')
    def view(self, request, pk=None):
        """Incrémente le compteur de vues."""
        question = self.get_object()
        Question.objects.filter(pk=question.pk).update(views_count=F('views_count') + 1)
        question.refresh_from_db(fields=['views_count'])
        return Response({'views_count': question.views_count}, status=status.HTTP_200_OK)