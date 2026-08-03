#!/usr/bin/env python
import os
import sys
from pathlib import Path
from datetime import timedelta

import django
from django.core.files.base import ContentFile
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify


BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.audios.models import Audio
from apps.categories.models import Category
from apps.documents.models import Document
from apps.questions.models import Answer, Question
from apps.teachings.models import Tag, Teaching
from apps.users.models import (
    Badge,
    Collection,
    CollectionItem,
    Favorite,
    Payment,
    Subscription,
    SubscriptionPlan,
    SupportContribution,
    User,
    UserActivity,
    UserBadge,
)
from apps.videos.models import Video

YOUTUBE_CHANNEL_VIDEOS_URL = "https://www.youtube.com/@professeurcheikhtidianekebe/videos"


def ensure_text_file(field, name: str, content: str) -> None:
    should_write = False
    if not field.name:
        should_write = True
    else:
        try:
            should_write = not field.storage.exists(field.name)
        except Exception:
            should_write = True

    if should_write:
        field.save(name, ContentFile(content.encode("utf-8")), save=False)


@transaction.atomic
def seed() -> None:
    now = timezone.now()

    admin, _ = User.objects.get_or_create(
        email="admin@catk.org",
        defaults={
            "username": "admin",
            "role": User.ROLE_SUPERADMIN,
            "preferred_language": "fr",
            "is_email_verified": True,
        },
    )
    admin.set_password("Admin@CATK2024")
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()

    editor, _ = User.objects.get_or_create(
        email="editor@catk.org",
        defaults={
            "username": "editor",
            "role": User.ROLE_ADMIN,
            "preferred_language": "fr",
            "is_email_verified": True,
        },
    )
    editor.set_password("Editor@CATK2024")
    editor.is_staff = True
    editor.save()

    free_plan, _ = SubscriptionPlan.objects.get_or_create(
        code=SubscriptionPlan.PLAN_FREE,
        defaults={
            "name": "Offre Gratuite",
            "description": "Consultation libre, recherche, lecture PDF, audio standard, vidéos.",
            "price": 0,
            "currency": "XOF",
            "duration_days": 3650,
            "is_active": True,
        },
    )
    premium_plan, _ = SubscriptionPlan.objects.get_or_create(
        code=SubscriptionPlan.PLAN_PREMIUM,
        defaults={
            "name": "Offre Premium",
            "description": "Téléchargement illimité, hors ligne, playlists, recommandations, sans publicité.",
            "price": 5000,
            "currency": "XOF",
            "duration_days": 30,
            "is_active": True,
        },
    )

    subscription, _ = Subscription.objects.get_or_create(
        user=admin,
        plan=premium_plan,
        defaults={
            "start_date": now,
            "end_date": now + timedelta(days=premium_plan.duration_days),
            "status": Subscription.STATUS_ACTIVE,
            "auto_renewal": True,
        },
    )

    categories_data = [
        ("Enseignements", "Teachings", "تعاليم", "teachings", "book-open", "#1EA478", 1),
        ("Questions", "Questions", "أسئلة", "questions", "help-circle", "#BF8B28", 2),
        ("Audios", "Audios", "صوتيات", "audios", "headphones", "#1FA645", 3),
        ("Émissions", "Shows", "برامج", "videos", "video", "#A67723", 4),
    ]
    categories = {}
    for fr, en, ar, slug, icon, color, order in categories_data:
        category, _ = Category.objects.get_or_create(
            slug=slug,
            defaults={
                "name_fr": fr,
                "name_en": en,
                "name_ar": ar,
                "description_fr": f"Contenus de la rubrique {fr}",
                "description_en": f"Content for {en}",
                "description_ar": f"محتوى قسم {ar}",
                "icon": icon,
                "color": color,
                "order": order,
                "is_active": True,
            },
        )
        categories[slug] = category

    tag_fiqh, _ = Tag.objects.get_or_create(name="Fiqh", defaults={"slug": "fiqh"})
    tag_akida, _ = Tag.objects.get_or_create(name="Aqida", defaults={"slug": "aqida"})
    tag_tasawwuf, _ = Tag.objects.get_or_create(name="Tasawwuf", defaults={"slug": "tasawwuf"})

    teachings_data = [
        {
            "title_fr": "Les fondements de la foi",
            "title_en": "Foundations of Faith",
            "title_ar": "أسس الإيمان",
            "description_fr": "Introduction aux fondements de la foi.",
            "description_en": "Introduction to core principles of faith.",
            "description_ar": "مقدمة في أصول الإيمان.",
            "summary_fr": "Synthèse des piliers de la foi.",
            "summary_en": "Summary of pillars of faith.",
            "summary_ar": "ملخص أركان الإيمان.",
            "language": "fr",
            "category": categories["teachings"],
            "tags": [tag_akida, tag_fiqh],
            "featured": True,
        },
        {
            "title_fr": "La voie spirituelle au quotidien",
            "title_en": "Daily Spiritual Path",
            "title_ar": "الطريق الروحي في الحياة اليومية",
            "description_fr": "Conseils pratiques de spiritualité.",
            "description_en": "Practical spiritual guidance.",
            "description_ar": "إرشادات روحية عملية.",
            "summary_fr": "Pratiques pour renforcer la présence du coeur.",
            "summary_en": "Practices to strengthen spiritual presence.",
            "summary_ar": "ممارسات لتعزيز حضور القلب.",
            "language": "fr",
            "category": categories["teachings"],
            "tags": [tag_tasawwuf],
            "featured": False,
        },
    ]

    for item in teachings_data:
        teaching, created = Teaching.objects.get_or_create(
            title_fr=item["title_fr"],
            defaults={
                "title_en": item["title_en"],
                "title_ar": item["title_ar"],
                "description_fr": item["description_fr"],
                "description_en": item["description_en"],
                "description_ar": item["description_ar"],
                "summary_fr": item["summary_fr"],
                "summary_en": item["summary_en"],
                "summary_ar": item["summary_ar"],
                "category": item["category"],
                "language": item["language"],
                "author": admin,
                "status": Teaching.STATUS_PUBLISHED,
                "is_featured": item["featured"],
                "views_count": 0,
                "downloads_count": 0,
                "published_at": now,
            },
        )
        if created:
            teaching.save()
        if not teaching.pdf_file or not teaching.pdf_file.storage.exists(teaching.pdf_file.name):
            filename = f"{slugify(item['title_fr'])}.pdf"
            ensure_text_file(teaching.pdf_file, f"teachings/pdfs/{filename}", "PDF exemple de test")
            teaching.save()
        teaching.tags.set(item["tags"])

    documents_data = [
        ("Guide de pratique", "Practice Guide", "دليل الممارسة", Document.TYPE_BOOK),
        ("Recueil de questions", "Question Collection", "مجموعة الأسئلة", Document.TYPE_BROCHURE),
    ]
    for fr, en, ar, doc_type in documents_data:
        document, created = Document.objects.get_or_create(
            title_fr=fr,
            defaults={
                "title_en": en,
                "title_ar": ar,
                "description_fr": f"Document: {fr}",
                "description_en": f"Document: {en}",
                "description_ar": f"وثيقة: {ar}",
                "document_type": doc_type,
                "category": categories["teachings"],
                "language": "fr",
                "author": editor,
                "is_published": True,
                "published_at": now,
                "pages_count": 12,
                "views_count": 0,
                "downloads_count": 0,
            },
        )
        if created:
            document.save()
        if not document.file or not document.file.storage.exists(document.file.name):
            filename = f"{slugify(fr)}.txt"
            ensure_text_file(document.file, f"documents/{filename}", f"Contenu de {fr}")
            document.file_size = document.file.size
            document.save()

    audios_data = [
        ("Dhikr du matin", "Morning Dhikr", "أذكار الصباح"),
        ("Réponse: purification", "Answer: Purification", "جواب: الطهارة"),
    ]
    for fr, en, ar in audios_data:
        audio, created = Audio.objects.get_or_create(
            title_fr=fr,
            defaults={
                "title_en": en,
                "title_ar": ar,
                "description_fr": f"Audio: {fr}",
                "description_en": f"Audio: {en}",
                "description_ar": f"صوت: {ar}",
                "category": categories["audios"],
                "language": "fr",
                "is_published": True,
                "duration": timedelta(minutes=8),
                "plays_count": 0,
                "downloads_count": 0,
            },
        )
        if created:
            audio.save()
        if not audio.audio_file or not audio.audio_file.storage.exists(audio.audio_file.name):
            filename = f"{slugify(fr)}.mp3"
            ensure_text_file(audio.audio_file, f"audios/{filename}", "AUDIO TEST DATA")
            audio.file_size = audio.audio_file.size
            audio.save()

    videos_data = [
        (
            "Conférence: transmission du savoir",
            "Conference: Transmission of Knowledge",
            "محاضرة: نقل العلم",
            YOUTUBE_CHANNEL_VIDEOS_URL,
            Video.CATEGORY_CONFERENCE,
        ),
        (
            "Juste une question: la patience",
            "Just One Question: Patience",
            "فقط سؤال: الصبر",
            YOUTUBE_CHANNEL_VIDEOS_URL,
            Video.CATEGORY_QUESTION,
        ),
    ]
    for fr, en, ar, youtube_url, category in videos_data:
        Video.objects.update_or_create(
            title_fr=fr,
            defaults={
                "title_en": en,
                "title_ar": ar,
                "description_fr": f"Vidéo: {fr}",
                "description_en": f"Video: {en}",
                "description_ar": f"فيديو: {ar}",
                "youtube_url": youtube_url,
                "category": category,
                "duration": timedelta(minutes=18),
                "published_at": now,
                "is_published": True,
                "views_count": 0,
            },
        )

    Payment.objects.get_or_create(
        reference="PAY-CATK-0001",
        defaults={
            "user": admin,
            "subscription": subscription,
            "amount": premium_plan.price,
            "currency": premium_plan.currency,
            "payment_method": Payment.METHOD_WAVE,
            "status": Payment.STATUS_SUCCEEDED,
            "paid_at": now,
        },
    )

    question, _ = Question.objects.get_or_create(
        title_fr="Comment renforcer la sincérité dans les actes ?",
        defaults={
            "title_en": "How to strengthen sincerity in actions?",
            "title_ar": "كيف نعزز الإخلاص في الأعمال؟",
            "question_fr": "Quels conseils pratiques pour rester sincère au quotidien ?",
            "question_en": "Practical advice to stay sincere every day?",
            "question_ar": "ما النصائح العملية للبقاء على الإخلاص يوميًا؟",
            "category": categories["questions"],
            "keywords": "sincérité, intention, spiritualité",
            "is_published": True,
            "views_count": 0,
        },
    )

    answer, created = Answer.objects.get_or_create(
        question=question,
        language="fr",
        defaults={
            "transcript_fr": "La sincérité se cultive par l'intention renouvelée et le rappel.",
            "transcript_en": "Sincerity is cultivated through renewed intention and remembrance.",
            "transcript_ar": "يُنمّى الإخلاص بتجديد النية والذكر.",
            "duration": timedelta(minutes=6),
        },
    )
    if created and not answer.audio_file:
        ensure_text_file(answer.audio_file, "questions/answers/sincerite.mp3", "AUDIO ANSWER TEST DATA")
        answer.save()

    favorite, _ = Favorite.objects.get_or_create(
        user=admin,
        content_type="question",
        content_id=question.id,
        defaults={"title": question.title_fr},
    )

    collection, _ = Collection.objects.get_or_create(
        user=admin,
        name="Ma bibliothèque personnelle",
        defaults={"description": "Ressources favorites", "is_private": True},
    )
    CollectionItem.objects.get_or_create(
        collection=collection,
        content_type=favorite.content_type,
        content_id=favorite.content_id,
        defaults={"title": favorite.title},
    )

    UserActivity.objects.get_or_create(
        user=admin,
        action=UserActivity.ACTION_SEARCH,
        search_query="tarikha tidiane",
        defaults={"metadata": {"source": "seed"}},
    )

    SupportContribution.objects.get_or_create(
        user=admin,
        contribution_type=SupportContribution.TYPE_RECURRING,
        defaults={
            "amount": 2500,
            "currency": "XOF",
            "status": SupportContribution.STATUS_ACTIVE,
            "payment_method": Payment.METHOD_ORANGE_MONEY,
        },
    )

    badges = [
        ("reader_active", "Lecteur actif", "🏅"),
        ("listener_loyal", "Auditeur fidèle", "🎧"),
        ("knowledge_lover", "Passionné de savoir", "📚"),
        ("premium_supporter", "Soutien Premium", "🌟"),
        ("ambassador", "Ambassadeur", "🤝"),
    ]
    for code, name, icon in badges:
        badge, _ = Badge.objects.get_or_create(
            code=code,
            defaults={
                "name": name,
                "icon": icon,
                "description": f"Badge {name}",
                "is_active": True,
            },
        )
        UserBadge.objects.get_or_create(user=admin, badge=badge)

    print("Seed terminé avec succès.")
    print(f"Users: {User.objects.count()}")
    print(f"SubscriptionPlans: {SubscriptionPlan.objects.count()}")
    print(f"Subscriptions: {Subscription.objects.count()}")
    print(f"Payments: {Payment.objects.count()}")
    print(f"Favorites: {Favorite.objects.count()}")
    print(f"Collections: {Collection.objects.count()}")
    print(f"CollectionItems: {CollectionItem.objects.count()}")
    print(f"Activities: {UserActivity.objects.count()}")
    print(f"SupportContributions: {SupportContribution.objects.count()}")
    print(f"Badges: {Badge.objects.count()}")
    print(f"UserBadges: {UserBadge.objects.count()}")
    print(f"Categories: {Category.objects.count()}")
    print(f"Teachings: {Teaching.objects.count()}")
    print(f"Documents: {Document.objects.count()}")
    print(f"Audios: {Audio.objects.count()}")
    print(f"Videos: {Video.objects.count()}")
    print(f"Questions: {Question.objects.count()}")
    print(f"Answers: {Answer.objects.count()}")


if __name__ == "__main__":
    seed()
