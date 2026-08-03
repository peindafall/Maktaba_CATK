from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from apps.teachings.models import Teaching
from apps.audios.models import Audio
from apps.videos.models import Video
from apps.questions.models import Question
from apps.users.models import User
from .models import ContentView, Download


class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = date.today()
        return Response({
            'teachings': {
                'total': Teaching.objects.count(),
                'published': Teaching.objects.filter(status='published').count(),
                'draft': Teaching.objects.filter(status='draft').count(),
            },
            'audios': {
                'total': Audio.objects.count(),
                'published': Audio.objects.filter(is_published=True).count(),
            },
            'videos': {
                'total': Video.objects.count(),
                'published': Video.objects.filter(is_published=True).count(),
            },
            'questions': {
                'total': Question.objects.count(),
                'published': Question.objects.filter(is_published=True).count(),
            },
            'users': {
                'total': User.objects.count(),
                'members': User.objects.filter(role='member').count(),
                'admins': User.objects.filter(role__in=['admin', 'superadmin']).count(),
            },
            'views_today': ContentView.objects.filter(created_at__date=today).count(),
            'downloads_today': Download.objects.filter(created_at__date=today).count(),
            'views_total': ContentView.objects.count(),
            'downloads_total': Download.objects.count(),
        })
