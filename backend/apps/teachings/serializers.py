from rest_framework import serializers
from .models import Teaching, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class TeachingListSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Teaching
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'category_name', 'cover_image_url', 'language',
            'views_count', 'downloads_count', 'published_at',
            'is_featured', 'author_name', 'status',
        ]

    def get_category_name(self, obj):
        return obj.category.name_fr if obj.category else None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.email
        return None


class TeachingDetailSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    category_name = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    pdf_file_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Teaching
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'summary_fr', 'summary_en', 'summary_ar',
            'category', 'category_name', 'cover_image_url', 'pdf_file_url',
            'language', 'author', 'author_name', 'status', 'tags',
            'views_count', 'downloads_count', 'is_featured',
            'published_at', 'created_at', 'updated_at',
        ]

    def get_category_name(self, obj):
        return obj.category.name_fr if obj.category else None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_pdf_file_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file and request:
            return request.build_absolute_uri(obj.pdf_file.url)
        return None

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.email
        return None


class TeachingCreateUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )

    class Meta:
        model = Teaching
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'summary_fr', 'summary_en', 'summary_ar',
            'category', 'cover_image', 'pdf_file',
            'language', 'author', 'status', 'tags', 'is_featured',
        ]
