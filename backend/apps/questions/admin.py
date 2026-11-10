from django.conf import settings
from django.contrib import admin, messages

from apps.users.services import safe_send_mail

from .models import Answer, Question


class AnswerInline(admin.StackedInline):
    model = Answer
    extra = 1
    fields = ['language', 'audio_file', 'duration', 'transcript_fr', 'transcript_en', 'transcript_ar']
    show_change_link = True


class SourceFilter(admin.SimpleListFilter):
    title = 'origine'
    parameter_name = 'origine'

    def lookups(self, request, model_admin):
        return [('public_pending', '📩 Questions de visiteurs en attente')] + list(Question.SOURCE_CHOICES)

    def queryset(self, request, queryset):
        if self.value() == 'public_pending':
            return queryset.filter(source=Question.SOURCE_PUBLIC, status=Question.STATUS_PENDING)
        if self.value():
            return queryset.filter(source=self.value())
        return queryset


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'source', 'status', 'submitter_name', 'category', 'is_published', 'views_count', 'created_at']
    list_filter = [SourceFilter, 'status', 'is_published', 'category']
    search_fields = ['title_fr', 'title_en', 'title_ar', 'keywords', 'submitter_name', 'submitter_email']
    list_per_page = 25
    readonly_fields = ['id', 'views_count', 'created_at', 'updated_at', 'submitted_by']
    inlines = [AnswerInline]
    actions = ['publish_questions', 'unpublish_questions', 'reject_questions']
    fieldsets = (
        ('Question', {'fields': ('title_fr', 'title_en', 'title_ar', 'question_fr', 'question_en', 'question_ar')}),
        ('Classement', {'fields': ('category', 'keywords', 'is_published', 'status')}),
        ('Demandeur (questions envoyées depuis le site)', {
            'fields': ('source', 'submitted_by', 'submitter_name', 'submitter_email', 'submitter_language'),
            'classes': ('collapse',),
        }),
        ('Informations', {'fields': ('id', 'views_count', 'created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        question = form.instance
        # Publiée + au moins une réponse => la question passe « Répondue » et le demandeur est prévenu
        if question.is_published and question.status == Question.STATUS_PENDING and question.answers.exists():
            question.status = Question.STATUS_ANSWERED
            question.save(update_fields=['status'])
            self._notify_submitter(request, question)

    def _notify_submitter(self, request, question):
        if not question.submitter_email:
            return
        url = f'{settings.FRONTEND_URL}/questions/{question.id}'
        safe_send_mail(
            'Votre question a reçu une réponse - Maktaba CATK',
            f'Assalamou aleykoum {question.submitter_name or ""},\n\n'
            f'Le Professeur a répondu à votre question « {question.title_fr} ».\n'
            f'Écoutez / lisez la réponse ici : {url}\n\nMaktaba CATK',
            [question.submitter_email],
        )
        messages.info(request, f'Le demandeur ({question.submitter_email}) a été prévenu par email.')

    @admin.action(description='Publier les questions sélectionnées')
    def publish_questions(self, request, queryset):
        queryset.update(is_published=True)
        queryset.filter(status=Question.STATUS_PENDING, answers__isnull=False).update(status=Question.STATUS_ANSWERED)

    @admin.action(description='Dépublier les questions sélectionnées')
    def unpublish_questions(self, request, queryset):
        queryset.update(is_published=False)

    @admin.action(description='Rejeter (question hors sujet / spam)')
    def reject_questions(self, request, queryset):
        queryset.update(is_published=False, status=Question.STATUS_REJECTED)


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'language', 'duration', 'created_at']
    list_filter = ['language']
    search_fields = ['transcript_fr', 'transcript_en']
    list_per_page = 25
    readonly_fields = ['id', 'created_at', 'updated_at']
