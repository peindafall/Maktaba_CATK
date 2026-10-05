import re
from django.db.models import F
from .models import Video


class VideoService:
    def list_published(self):
        return Video.objects.filter(is_published=True)

    def retrieve(self, video_id):
        # ⚠️ On ne compte PLUS la vue ici : seul le clic sur Play compte
        return Video.objects.get(id=video_id)

    def increment_views(self, video_id):
        """Incrémente atomiquement le compteur de vues."""
        Video.objects.filter(id=video_id).update(views_count=F('views_count') + 1)

    @staticmethod
    def extract_youtube_id(url: str) -> str:
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/|youtube\.com/live/|youtube\.com/shorts/|youtube\.com/v/)([a-zA-Z0-9_-]{11})',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ''