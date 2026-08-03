from django.db.models import F
from .models import Audio


class AudioService:
    def list_published(self):
        return Audio.objects.filter(is_published=True).select_related('category')

    def retrieve(self, audio_id):
        audio = Audio.objects.get(id=audio_id)
        Audio.objects.filter(id=audio_id).update(plays_count=F('plays_count') + 1)
        return audio

    def increment_plays(self, audio_id):
        Audio.objects.filter(id=audio_id).update(plays_count=F('plays_count') + 1)

    def increment_downloads(self, audio_id):
        Audio.objects.filter(id=audio_id).update(downloads_count=F('downloads_count') + 1)
