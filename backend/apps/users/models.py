import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_VISITOR = 'visitor'
    ROLE_MEMBER = 'member'
    ROLE_ADMIN = 'admin'
    ROLE_SUPERADMIN = 'superadmin'
    ROLES = [
        (ROLE_VISITOR, 'Visiteur'),
        (ROLE_MEMBER, 'Membre'),
        (ROLE_ADMIN, 'Admin'),
        (ROLE_SUPERADMIN, 'Super Admin'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLES, default=ROLE_VISITOR)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=120, blank=True)
    preferred_language = models.CharField(max_length=5, default='fr')
    bio = models.TextField(blank=True)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def is_admin(self):
        return self.role in (self.ROLE_ADMIN, self.ROLE_SUPERADMIN)

    @property
    def is_member(self):
        return self.role in (self.ROLE_MEMBER, self.ROLE_ADMIN, self.ROLE_SUPERADMIN)


class ContentTypeChoice(models.TextChoices):
    TEACHING = 'teaching', 'Teaching'
    DOCUMENT = 'document', 'Document'
    AUDIO = 'audio', 'Audio'
    VIDEO = 'video', 'Video'
    QUESTION = 'question', 'Question'


class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    preferred_language = models.CharField(max_length=5, default='fr')
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)
    dark_mode = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Préférence utilisateur'
        verbose_name_plural = 'Préférences utilisateurs'

    def __str__(self):
        return f"Préférences de {self.user.email}"


class SubscriptionPlan(models.Model):
    PLAN_FREE = 'free'
    PLAN_PREMIUM = 'premium'
    PLAN_PRO = 'pro'
    PLAN_CHOICES = [
        (PLAN_FREE, 'Gratuit'),
        (PLAN_PREMIUM, 'Premium'),
        (PLAN_PRO, 'Pro'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='XOF')
    duration_days = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price', 'name']

    def __str__(self):
        return f"{self.name} ({self.currency} {self.price})"


class Subscription(models.Model):
    STATUS_ACTIVE = 'active'
    STATUS_TRIAL = 'trial'
    STATUS_EXPIRED = 'expired'
    STATUS_CANCELED = 'canceled'
    STATUS_CHOICES = [
        (STATUS_ACTIVE, 'Actif'),
        (STATUS_TRIAL, 'Essai'),
        (STATUS_EXPIRED, 'Expiré'),
        (STATUS_CANCELED, 'Résilié'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.PROTECT, related_name='subscriptions')
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    auto_renewal = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"


class Payment(models.Model):
    METHOD_STRIPE = 'stripe'
    METHOD_PAYPAL = 'paypal'
    METHOD_WAVE = 'wave'
    METHOD_ORANGE_MONEY = 'orange_money'
    METHOD_FREE_MONEY = 'free_money'
    METHOD_MTN_MOMO = 'mtn_momo'
    METHOD_MOOV_MONEY = 'moov_money'
    METHODS = [
        (METHOD_STRIPE, 'Stripe'),
        (METHOD_PAYPAL, 'PayPal'),
        (METHOD_WAVE, 'Wave'),
        (METHOD_ORANGE_MONEY, 'Orange Money'),
        (METHOD_FREE_MONEY, 'Free Money'),
        (METHOD_MTN_MOMO, 'MTN Mobile Money'),
        (METHOD_MOOV_MONEY, 'Moov Money'),
    ]

    STATUS_PENDING = 'pending'
    STATUS_SUCCEEDED = 'succeeded'
    STATUS_FAILED = 'failed'
    STATUS_REFUNDED = 'refunded'
    STATUSES = [
        (STATUS_PENDING, 'En attente'),
        (STATUS_SUCCEEDED, 'Réussi'),
        (STATUS_FAILED, 'Échoué'),
        (STATUS_REFUNDED, 'Remboursé'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    reference = models.CharField(max_length=120, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='XOF')
    payment_method = models.CharField(max_length=30, choices=METHODS)
    status = models.CharField(max_length=20, choices=STATUSES, default=STATUS_PENDING)
    invoice = models.FileField(upload_to='payments/invoices/', null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.reference


class Favorite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    content_type = models.CharField(max_length=20, choices=ContentTypeChoice.choices)
    content_id = models.UUIDField()
    title = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'content_type', 'content_id'], name='uniq_user_favorite_content')
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.content_type}"


class Collection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collections')
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'name'], name='uniq_collection_name_per_user')
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.email} - {self.name}"


class CollectionItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='items')
    content_type = models.CharField(max_length=20, choices=ContentTypeChoice.choices)
    content_id = models.UUIDField()
    title = models.CharField(max_length=500, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['collection', 'content_type', 'content_id'], name='uniq_collection_item')
        ]
        ordering = ['-added_at']

    def __str__(self):
        return f"{self.collection.name} - {self.content_type}"


class UserActivity(models.Model):
    ACTION_VIEW = 'view'
    ACTION_DOWNLOAD = 'download'
    ACTION_PLAY = 'play'
    ACTION_SEARCH = 'search'
    ACTIONS = [
        (ACTION_VIEW, 'Consultation'),
        (ACTION_DOWNLOAD, 'Téléchargement'),
        (ACTION_PLAY, 'Lecture'),
        (ACTION_SEARCH, 'Recherche'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=20, choices=ACTIONS)
    content_type = models.CharField(max_length=20, choices=ContentTypeChoice.choices, blank=True)
    content_id = models.UUIDField(null=True, blank=True)
    search_query = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.action}"


class SupportContribution(models.Model):
    TYPE_ONE_TIME = 'one_time'
    TYPE_RECURRING = 'recurring'
    TYPE_SPONSORSHIP = 'sponsorship'
    TYPE_FREE = 'free'
    TYPES = [
        (TYPE_ONE_TIME, 'Don unique'),
        (TYPE_RECURRING, 'Don récurrent'),
        (TYPE_SPONSORSHIP, 'Parrainage'),
        (TYPE_FREE, 'Contribution libre'),
    ]

    STATUS_ACTIVE = 'active'
    STATUS_STOPPED = 'stopped'
    STATUS_PENDING = 'pending'
    STATUSES = [
        (STATUS_ACTIVE, 'Actif'),
        (STATUS_STOPPED, 'Arrêté'),
        (STATUS_PENDING, 'En attente'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_contributions')
    contribution_type = models.CharField(max_length=20, choices=TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='XOF')
    status = models.CharField(max_length=20, choices=STATUSES, default=STATUS_PENDING)
    payment_method = models.CharField(max_length=30, choices=Payment.METHODS, blank=True)
    receipt = models.FileField(upload_to='support/receipts/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.contribution_type}"


class Badge(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=120)
    icon = models.CharField(max_length=10, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='users')
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'badge'], name='uniq_user_badge')
        ]
        ordering = ['-awarded_at']

    def __str__(self):
        return f"{self.user.email} - {self.badge.name}"
