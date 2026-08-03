from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'document_type', 'category', 'language', 'is_published', 'downloads_count', 'created_at']
    list_filter = ['document_type', 'language', 'category', 'is_published']
    search_fields = ['title_fr', 'title_en', 'title_ar']
    list_per_page = 25
    readonly_fields = ['id', 'downloads_count', 'views_count', 'created_at', 'updated_at']
    actions = ['publish_documents', 'unpublish_documents']

    def publish_documents(self, request, queryset):
        queryset.update(is_published=True)
    publish_documents.short_description = "Publier les documents sélectionnés"

    def unpublish_documents(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_documents.short_description = "Dépublier les documents sélectionnés"
