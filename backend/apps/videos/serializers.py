from rest_framework import serializers
from .models import Video


class VideoListSerializer(serializers.ModelSerializer):
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'thumbnail_url', 'youtube_id', 'category',
            'duration_seconds', 'views_count', 'is_published', 'published_at',
        ]

    def get_duration_seconds(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds())
        return None


class VideoDetailSerializer(serializers.ModelSerializer):
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'thumbnail_url', 'youtube_url', 'youtube_id', 'category',
            'duration_seconds', 'views_count', 'is_published',
            'published_at', 'created_at', 'updated_at',
        ]

    def get_duration_seconds(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds())
        return None


class VideoCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'description_fr', 'description_en', 'description_ar',
            'youtube_url', 'youtube_id', 'thumbnail_url',
            'category', 'duration', 'published_at', 'is_published',
        ]
