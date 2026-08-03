from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .repositories import UserRepository


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    def register(self, email: str, username: str, password: str, **kwargs) -> User:
        user = self.repository.create(email=email, username=username, password=password, **kwargs)
        self._send_verification_email(user)
        return user

    def _send_verification_email(self, user: User):
        token = get_random_string(64)
        # Store token in cache or DB for verification
        from django.core.cache import cache
        cache.set(f'email_verify_{token}', str(user.id), timeout=86400)
        send_mail(
            subject='Vérifiez votre adresse email - Maktaba CATK',
            message=f'Cliquez sur ce lien pour vérifier votre email: {settings.FRONTEND_URL}/verify-email?token={token}',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )

    def verify_email(self, token: str) -> bool:
        from django.core.cache import cache
        user_id = cache.get(f'email_verify_{token}')
        if not user_id:
            return False
        try:
            user = self.repository.get_by_id(user_id)
            self.repository.verify_email(user)
            cache.delete(f'email_verify_{token}')
            return True
        except User.DoesNotExist:
            return False

    def reset_password_request(self, email: str) -> bool:
        try:
            user = self.repository.get_by_email(email)
            token = get_random_string(64)
            from django.core.cache import cache
            cache.set(f'pwd_reset_{token}', str(user.id), timeout=3600)
            send_mail(
                subject='Réinitialisation de mot de passe - Maktaba CATK',
                message=f'Cliquez sur ce lien pour réinitialiser votre mot de passe: {settings.FRONTEND_URL}/reset-password?token={token}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
            return True
        except User.DoesNotExist:
            return False

    def reset_password_confirm(self, token: str, new_password: str) -> bool:
        from django.core.cache import cache
        user_id = cache.get(f'pwd_reset_{token}')
        if not user_id:
            return False
        try:
            user = self.repository.get_by_id(user_id)
            user.set_password(new_password)
            user.save()
            cache.delete(f'pwd_reset_{token}')
            return True
        except User.DoesNotExist:
            return False

    def get_tokens_for_user(self, user: User) -> dict:
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
