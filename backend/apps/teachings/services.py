from .repositories import TeachingRepository


class TeachingService:
    def __init__(self):
        self.repository = TeachingRepository()

    def list_published(self):
        return self.repository.get_published()

    def retrieve(self, teaching_id):
        teaching = self.repository.get_by_id(teaching_id)
        self.repository.increment_views(teaching_id)
        return teaching

    def increment_views(self, teaching_id):
        self.repository.increment_views(teaching_id)

    def increment_downloads(self, teaching_id):
        self.repository.increment_downloads(teaching_id)

    def get_featured(self):
        return self.repository.get_featured()

    def get_popular(self, limit: int = 10):
        return self.repository.get_popular(limit)
