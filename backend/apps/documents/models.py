import uuid
from django.db import models


class Document(models.Model):
    TYPE_BOOK = 'book'
    TYPE_ARTICLE = 'article'
    TYPE_REPORT = 'report'
    TYPE_BROCHURE = 'brochure'
    TYPE_OTHER = 'other'
    TYPE_CHOICES = [
        (TYPE_BOOK, 'Livre'),
        (TYPE_ARTICLE, 'Article'),
        (TYPE_REPORT, 'Rapport'),
        (TYPE_BROCHURE, 'Brochure'),
        (TYPE_OTHER, 'Autre'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_fr = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    title_ar = models.CharField(max_length=500, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    document_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_OTHER)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, related_name='documents'
    )
    file = models.FileField(upload_to='documents/')
    cover_image = models.ImageField(upload_to='documents/covers/', null=True, blank=True)
    language = models.CharField(max_length=5, default='fr')
    author = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, related_name='documents'
    )
    file_size = models.PositiveBigIntegerField(null=True, blank=True)
    pages_count = models.PositiveIntegerField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    downloads_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-created_at']

    def __str__(self):
        return self.title_fr
