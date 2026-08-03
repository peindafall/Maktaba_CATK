from django.contrib import admin
from .models import Category


class SubCategoryInline(admin.TabularInline):
    model = Category
    fk_name = 'parent'
    extra = 0
    fields = ['name_fr', 'slug', 'icon', 'order', 'is_active']
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_en', 'slug', 'icon', 'parent', 'order', 'is_active']
    list_filter = ['is_active', 'parent']
    search_fields = ['name_fr', 'name_en', 'slug']
    list_per_page = 25
    prepopulated_fields = {'slug': ('name_fr',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    inlines = [SubCategoryInline]
    ordering = ['order', 'name_fr']
