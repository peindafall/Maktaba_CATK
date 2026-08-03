class DurationFormatter {
  DurationFormatter._();

  static String format(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    final seconds = duration.inSeconds.remainder(60);

    if (hours > 0) {
      return '${_pad(hours)}:${_pad(minutes)}:${_pad(seconds)}';
    }
    return '${_pad(minutes)}:${_pad(seconds)}';
  }

  static String formatFromSeconds(int totalSeconds) {
    return format(Duration(seconds: totalSeconds));
  }

  static String formatFromMilliseconds(int milliseconds) {
    return format(Duration(milliseconds: milliseconds));
  }

  static String humanReadable(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);

    if (hours > 0 && minutes > 0) {
      return '${hours}h ${minutes}min';
    } else if (hours > 0) {
      return '${hours}h';
    } else if (minutes > 0) {
      return '${minutes}min';
    }
    return '${duration.inSeconds}s';
  }

  static String _pad(int value) => value.toString().padLeft(2, '0');
}
