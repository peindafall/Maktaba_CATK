import uuid
from django.db import models


class Audio(models.Model):
    LANGUAGE_CHOICES = [('fr', 'Français'), ('en', 'English'), ('ar', 'العربية')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_fr = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    title_ar = models.CharField(max_length=500, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, related_name='audios'
    )
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='fr')
    audio_file = models.FileField(upload_to='audios/')
    cover_image = models.ImageField(upload_to='audios/covers/', null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    file_size = models.PositiveBigIntegerField(null=True, blank=True)
    plays_count = models.PositiveIntegerField(default=0)
    downloads_count = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Audio'
        verbose_name_plural = 'Audios'
        ordering = ['-created_at']

    def __str__(self):
        return self.title_fr
