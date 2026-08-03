import 'package:intl/intl.dart';

class DateFormatter {
  DateFormatter._();

  static String format(DateTime date, {String locale = 'fr'}) {
    return DateFormat('d MMMM yyyy', locale).format(date);
  }

  static String formatShort(DateTime date, {String locale = 'fr'}) {
    return DateFormat('dd/MM/yyyy', locale).format(date);
  }

  static String formatRelative(DateTime date, {String locale = 'fr'}) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays == 0) {
      if (diff.inHours == 0) {
        if (diff.inMinutes == 0) return "À l'instant";
        return 'Il y a ${diff.inMinutes} min';
      }
      return 'Il y a ${diff.inHours} h';
    } else if (diff.inDays == 1) {
      return 'Hier';
    } else if (diff.inDays < 7) {
      return 'Il y a ${diff.inDays} jours';
    } else {
      return format(date, locale: locale);
    }
  }

  static String formatFromIso(String isoString, {String locale = 'fr'}) {
    try {
      final date = DateTime.parse(isoString).toLocal();
      return format(date, locale: locale);
    } catch (_) {
      return isoString;
    }
  }
}
