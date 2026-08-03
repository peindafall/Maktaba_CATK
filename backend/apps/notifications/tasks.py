from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_welcome_email(user_id: str, user_email: str, username: str):
    send_mail(
        subject='Bienvenue sur Maktaba CATK',
        message=f'Bonjour {username},\n\nBienvenue sur la bibliothèque numérique des enseignements du Professeur Cheikh Ahmet Tidiane KEBE.\n\nCordialement,\nL\'équipe CATK',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=True,
    )


@shared_task
def send_email_verification(user_email: str, token: str):
    from django.conf import settings
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    send_mail(
        subject='Vérifiez votre email - Maktaba CATK',
        message=f'Cliquez sur ce lien pour vérifier votre email:\n{frontend_url}/verify-email?token={token}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=True,
    )


@shared_task
def send_password_reset_email(user_email: str, token: str):
    from django.conf import settings
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    send_mail(
        subject='Réinitialisation de mot de passe - Maktaba CATK',
        message=f'Cliquez sur ce lien pour réinitialiser votre mot de passe:\n{frontend_url}/reset-password?token={token}',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user_email],
        fail_silently=True,
    )


@shared_task
def create_notification(user_id: str, title: str, message: str, notification_type: str = 'info', data: dict = None):
    from apps.notifications.models import Notification
    from apps.users.models import User
    try:
        user = User.objects.get(id=user_id)
        Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            data=data,
        )
    except User.DoesNotExist:
        pass
