// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'مكتبة كاتك';

  @override
  String get navHome => 'الرئيسية';

  @override
  String get navTeachings => 'التعاليم';

  @override
  String get navAudios => 'الصوتيات';

  @override
  String get navVideos => 'الفيديوهات';

  @override
  String get navQuestions => 'الأسئلة';

  @override
  String get navSearch => 'بحث';

  @override
  String get heroTitle => 'المكتبة الرقمية للتعاليم';

  @override
  String get heroSubtitle => 'للأستاذ الشيخ أحمد تيجاني كيبي';

  @override
  String get loading => 'جارٍ التحميل...';

  @override
  String get error => 'حدث خطأ';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get seeAll => 'عرض الكل';

  @override
  String get download => 'تحميل';

  @override
  String get read => 'قراءة';

  @override
  String get play => 'استماع';

  @override
  String get watch => 'مشاهدة';

  @override
  String get search => 'بحث...';

  @override
  String get favorites => 'المفضلة';

  @override
  String get share => 'مشاركة';

  @override
  String get login => 'تسجيل الدخول';

  @override
  String get register => 'إنشاء حساب';

  @override
  String get logout => 'تسجيل الخروج';

  @override
  String get email => 'البريد الإلكتروني';

  @override
  String get password => 'كلمة المرور';

  @override
  String get forgotPassword => 'نسيت كلمة المرور؟';

  @override
  String get loginWithGoogle => 'المتابعة مع Google';

  @override
  String get createAccount => 'إنشاء حساب';

  @override
  String get featuredTeachings => 'التعاليم المميزة';

  @override
  String get popularAudios => 'الصوتيات الشائعة';

  @override
  String get latestVideos => 'أحدث المقاطع';

  @override
  String get categories => 'الفئات';

  @override
  String get profile => 'الملف الشخصي';

  @override
  String get settings => 'الإعدادات';

  @override
  String get appearance => 'المظهر';

  @override
  String get language => 'اللغة';

  @override
  String get darkMode => 'الوضع الداكن';

  @override
  String get lightMode => 'الوضع الفاتح';

  @override
  String get systemMode => 'تلقائي';

  @override
  String get aboutApp => 'حول التطبيق';

  @override
  String get version => 'الإصدار';

  @override
  String get noResults => 'لا توجد نتائج';

  @override
  String get searchHint => 'ابحث عن التعاليم والصوتيات...';

  @override
  String views(int count) {
    return '$count مشاهدة';
  }

  @override
  String downloads(int count) {
    return '$count تحميل';
  }

  @override
  String get questionAnsweredBy => 'إجابة الأستاذ كيبي';

  @override
  String get continueWithoutAccount => 'المتابعة بدون حساب';

  @override
  String get profileGuest => 'زائر';

  @override
  String get noInternet => 'لا يوجد اتصال بالإنترنت';

  @override
  String get pdfReading => 'جارٍ تحميل الوثيقة...';

  @override
  String get audioPlaying => 'جارٍ التشغيل';

  @override
  String get backToHome => 'العودة للرئيسية';
}
