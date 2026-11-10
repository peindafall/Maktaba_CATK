from django.db.models import Sum
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import (
    Badge,
    Collection,
    CollectionItem,
    Favorite,
    Payment,
    Subscription,
    SubscriptionPlan,
    SupportContribution,
    User,
    UserActivity,
    UserBadge,
    UserPreference,
)
from .permissions import IsAdminUser, IsOwnerOrAdmin
from .serializers import (
    BadgeSerializer,
    ChangePasswordSerializer,
    CollectionItemSerializer,
    CollectionSerializer,
    FavoriteSerializer,
    FavoriteToggleSerializer,
    PaymentSerializer,
    ResetPasswordConfirmSerializer,
    ResetPasswordSerializer,
    SubscriptionPlanSerializer,
    SubscriptionSerializer,
    SupportContributionSerializer,
    UserActivitySerializer,
    UserBadgeSerializer,
    UserCreateSerializer,
    UserDetailSerializer,
    UserListSerializer,
    UserPreferenceSerializer,
    UserUpdateSerializer,
    VerifyEmailSerializer,
)
from .services import UserService

user_service = UserService()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        if self.action in ('create', 'register'):
            return UserCreateSerializer
        if self.action in ('update', 'partial_update'):
            return UserUpdateSerializer
        return UserDetailSerializer

    def get_permissions(self):
        # Création / liste / suppression : réservées aux admins (l'inscription passe par /auth/register/)
        if self.action in ('list', 'create', 'destroy'):
            return [IsAdminUser()]
        if self.action in ('me', 'update_profile', 'change_password', 'preferences', 'dashboard'):
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'PATCH':
            serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(UserDetailSerializer(request.user, context={'request': request}).data)

    @action(detail=False, methods=['put', 'patch'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        pref, _ = UserPreference.objects.get_or_create(
            user=request.user, defaults={'preferred_language': request.user.preferred_language}
        )
        pref.preferred_language = request.user.preferred_language
        pref.save(update_fields=['preferred_language', 'updated_at'])
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save(update_fields=['password'])
        return Response({'detail': 'Mot de passe modifié avec succès.'})

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def preferences(self, request):
        preference, _ = UserPreference.objects.get_or_create(
            user=request.user,
            defaults={'preferred_language': request.user.preferred_language},
        )
        if request.method == 'PATCH':
            serializer = UserPreferenceSerializer(preference, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            if serializer.validated_data.get('preferred_language'):
                request.user.preferred_language = serializer.validated_data['preferred_language']
                request.user.save(update_fields=['preferred_language'])
            return Response(serializer.data)
        return Response(UserPreferenceSerializer(preference).data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard(self, request):
        user = request.user
        active_subscription = user.subscriptions.filter(
            status__in=[Subscription.STATUS_ACTIVE, Subscription.STATUS_TRIAL]
        ).order_by('-created_at').first()
        response = {
            'profile': UserDetailSerializer(user).data,
            'subscription': SubscriptionSerializer(active_subscription).data if active_subscription else None,
            'history_stats': {
                'documents_consulted': user.activities.filter(action=UserActivity.ACTION_VIEW, content_type='document').count(),
                'documents_downloaded': user.activities.filter(action=UserActivity.ACTION_DOWNLOAD, content_type='document').count(),
                'audios_played': user.activities.filter(action=UserActivity.ACTION_PLAY, content_type='audio').count(),
                'videos_viewed': user.activities.filter(action=UserActivity.ACTION_VIEW, content_type='video').count(),
                'searches': user.activities.filter(action=UserActivity.ACTION_SEARCH).count(),
                'favorites': user.favorites.count(),
            },
            'support': {
                'total_monthly': str(
                    user.support_contributions.filter(
                        contribution_type=SupportContribution.TYPE_RECURRING,
                        status=SupportContribution.STATUS_ACTIVE,
                    ).aggregate(total=Sum('amount'))['total'] or 0
                ),
                'total_contributions': str(
                    user.support_contributions.aggregate(total=Sum('amount'))['total'] or 0
                ),
            },
        }
        return Response(response)


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [AllowAny]


class SubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lecture seule : avant, n'importe quel utilisateur pouvait se créer lui-même un abonnement
    « actif » (Premium/Pro) sans payer. Les abonnements sont créés côté serveur après paiement.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).select_related('plan')


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).select_related('subscription')


def _favorite_models():
    from apps.audios.models import Audio
    from apps.questions.models import Question
    from apps.teachings.models import Teaching
    from apps.videos.models import Video

    return {
        'teaching': Teaching.objects.filter(status='published'),
        'audio': Audio.objects.filter(is_published=True),
        'video': Video.objects.filter(is_published=True),
        'question': Question.objects.filter(is_published=True),
    }


class FavoriteViewSet(
    mixins.ListModelMixin, mixins.DestroyModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    Favoris de l'utilisateur connecté (enseignements, audios, émissions, questions).
      GET    /favorites/            -> liste légère [{content_type, content_id}] (pour colorer les cœurs)
      POST   /favorites/toggle/     -> ajoute / retire  {content_type, content_id}
      GET    /favorites/detailed/   -> contenus complets groupés par type (page « Mes favoris »)
    """
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        serializer = FavoriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content_type = serializer.validated_data['content_type']
        content_id = serializer.validated_data['content_id']

        obj = _favorite_models()[content_type].filter(pk=content_id).first()
        if obj is None:
            return Response({'detail': 'Contenu introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        deleted, _ = Favorite.objects.filter(
            user=request.user, content_type=content_type, content_id=content_id
        ).delete()
        if deleted:
            return Response({'is_favorited': False, 'content_type': content_type, 'content_id': str(content_id)})

        Favorite.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            content_id=content_id,
            defaults={'title': (getattr(obj, 'title_fr', '') or '')[:500]},
        )
        return Response(
            {'is_favorited': True, 'content_type': content_type, 'content_id': str(content_id)},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=['get'])
    def detailed(self, request):
        from apps.audios.serializers import AudioListSerializer
        from apps.questions.serializers import QuestionListSerializer
        from apps.teachings.serializers import TeachingListSerializer
        from apps.videos.serializers import VideoListSerializer

        serializers_map = {
            'teaching': ('teachings', TeachingListSerializer),
            'audio': ('audios', AudioListSerializer),
            'video': ('videos', VideoListSerializer),
            'question': ('questions', QuestionListSerializer),
        }
        querysets = _favorite_models()
        favorites = list(self.get_queryset().values('content_type', 'content_id', 'created_at'))
        data = {}
        ctx = {'request': request}
        for ctype, (key, serializer_cls) in serializers_map.items():
            ids = [f['content_id'] for f in favorites if f['content_type'] == ctype]
            objects = {o.pk: o for o in querysets[ctype].filter(pk__in=ids)} if ids else {}
            ordered = [objects[i] for i in ids if i in objects]  # plus récents d'abord
            data[key] = serializer_cls(ordered, many=True, context=ctx).data
        data['total'] = sum(len(v) for v in data.values())
        return Response(data)


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user).prefetch_related('items')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_item(self, request, pk=None):
        collection = self.get_object()
        serializer = CollectionItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item, _ = CollectionItem.objects.get_or_create(
            collection=collection,
            content_type=serializer.validated_data['content_type'],
            content_id=serializer.validated_data['content_id'],
            defaults={'title': serializer.validated_data.get('title', '')},
        )
        return Response(CollectionItemSerializer(item).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_item(self, request, pk=None):
        collection = self.get_object()
        serializer = CollectionItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        deleted, _ = CollectionItem.objects.filter(
            collection=collection,
            content_type=serializer.validated_data['content_type'],
            content_id=serializer.validated_data['content_id'],
        ).delete()
        return Response({'removed': deleted > 0})


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = UserActivity.objects.filter(user=self.request.user)
        action = self.request.query_params.get('action')
        content_type = self.request.query_params.get('content_type')
        if action:
            qs = qs.filter(action=action)
        if content_type:
            qs = qs.filter(content_type=content_type)
        return qs


class SupportContributionViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    serializer_class = SupportContributionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SupportContribution.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BadgeSerializer
    permission_classes = [AllowAny]
    queryset = Badge.objects.filter(is_active=True)


class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user).select_related('badge')


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Connexion insensible à la casse de l'email + renvoie le profil."""

    def validate(self, attrs):
        email = (attrs.get(self.username_field) or '').strip()
        match = User.objects.filter(email__iexact=email).only('email').first()
        attrs[self.username_field] = match.email if match else email
        data = super().validate(attrs)
        data['user'] = UserDetailSerializer(self.user).data
        return data


@extend_schema(tags=['auth'])
class LoginView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    throttle_scope = 'auth'


@extend_schema(tags=['auth'])
class RefreshView(TokenRefreshView):
    pass


@extend_schema(tags=['auth'])
class LogoutView(APIView):
    """Invalide le refresh token (il ne pourra plus servir à obtenir un nouveau token)."""

    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        refresh = request.data.get('refresh')
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass
        return Response(status=status.HTTP_205_RESET_CONTENT)


@extend_schema(tags=['auth'])
class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = user_service.register(**serializer.validated_data)
        UserPreference.objects.get_or_create(
            user=user,
            defaults={'preferred_language': user.preferred_language},
        )
        tokens = user_service.get_tokens_for_user(user)
        return Response(
            {
                'user': UserDetailSerializer(user).data,
                'tokens': tokens,
            },
            status=status.HTTP_201_CREATED,
        )


@extend_schema(tags=['auth'])
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        success = user_service.verify_email(serializer.validated_data['token'])
        if success:
            return Response({'detail': 'Email vérifié avec succès.'})
        return Response({'detail': 'Token invalide ou expiré.'}, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(tags=['auth'])
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_service.reset_password_request(serializer.validated_data['email'])
        return Response({'detail': 'Si cet email existe, un lien de réinitialisation a été envoyé.'})


@extend_schema(tags=['auth'])
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = 'auth'

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ok = user_service.reset_password_confirm(
            serializer.validated_data['token'], serializer.validated_data['new_password']
        )
        if ok:
            return Response({'detail': 'Mot de passe réinitialisé. Vous pouvez vous connecter.'})
        return Response({'detail': 'Lien invalide ou expiré.'}, status=status.HTTP_400_BAD_REQUEST)
