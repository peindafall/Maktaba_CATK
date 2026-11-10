from django.http import JsonResponse
from django.views.decorators.cache import never_cache


@never_cache
def health(request):
    """Ping léger utilisé par le frontend pour « réveiller » Render (pas d'accès BDD)."""
    return JsonResponse({'status': 'ok'})


def api_root_info(request):
    return JsonResponse({
        'name': 'Maktaba CATK API',
        'version': '1.0',
        'api': '/api/v1/',
        'health': '/api/v1/health/',
    })
