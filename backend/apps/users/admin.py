from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

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


class CollectionItemInline(admin.TabularInline):
    model = CollectionItem
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'role', 'is_email_verified', 'created_at']
    list_filter = ['role', 'is_email_verified', 'is_active', 'is_staff']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone', 'country']
    list_per_page = 25
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations CATK', {
            'fields': ('role', 'avatar', 'phone', 'country', 'preferred_language', 'bio', 'is_email_verified')
        }),
        ('Horodatage', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('email', 'role', 'phone', 'country', 'preferred_language'),
        }),
    )

    actions = ['make_member', 'make_admin']

    def make_member(self, request, queryset):
        queryset.update(role=User.ROLE_MEMBER)

    make_member.short_description = "Promouvoir en Membre"

    def make_admin(self, request, queryset):
        queryset.update(role=User.ROLE_ADMIN)

    make_admin.short_description = "Promouvoir en Admin"


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'preferred_language', 'email_notifications', 'push_notifications', 'in_app_notifications', 'updated_at']
    list_filter = ['preferred_language', 'email_notifications', 'push_notifications', 'in_app_notifications', 'dark_mode']
    search_fields = ['user__email', 'user__username']
    list_per_page = 25


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'price', 'currency', 'duration_days', 'is_active']
    list_filter = ['code', 'currency', 'is_active']
    search_fields = ['name', 'code']
    list_per_page = 25


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'status', 'start_date', 'end_date', 'auto_renewal']
    list_filter = ['status', 'auto_renewal', 'plan']
    search_fields = ['user__email', 'plan__name']
    list_per_page = 25


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'user', 'amount', 'currency', 'payment_method', 'status', 'paid_at']
    list_filter = ['status', 'payment_method', 'currency']
    search_fields = ['reference', 'user__email']
    list_per_page = 25


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'content_id', 'title', 'created_at']
    list_filter = ['content_type']
    search_fields = ['user__email', 'title']
    list_per_page = 25


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_private', 'updated_at']
    list_filter = ['is_private']
    search_fields = ['name', 'user__email']
    list_per_page = 25
    inlines = [CollectionItemInline]


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'content_type', 'search_query', 'created_at']
    list_filter = ['action', 'content_type']
    search_fields = ['user__email', 'search_query']
    list_per_page = 25


@admin.register(SupportContribution)
class SupportContributionAdmin(admin.ModelAdmin):
    list_display = ['user', 'contribution_type', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['contribution_type', 'status', 'currency']
    search_fields = ['user__email']
    list_per_page = 25


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'icon', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'code']
    list_per_page = 25


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user', 'badge', 'awarded_at']
    list_filter = ['badge']
    search_fields = ['user__email', 'badge__name']
    list_per_page = 25
