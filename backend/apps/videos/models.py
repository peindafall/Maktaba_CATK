import uuid
import re
from django.db import models


class Video(models.Model):
    CATEGORY_ALISLAM = 'al_islam'
    CATEGORY_QUESTION = 'juste_une_question'
    CATEGORY_CONFERENCE = 'conferences'
    CATEGORY_INTERVIEW = 'interviews'
    CATEGORY_TEACHING = 'enseignements'
    CATEGORY_OTHER = 'autres'
    VIDEO_CATEGORIES = [
        (CATEGORY_ALISLAM, 'Al Islam'),
        (CATEGORY_QUESTION, 'Juste une Question'),
        (CATEGORY_CONFERENCE, 'Conférences'),
        (CATEGORY_INTERVIEW, 'Interviews'),
        (CATEGORY_TEACHING, 'Enseignements'),
        (CATEGORY_OTHER, 'Autres'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_fr = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    title_ar = models.CharField(max_length=500, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    youtube_id = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, choices=VIDEO_CATEGORIES, default=CATEGORY_OTHER)
    duration = models.DurationField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Vidéo'
        verbose_name_plural = 'Vidéos'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title_fr

    def save(self, *args, **kwargs):
        if self.youtube_url and not self.youtube_id:
            self.youtube_id = self._extract_youtube_id(self.youtube_url)
        if self.youtube_id and not self.thumbnail_url:
            self.thumbnail_url = f'https://img.youtube.com/vi/{self.youtube_id}/maxresdefault.jpg'
        super().save(*args, **kwargs)

    @staticmethod
    def _extract_youtube_id(url: str) -> str:
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        ]
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return ''
