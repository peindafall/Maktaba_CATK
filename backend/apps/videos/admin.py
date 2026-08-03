from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'youtube_id', 'views_count', 'is_published', 'published_at']
    list_filter = ['category', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'youtube_id']
    list_per_page = 25
    readonly_fields = ['id', 'youtube_id', 'thumbnail_url', 'views_count', 'created_at', 'updated_at']
    actions = ['publish_videos', 'unpublish_videos']
    date_hierarchy = 'published_at'

    def publish_videos(self, request, queryset):
        queryset.update(is_published=True)
    publish_videos.short_description = "Publier les vidéos sélectionnées"

    def unpublish_videos(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_videos.short_description = "Dépublier les vidéos sélectionnées"
