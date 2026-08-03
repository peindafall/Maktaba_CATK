import uuid
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_fr = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    name_ar = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique=True, max_length=250)
    description_fr = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text='Emoji ou nom d\'icône')
    color = models.CharField(max_length=7, default='#000000', help_text='Couleur hex')
    parent = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL,
        related_name='children'
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['order', 'name_fr']

    def __str__(self):
        return self.name_fr

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_fr)
        super().save(*args, **kwargs)
