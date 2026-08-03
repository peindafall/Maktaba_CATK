from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeachingViewSet

router = DefaultRouter()
router.register('', TeachingViewSet, basename='teaching')

urlpatterns = router.urls
