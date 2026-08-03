from rest_framework import serializers
from .models import Category


class CategoryListSerializer(serializers.ModelSerializer):
    children_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name_fr', 'name_en', 'name_ar', 'slug', 'icon', 'color', 'order', 'children_count']

    def get_children_count(self, obj):
        return obj.children.filter(is_active=True).count()


class CategoryDetailSerializer(serializers.ModelSerializer):
    children = CategoryListSerializer(many=True, read_only=True)
    parent_name = serializers.CharField(source='parent.name_fr', read_only=True, allow_null=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name_fr', 'name_en', 'name_ar', 'slug',
            'description_fr', 'description_en', 'description_ar',
            'icon', 'color', 'parent', 'parent_name', 'children',
            'order', 'is_active', 'created_at', 'updated_at',
        ]


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'name_fr', 'name_en', 'name_ar', 'slug',
            'description_fr', 'description_en', 'description_ar',
            'icon', 'color', 'parent', 'order', 'is_active',
        ]
