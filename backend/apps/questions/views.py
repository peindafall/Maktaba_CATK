from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.pagination import StandardResultsSetPagination
from apps.users.permissions import IsAdminUser
from .models import Question
from .serializers import QuestionListSerializer, QuestionDetailSerializer, QuestionCreateUpdateSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_published']
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
        return [AllowAny()]
