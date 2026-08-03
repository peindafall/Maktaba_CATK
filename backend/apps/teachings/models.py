import uuid
from django.db import models
from django.utils import timezone


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Teaching(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_ARCHIVED = 'archived'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Brouillon'),
        (STATUS_PUBLISHED, 'Publié'),
        (STATUS_ARCHIVED, 'Archivé'),
    ]

    LANGUAGE_FR = 'fr'
    LANGUAGE_EN = 'en'
    LANGUAGE_AR = 'ar'
    LANGUAGE_CHOICES = [
        (LANGUAGE_FR, 'Français'),
        (LANGUAGE_EN, 'English'),
        (LANGUAGE_AR, 'العربية'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_fr = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    title_ar = models.CharField(max_length=500, blank=True)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    summary_fr = models.TextField(blank=True)
    summary_en = models.TextField(blank=True)
    summary_ar = models.TextField(blank=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, related_name='teachings'
    )
    cover_image = models.ImageField(upload_to='teachings/covers/', null=True, blank=True)
    pdf_file = models.FileField(upload_to='teachings/pdfs/', null=True, blank=True)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default=LANGUAGE_FR)
    author = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, related_name='teachings'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    tags = models.ManyToManyField(Tag, blank=True, related_name='teachings')
    views_count = models.PositiveIntegerField(default=0)
    downloads_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Enseignement'
        verbose_name_plural = 'Enseignements'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title_fr

    def publish(self):
        self.status = self.STATUS_PUBLISHED
        self.published_at = timezone.now()
        self.save()
