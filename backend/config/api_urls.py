from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.teachings.views import TeachingViewSet
from apps.documents.views import DocumentViewSet
from apps.audios.views import AudioViewSet
from apps.videos.views import VideoViewSet
from apps.questions.views import QuestionViewSet
from apps.categories.views import CategoryViewSet
from apps.users.views import (
    BadgeViewSet,
    CollectionViewSet,
    FavoriteViewSet,
    PaymentViewSet,
    RegisterView,
    ResetPasswordView,
    SubscriptionPlanViewSet,
    SubscriptionViewSet,
    SupportContributionViewSet,
    UserActivityViewSet,
    UserBadgeViewSet,
    UserViewSet,
    VerifyEmailView,
)
from apps.search.views import GlobalSearchView
from apps.analytics.views import DashboardStatsView

router = DefaultRouter()
router.register('teachings', TeachingViewSet, basename='teaching')
router.register('documents', DocumentViewSet, basename='document')
router.register('audios', AudioViewSet, basename='audio')
router.register('videos', VideoViewSet, basename='video')
router.register('questions', QuestionViewSet, basename='question')
router.register('categories', CategoryViewSet, basename='category')
router.register('users', UserViewSet, basename='user')
router.register('subscription-plans', SubscriptionPlanViewSet, basename='subscription-plan')
router.register('subscriptions', SubscriptionViewSet, basename='subscription')
router.register('payments', PaymentViewSet, basename='payment')
router.register('favorites', FavoriteViewSet, basename='favorite')
router.register('collections', CollectionViewSet, basename='collection')
router.register('activities', UserActivityViewSet, basename='activity')
router.register('support-contributions', SupportContributionViewSet, basename='support-contribution')
router.register('badges', BadgeViewSet, basename='badge')
router.register('user-badges', UserBadgeViewSet, basename='user-badge')

urlpatterns = router.urls + [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('search/', GlobalSearchView.as_view(), name='global_search'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
