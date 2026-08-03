from rest_framework import serializers
from .models import Audio


class AudioListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    cover_image_url = serializers.SerializerMethodField()
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Audio
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'category_name', 'language', 'cover_image_url',
            'duration_seconds', 'plays_count', 'downloads_count',
            'is_published', 'created_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_duration_seconds(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds())
        return None


class AudioDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    cover_image_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Audio
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'category', 'category_name', 'language',
            'audio_url', 'cover_image_url',
            'duration_seconds', 'file_size',
            'plays_count', 'downloads_count', 'is_published',
            'created_at', 'updated_at',
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio_file and request:
            return request.build_absolute_uri(obj.audio_file.url)
        return None

    def get_duration_seconds(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds())
        return None


class AudioCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'category', 'language', 'audio_file', 'cover_image',
            'duration', 'file_size', 'is_published',
        ]
