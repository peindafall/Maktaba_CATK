from django.contrib import admin
from .models import Audio


@admin.register(Audio)
class AudioAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'language', 'duration', 'plays_count', 'is_published', 'created_at']
    list_filter = ['language', 'category', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar']
    list_per_page = 25
    readonly_fields = ['id', 'plays_count', 'downloads_count', 'created_at', 'updated_at']
    actions = ['publish_audios', 'unpublish_audios']

    def publish_audios(self, request, queryset):
        queryset.update(is_published=True)
    publish_audios.short_description = "Publier les audios sélectionnés"

    def unpublish_audios(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_audios.short_description = "Dépublier les audios sélectionnés"
