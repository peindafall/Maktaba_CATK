import logging

from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .repositories import UserRepository

logger = logging.getLogger(__name__)


def safe_cache_set(key, value, timeout):
    """Le cache ne doit JAMAIS faire échouer une requête (ex : Redis indisponible)."""
    try:
        cache.set(key, value, timeout=timeout)
        return True
    except Exception:  # pragma: no cover - dépend de l'infra
        logger.exception('Cache indisponible (set %s)', key)
        return False


def safe_cache_get(key):
    try:
        return cache.get(key)
    except Exception:  # pragma: no cover
        logger.exception('Cache indisponible (get %s)', key)
        return None


def safe_cache_delete(key):
    try:
        cache.delete(key)
    except Exception:  # pragma: no cover
        logger.exception('Cache indisponible (delete %s)', key)


def safe_send_mail(subject, message, recipients):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=True,
        )
    except Exception:  # pragma: no cover
        logger.exception("Envoi d'email impossible")


class UserService:
    def __init__(self):
        self.repository = UserRepository()

    def register(self, email: str, username: str, password: str, **kwargs) -> User:
        user = self.repository.create(email=email, username=username, password=password, **kwargs)
        # L'email de vérification est un « bonus » : son échec ne doit pas faire échouer l'inscription.
        try:
            self._send_verification_email(user)
        except Exception:
            logger.exception('Email de vérification non envoyé pour %s', user.pk)
        return user

    def _send_verification_email(self, user: User):
        token = get_random_string(64)
        if not safe_cache_set(f'email_verify_{token}', str(user.id), timeout=86400):
            return
        safe_send_mail(
            'Vérifiez votre adresse email - Maktaba CATK',
            f'Assalamou aleykoum {user.username},\n\n'
            f'Cliquez sur ce lien pour vérifier votre email : '
            f'{settings.FRONTEND_URL}/verifier-email?token={token}\n\nMaktaba CATK',
            [user.email],
        )

    def verify_email(self, token: str) -> bool:
        user_id = safe_cache_get(f'email_verify_{token}')
        if not user_id:
            return False
        try:
            user = self.repository.get_by_id(user_id)
        except User.DoesNotExist:
            return False
        self.repository.verify_email(user)
        safe_cache_delete(f'email_verify_{token}')
        return True

    def reset_password_request(self, email: str) -> bool:
        try:
            user = User.objects.get(email__iexact=email.strip())
        except User.DoesNotExist:
            return False
        token = get_random_string(64)
        if not safe_cache_set(f'pwd_reset_{token}', str(user.id), timeout=3600):
            return False
        safe_send_mail(
            'Réinitialisation de mot de passe - Maktaba CATK',
            'Cliquez sur ce lien pour réinitialiser votre mot de passe (valable 1 heure) : '
            f'{settings.FRONTEND_URL}/reinitialiser-mot-de-passe?token={token}\n\n'
            "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
            [user.email],
        )
        return True

    def reset_password_confirm(self, token: str, new_password: str) -> bool:
        user_id = safe_cache_get(f'pwd_reset_{token}')
        if not user_id:
            return False
        try:
            user = self.repository.get_by_id(user_id)
        except User.DoesNotExist:
            return False
        user.set_password(new_password)
        user.save(update_fields=['password'])
        safe_cache_delete(f'pwd_reset_{token}')
        return True

    def get_tokens_for_user(self, user: User) -> dict:
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
