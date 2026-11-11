from rest_framework import serializers

from apps.categories.serializers import CategoryMiniSerializer

from .models import Answer, Question


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
    category_info = CategoryMiniSerializer(source='category', read_only=True)
    answers_count = serializers.SerializerMethodField()
    has_audio = serializers.SerializerMethodField()
    audio_answer = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'question_fr', 'question_en', 'question_ar',
            'category_name', 'category_info', 'views_count', 'answers_count', 'has_audio',
            'audio_answer', 'source', 'created_at',
        ]

    # .all() réutilise le prefetch_related('answers') -> pas de requête SQL par question
    def get_answers_count(self, obj):
        return len(obj.answers.all())

    def get_has_audio(self, obj):
        return any(a.audio_file for a in obj.answers.all())

    def get_audio_answer(self, obj):
        """Première réponse audio : permet d'écouter directement depuis la liste."""
        request = self.context.get('request')
        for a in obj.answers.all():
            if a.audio_file:
                url = a.audio_file.url
                return {
                    'id': str(a.id),
                    'audio_url': request.build_absolute_uri(url) if request else url,
                    'language': a.language,
                }
        return None


class QuestionDetailSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name_fr', read_only=True, allow_null=True)
    category_info = CategoryMiniSerializer(source='category', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar',
            'question_fr', 'question_en', 'question_ar',
            'category', 'category_name', 'category_info', 'keywords', 'source',
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


class QuestionSubmitSerializer(serializers.Serializer):
    """Question posée depuis le site (visiteur ou membre connecté). Publiée seulement après réponse."""

    title = serializers.CharField(min_length=8, max_length=300)
    question = serializers.CharField(min_length=10, max_length=4000)
    category = serializers.UUIDField(required=False, allow_null=True)
    name = serializers.CharField(max_length=120, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    language = serializers.ChoiceField(choices=['fr', 'en', 'ar'], default='fr')
    # Champ piège anti-robots : doit rester vide (caché dans le formulaire)
    website = serializers.CharField(required=False, allow_blank=True)

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError('Requête refusée.')
        return value


class MyQuestionSerializer(serializers.ModelSerializer):
    answers_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'id', 'title_fr', 'title_en', 'title_ar', 'question_fr', 'question_en', 'question_ar',
            'status', 'is_published', 'answers_count', 'created_at',
        ]

    def get_answers_count(self, obj):
        return len(obj.answers.all())
