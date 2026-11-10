import uuid

from django.conf import settings
from django.db import models


class Question(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_fr = models.CharField(max_length=500)
    title_en = models.CharField(max_length=500, blank=True)
    title_ar = models.CharField(max_length=500, blank=True)
    question_fr = models.TextField(blank=True)
    question_en = models.TextField(blank=True)
    question_ar = models.TextField(blank=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, related_name='questions'
    )
    keywords = models.TextField(blank=True, help_text='Mots-clés séparés par des virgules')
    is_published = models.BooleanField(default=False)

    # --- Questions envoyées depuis le site par les visiteurs / membres ---
    SOURCE_ADMIN = 'admin'
    SOURCE_PUBLIC = 'public'
    SOURCE_CHOICES = [(SOURCE_ADMIN, 'Ajoutée par l\'admin'), (SOURCE_PUBLIC, 'Envoyée par un visiteur')]

    STATUS_PENDING = 'pending'
    STATUS_ANSWERED = 'answered'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'En attente de réponse'),
        (STATUS_ANSWERED, 'Répondue'),
        (STATUS_REJECTED, 'Rejetée'),
    ]

    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default=SOURCE_ADMIN)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_ANSWERED)
    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='submitted_questions',
    )
    submitter_name = models.CharField('Nom du demandeur', max_length=120, blank=True)
    submitter_email = models.EmailField('Email du demandeur', blank=True)
    submitter_language = models.CharField(max_length=5, default='fr')
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Question'
        verbose_name_plural = 'Questions'
        ordering = ['-created_at']

    def __str__(self):
        return self.title_fr


class Answer(models.Model):
    LANGUAGE_CHOICES = [('fr', 'Français'), ('en', 'English'), ('ar', 'العربية')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    audio_file = models.FileField(upload_to='questions/answers/', null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    transcript_fr = models.TextField(blank=True)
    transcript_en = models.TextField(blank=True)
    transcript_ar = models.TextField(blank=True)
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Réponse'
        verbose_name_plural = 'Réponses'
        ordering = ['created_at']

    def __str__(self):
        return f"Réponse à: {self.question.title_fr}"
