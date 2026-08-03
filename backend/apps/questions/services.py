from django.db.models import F
from .models import Question


class QuestionService:
    def list_published(self):
        return Question.objects.filter(is_published=True).select_related('category').prefetch_related('answers')

    def retrieve(self, question_id):
        q = Question.objects.get(id=question_id)
        Question.objects.filter(id=question_id).update(views_count=F('views_count') + 1)
        return q
