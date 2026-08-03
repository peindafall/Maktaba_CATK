import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Green
  static const Color primaryGreen = Color(0xFF1EA478);
  static const Color primaryGreenLight = Color(0xFF1FA645);
  static const Color primaryGreenDark = Color(0xFF114D0D);

  // Gold
  static const Color goldPrimary = Color(0xFFBF8B28);
  static const Color goldLight = Color(0xFFFEFBA4);
  static const Color goldSoft = Color(0xFFFDEF72);
  static const Color goldDark = Color(0xFFA67723);

  // Yellow
  static const Color yellowLight = Color(0xFFF8EE0A);
  static const Color yellowDark = Color(0xFFDFB605);

  // Brown
  static const Color brownPrimary = Color(0xFFB35214);
  static const Color brownDark = Color(0xFF431C03);

  // Neutral
  static const Color background = Color(0xFFF8F9FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF666666);
  static const Color borderLight = Color(0xFFEAEAEA);
  static const Color error = Color(0xFFE53935);
  static const Color success = Color(0xFF43A047);

  // Dark mode
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkSurface = Color(0xFF1E1E1E);
  static const Color darkText = Color(0xFFF5F5F5);
  static const Color darkBorder = Color(0xFF2C2C2C);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryGreen, primaryGreenDark],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [goldPrimary, goldLight, goldDark],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient splashGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [primaryGreen, primaryGreenDark],
  );
}
