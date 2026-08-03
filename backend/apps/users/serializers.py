from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
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
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'preferred_language']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Les mots de passe ne correspondent pas.'})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'avatar', 'phone', 'country', 'preferred_language', 'bio']


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
        read_only_fields = ['id', 'created_at', 'updated_at']


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
