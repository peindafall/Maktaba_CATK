from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from apps.core.media_views import serve_media
from apps.core.views import api_root_info

admin.site.site_header = 'Maktaba CATK — Administration'
admin.site.site_title = 'Maktaba CATK'
admin.site.index_title = 'Gestion de la bibliothèque'

urlpatterns = [
    path('', api_root_info, name='api-root-info'),  # évite le 404 sur la racine du backend
    path('favicon.ico', RedirectView.as_view(url=f'{settings.FRONTEND_URL}/favicon.ico', permanent=True)),
    path(getattr(settings, 'ADMIN_URL', 'admin/'), admin.site.urls),
    path('api/v1/', include('config.api_urls')),
]

if getattr(settings, 'ENABLE_API_DOCS', True):
    urlpatterns += [
        path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
        path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
        path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    ]

# Médias servis par Django (avec support Range pour l'audio) quand on n'utilise pas un stockage S3
if settings.MEDIA_URL.startswith('/'):
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve_media, name='media'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    try:
        import debug_toolbar  # noqa: F401

        urlpatterns = [path('__debug__/', include('debug_toolbar.urls'))] + urlpatterns
    except ImportError:
        pass
