from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'youtube_id', 'views_count', 'is_published', 'published_at']
    list_filter = ['category', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'youtube_id']
    list_per_page = 25
    # On retire youtube_id et thumbnail_url des readonly pour pouvoir les voir
    readonly_fields = ['id', 'views_count', 'created_at', 'updated_at', 'youtube_id_display', 'thumbnail_display']
    actions = ['publish_videos', 'unpublish_videos']
    date_hierarchy = 'published_at'

    fieldsets = (
        ('Titres', {
            'fields': ('title_fr', 'title_en', 'title_ar')
        }),
        ('Descriptions', {
            'fields': ('description_fr', 'description_en', 'description_ar')
        }),
        ('Vidéo YouTube', {
            'fields': ('youtube_url', 'youtube_id_display', 'thumbnail_display', 'duration')
        }),
        ('Métadonnées', {
            'fields': ('category', 'published_at', 'is_published')
        }),
        ('Informations', {
            'fields': ('id', 'views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def youtube_id_display(self, obj):
        return obj.youtube_id or "Pas encore extrait (enregistrez pour extraire)"
    youtube_id_display.short_description = "YouTube ID (auto)"

    def thumbnail_display(self, obj):
        if obj.thumbnail_url:
            return f'<a href="{obj.thumbnail_url}" target="_blank">{obj.thumbnail_url}</a>'
        return "Pas encore généré (enregistrez pour générer)"
    thumbnail_display.short_description = "Thumbnail URL (auto)"
    thumbnail_display.allow_tags = True

    def publish_videos(self, request, queryset):
        queryset.update(is_published=True)
    publish_videos.short_description = "Publier les vidéos sélectionnées"

    def unpublish_videos(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_videos.short_description = "Dépublier les vidéos sélectionnées"