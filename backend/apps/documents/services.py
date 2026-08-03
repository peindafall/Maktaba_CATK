from django.db.models import F
from .models import Document


class DocumentService:
    def list_published(self):
        return Document.objects.filter(is_published=True).select_related('category', 'author')

    def retrieve(self, document_id):
        doc = Document.objects.get(id=document_id)
        Document.objects.filter(id=document_id).update(views_count=F('views_count') + 1)
        return doc

    def increment_downloads(self, document_id):
        Document.objects.filter(id=document_id).update(downloads_count=F('downloads_count') + 1)
