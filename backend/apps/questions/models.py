import uuid
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
