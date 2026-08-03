import re
from django.db.models import F
from .models import Video


class VideoService:
    def list_published(self):
        return Video.objects.filter(is_published=True)

    def retrieve(self, video_id):
        video = Video.objects.get(id=video_id)
        Video.objects.filter(id=video_id).update(views_count=F('views_count') + 1)
        return video

    def increment_views(self, video_id):
        Video.objects.filter(id=video_id).update(views_count=F('views_count') + 1)

    @staticmethod
    def extract_youtube_id(url: str) -> str:
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ''
