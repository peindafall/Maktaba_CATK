from rest_framework import serializers
from .models import Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = [
            'id', 'audio_url', 'duration',
            'transcript_fr', 'transcript_en', 'transcript_ar',
            'language', 'created_at',
        ]

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio_file and request:
            return request.build_absolute_uri(obj.audio_file.url)
        return None


class QuestionListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    answers_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'category_name', 'views_count', 'answers_count', 'created_at',
        ]

    def get_answers_count(self, obj):
        return obj.answers.count()


class QuestionDetailSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)

    class Meta:
        model = Question
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'question_fr', 'question_en', 'question_ar',
            'category', 'category_name', 'keywords',
            'is_published', 'views_count', 'answers',
            'created_at', 'updated_at',
        ]


class QuestionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            'title_fr', 'title_en', 'title_ar',
            'question_fr', 'question_en', 'question_ar',
            'category', 'keywords', 'is_published',
        ]
