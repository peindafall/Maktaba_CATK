from django.db.models import QuerySet
from .models import User


class UserRepository:
    def get_by_id(self, user_id) -> User:
        return User.objects.get(id=user_id)

    def get_by_email(self, email: str) -> User:
        return User.objects.get(email=email)

    def get_all(self) -> QuerySet:
        return User.objects.all()

    def get_members(self) -> QuerySet:
        return User.objects.filter(role__in=[User.ROLE_MEMBER, User.ROLE_ADMIN, User.ROLE_SUPERADMIN])

    def create(self, **kwargs) -> User:
        return User.objects.create_user(**kwargs)

    def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            setattr(user, key, value)
        user.save()
        return user

    def verify_email(self, user: User) -> User:
        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        return user
