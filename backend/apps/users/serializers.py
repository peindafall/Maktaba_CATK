from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import (
    Badge,
    Collection,
    CollectionItem,
    Favorite,
    Payment,
    Subscription,
    SubscriptionPlan,
    SupportContribution,
    User,
    UserActivity,
    UserBadge,
    UserPreference,
)


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'avatar', 'created_at']


class UserDetailSerializer(serializers.ModelSerializer):
    active_subscription = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'avatar', 'phone', 'country', 'preferred_language', 'bio',
            'active_subscription',
            'is_email_verified', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_email_verified', 'created_at', 'updated_at']

    def get_active_subscription(self, obj):
        sub = obj.subscriptions.filter(status__in=[Subscription.STATUS_ACTIVE, Subscription.STATUS_TRIAL]).order_by('-created_at').first()
        if not sub:
            return None
        return {
            'id': str(sub.id),
            'plan': sub.plan.name,
            'status': sub.status,
            'start_date': sub.start_date,
            'end_date': sub.end_date,
            'auto_renewal': sub.auto_renewal,
        }


class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=254)
    username = serializers.CharField(max_length=150, min_length=2)
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)
    password_confirm = serializers.CharField(write_only=True)
    preferred_language = serializers.ChoiceField(choices=['fr', 'en', 'ar'], required=False, default='fr')

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'preferred_language']

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'Un compte existe déjà avec cet email. Connectez-vous ou utilisez « Mot de passe oublié ».',
                code='email_taken',
            )
        return value

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.", code='username_taken')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Les mots de passe ne correspondent pas.'})
        # Validation Django (longueur, mot de passe trop courant, ressemblance avec l'email...)
        candidate = User(email=attrs.get('email'), username=attrs.get('username'))
        try:
            validate_password(attrs['password'], user=candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    preferred_language = serializers.ChoiceField(choices=['fr', 'en', 'ar'], required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'avatar', 'phone', 'country', 'preferred_language', 'bio']

    def validate_avatar(self, value):
        if value and value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('Image trop lourde (2 Mo maximum).')
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Mot de passe actuel incorrect.')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)


class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = [
            'preferred_language', 'email_notifications', 'push_notifications',
            'in_app_notifications', 'dark_mode', 'updated_at',
        ]
        read_only_fields = ['updated_at']


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            'id', 'code', 'name', 'description', 'price', 'currency',
            'duration_days', 'is_active',
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_detail = SubscriptionPlanSerializer(source='plan', read_only=True)

    class Meta:
        model = Subscription
        fields = [
            'id', 'plan', 'plan_detail', 'start_date', 'end_date',
            'status', 'auto_renewal', 'created_at', 'updated_at',
        ]
        # Le statut / les dates sont gérés par le serveur (après paiement), jamais par le client
        read_only_fields = ['id', 'start_date', 'end_date', 'status', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    subscription_id = serializers.UUIDField(source='subscription.id', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'reference', 'subscription_id', 'amount', 'currency',
            'payment_method', 'status', 'invoice', 'paid_at', 'created_at',
        ]
        read_only_fields = ['id', 'reference', 'status', 'invoice', 'paid_at', 'created_at']


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ['id', 'content_type', 'content_id', 'title', 'created_at']
        read_only_fields = ['id', 'created_at']


class FavoriteToggleSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=['teaching', 'audio', 'video', 'question'])
    content_id = serializers.UUIDField()


class CollectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionItem
        fields = ['id', 'content_type', 'content_id', 'title', 'added_at']
        read_only_fields = ['id', 'added_at']


class CollectionSerializer(serializers.ModelSerializer):
    items = CollectionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ['id', 'name', 'description', 'is_private', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = [
            'id', 'action', 'content_type', 'content_id', 'search_query',
            'metadata', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class SupportContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportContribution
        fields = [
            'id', 'contribution_type', 'amount', 'currency', 'status',
            'payment_method', 'receipt', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'receipt', 'created_at']


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'code', 'name', 'icon', 'description', 'is_active']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'awarded_at']
