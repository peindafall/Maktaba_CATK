import uuid
from django.db import models


class ContentView(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('teaching', 'Enseignement'),
        ('audio', 'Audio'),
        ('video', 'Vidéo'),
        ('question', 'Question'),
        ('document', 'Document'),
    ]

    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    content_id = models.UUIDField()
    user = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='content_views'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Vue de contenu'
        verbose_name_plural = 'Vues de contenu'
        indexes = [
            models.Index(fields=['content_type', 'content_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.content_type} {self.content_id} - {self.created_at.date()}"


class Download(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('teaching', 'Enseignement'),
        ('audio', 'Audio'),
        ('document', 'Document'),
    ]

    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    content_id = models.UUIDField()
    user = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='downloads'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Téléchargement'
        verbose_name_plural = 'Téléchargements'
        indexes = [
            models.Index(fields=['content_type', 'content_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.content_type} {self.content_id} - {self.created_at.date()}"
