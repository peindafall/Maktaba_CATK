from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Q

from apps.teachings.models import Teaching
from apps.teachings.serializers import TeachingListSerializer
from apps.audios.models import Audio
from apps.audios.serializers import AudioListSerializer
from apps.videos.models import Video
from apps.videos.serializers import VideoListSerializer
from apps.questions.models import Question
from apps.questions.serializers import QuestionListSerializer


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        content_type = request.query_params.get('type', 'all')
        category = request.query_params.get('category', '')
        limit = int(request.query_params.get('limit', 10))

        if not query:
            return Response({'query': query, 'results': {}, 'total': 0})

        results = {}
        ctx = {'request': request}

        if content_type in ('all', 'teachings'):
            qs = Teaching.objects.filter(status='published').filter(
                Q(title_fr__icontains=query) | Q(title_en__icontains=query) |
                Q(title_ar__icontains=query) | Q(description_fr__icontains=query) |
                Q(tags__name__icontains=query)
            ).distinct()
            if category:
                qs = qs.filter(category__slug=category)
            results['teachings'] = TeachingListSerializer(qs[:limit], many=True, context=ctx).data

        if content_type in ('all', 'audios'):
            qs = Audio.objects.filter(is_published=True).filter(
                Q(title_fr__icontains=query) | Q(title_en__icontains=query) |
                Q(title_ar__icontains=query) | Q(description_fr__icontains=query)
            )
            if category:
                qs = qs.filter(category__slug=category)
            results['audios'] = AudioListSerializer(qs[:limit], many=True, context=ctx).data

        if content_type in ('all', 'videos'):
            qs = Video.objects.filter(is_published=True).filter(
                Q(title_fr__icontains=query) | Q(title_en__icontains=query) |
                Q(title_ar__icontains=query) | Q(description_fr__icontains=query)
            )
            results['videos'] = VideoListSerializer(qs[:limit], many=True, context=ctx).data

        if content_type in ('all', 'questions'):
            qs = Question.objects.filter(is_published=True).filter(
                Q(title_fr__icontains=query) | Q(title_en__icontains=query) |
                Q(title_ar__icontains=query) | Q(question_fr__icontains=query) |
                Q(keywords__icontains=query)
            )
            results['questions'] = QuestionListSerializer(qs[:limit], many=True, context=ctx).data

        total = sum(len(v) for v in results.values())
        return Response({'query': query, 'results': results, 'total': total})
