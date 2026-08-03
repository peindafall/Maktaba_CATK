from django.contrib import admin
from django.utils import timezone
from .models import Teaching, Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Teaching)
class TeachingAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'language', 'status', 'views_count', 'downloads_count', 'is_featured', 'published_at']
    list_filter = ['status', 'language', 'category', 'is_featured']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'description_fr']
    list_per_page = 25
    readonly_fields = ['id', 'views_count', 'downloads_count', 'created_at', 'updated_at']
    filter_horizontal = ['tags']
    actions = ['publish_teachings', 'archive_teachings', 'feature_teachings']
    date_hierarchy = 'published_at'

    fieldsets = (
        ('Titre', {'fields': ('title_fr', 'title_en', 'title_ar')}),
        ('Description', {'fields': ('description_fr', 'description_en', 'description_ar')}),
        ('Résumé', {'fields': ('summary_fr', 'summary_en', 'summary_ar'), 'classes': ('collapse',)}),
        ('Métadonnées', {'fields': ('category', 'language', 'author', 'status', 'tags', 'is_featured')}),
        ('Fichiers', {'fields': ('cover_image', 'pdf_file')}),
        ('Statistiques', {'fields': ('views_count', 'downloads_count', 'published_at'), 'classes': ('collapse',)}),
        ('Horodatage', {'fields': ('id', 'created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def publish_teachings(self, request, queryset):
        queryset.update(status=Teaching.STATUS_PUBLISHED, published_at=timezone.now())
    publish_teachings.short_description = "Publier les enseignements sélectionnés"

    def archive_teachings(self, request, queryset):
        queryset.update(status=Teaching.STATUS_ARCHIVED)
    archive_teachings.short_description = "Archiver les enseignements sélectionnés"

    def feature_teachings(self, request, queryset):
        queryset.update(is_featured=True)
    feature_teachings.short_description = "Mettre en vedette"
