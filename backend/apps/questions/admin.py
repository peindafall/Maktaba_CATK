from django.contrib import admin
from .models import Question, Answer


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 0
    fields = ['language', 'audio_file', 'duration', 'transcript_fr']
    show_change_link = True


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'is_published', 'views_count', 'created_at']
    list_filter = ['is_published', 'category']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'keywords']
    list_per_page = 25
    readonly_fields = ['id', 'views_count', 'created_at', 'updated_at']
    inlines = [AnswerInline]
    actions = ['publish_questions', 'unpublish_questions']

    def publish_questions(self, request, queryset):
        queryset.update(is_published=True)
    publish_questions.short_description = "Publier les questions sélectionnées"

    def unpublish_questions(self, request, queryset):
        queryset.update(is_published=False)
    unpublish_questions.short_description = "Dépublier les questions sélectionnées"


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'language', 'duration', 'created_at']
    list_filter = ['language']
    search_fields = ['transcript_fr', 'transcript_en']
    list_per_page = 25
    readonly_fields = ['id', 'created_at', 'updated_at']
