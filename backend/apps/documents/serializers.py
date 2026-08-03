from rest_framework import serializers
from .models import Document


class DocumentListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'document_type', 'category_name', 'cover_image_url',
            'language', 'file_size', 'pages_count',
            'downloads_count', 'views_count', 'published_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None


class DocumentDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    cover_image_url = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'document_type', 'category', 'category_name',
            'cover_image_url', 'file_url', 'language',
            'file_size', 'pages_count', 'is_published',
            'downloads_count', 'views_count', 'published_at',
            'created_at', 'updated_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class DocumentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'document_type', 'category', 'file', 'cover_image',
            'language', 'author', 'pages_count', 'is_published',
        ]
