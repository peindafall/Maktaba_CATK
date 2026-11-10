"""
Service des fichiers médias AVEC support des requêtes « Range » (HTTP 206).

Pourquoi ? django.views.static.serve renvoie toujours le fichier entier. Sans Range :
  - les navigateurs n'arrivent pas à calculer la durée de certains audios (=> « Infinity:NaN »),
  - impossible d'avancer / reculer dans un audio,
  - Safari (iPhone / iPad) refuse carrément de lire les audios.
"""
import mimetypes
import os
import re

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse, HttpResponseNotModified
from django.utils._os import safe_join
from django.utils.http import http_date
from django.views.decorators.http import require_http_methods
from django.views.static import was_modified_since

RANGE_RE = re.compile(r'bytes=(\d*)-(\d*)$')
CHUNK_SIZE = 64 * 1024

mimetypes.add_type('audio/ogg', '.ogg')
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('audio/mp4', '.m4a')
mimetypes.add_type('audio/aac', '.aac')
mimetypes.add_type('audio/wav', '.wav')
mimetypes.add_type('image/webp', '.webp')


def _file_iterator(file_obj, offset, length):
    with file_obj:
        file_obj.seek(offset)
        remaining = length
        while remaining > 0:
            data = file_obj.read(min(CHUNK_SIZE, remaining))
            if not data:
                break
            remaining -= len(data)
            yield data


@require_http_methods(['GET', 'HEAD'])
def serve_media(request, path):
    try:
        full_path = safe_join(str(settings.MEDIA_ROOT), path)  # bloque les « ../ »
    except Exception:
        raise Http404('Fichier introuvable')
    if not os.path.isfile(full_path):
        raise Http404('Fichier introuvable')

    stat = os.stat(full_path)
    if not was_modified_since(request.META.get('HTTP_IF_MODIFIED_SINCE'), stat.st_mtime):
        return HttpResponseNotModified()

    content_type, encoding = mimetypes.guess_type(full_path)
    content_type = content_type or 'application/octet-stream'
    size = stat.st_size

    range_header = request.META.get('HTTP_RANGE', '').strip()
    match = RANGE_RE.match(range_header) if range_header else None

    if match:
        start_s, end_s = match.groups()
        if start_s == '' and end_s == '':
            match = None
        else:
            if start_s == '':  # « bytes=-500 » = 500 derniers octets
                length = min(int(end_s), size)
                start, end = size - length, size - 1
            else:
                start = int(start_s)
                end = int(end_s) if end_s else size - 1
                end = min(end, size - 1)
            if start >= size or start > end:
                resp = HttpResponse(status=416)
                resp['Content-Range'] = f'bytes */{size}'
                return resp
            length = end - start + 1
            if request.method == 'HEAD':
                resp = HttpResponse(status=206, content_type=content_type)
            else:
                from django.http import StreamingHttpResponse

                resp = StreamingHttpResponse(
                    _file_iterator(open(full_path, 'rb'), start, length),
                    status=206,
                    content_type=content_type,
                )
            resp['Content-Range'] = f'bytes {start}-{end}/{size}'
            resp['Content-Length'] = str(length)

    if not match:
        if request.method == 'HEAD':
            resp = HttpResponse(content_type=content_type)
        else:
            resp = FileResponse(open(full_path, 'rb'), content_type=content_type)
        resp['Content-Length'] = str(size)

    if encoding:
        resp['Content-Encoding'] = encoding
    resp['Accept-Ranges'] = 'bytes'
    resp['Last-Modified'] = http_date(stat.st_mtime)
    resp['Cache-Control'] = 'public, max-age=86400'
    resp['X-Content-Type-Options'] = 'nosniff'
    return resp
