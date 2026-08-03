from django.db.models import QuerySet, F
from .models import Teaching


class TeachingRepository:
    def get_published(self) -> QuerySet:
        return Teaching.objects.filter(status=Teaching.STATUS_PUBLISHED).select_related('category', 'author').prefetch_related('tags')

    def get_by_id(self, teaching_id) -> Teaching:
        return Teaching.objects.get(id=teaching_id)

    def get_featured(self) -> QuerySet:
        return self.get_published().filter(is_featured=True)

    def get_popular(self, limit: int = 10) -> QuerySet:
        return self.get_published().order_by('-views_count')[:limit]

    def increment_views(self, teaching_id) -> None:
        Teaching.objects.filter(id=teaching_id).update(views_count=F('views_count') + 1)

    def increment_downloads(self, teaching_id) -> None:
        Teaching.objects.filter(id=teaching_id).update(downloads_count=F('downloads_count') + 1)
