import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

enum CatkTextVariant {
  displayLarge,
  displayMedium,
  headlineLarge,
  headlineMedium,
  headlineSmall,
  titleLarge,
  titleMedium,
  bodyLarge,
  bodyMedium,
  bodySmall,
  labelLarge,
  labelSmall,
  arabic,
  arabicTitle,
}

class CatkText extends StatelessWidget {
  final String text;
  final CatkTextVariant variant;
  final Color? color;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;

  const CatkText(
    this.text, {
    super.key,
    this.variant = CatkTextVariant.bodyMedium,
    this.color,
    this.textAlign,
    this.maxLines,
    this.overflow,
  });

  TextStyle get _style {
    switch (variant) {
      case CatkTextVariant.displayLarge:
        return AppTypography.displayLarge;
      case CatkTextVariant.displayMedium:
        return AppTypography.displayMedium;
      case CatkTextVariant.headlineLarge:
        return AppTypography.headlineLarge;
      case CatkTextVariant.headlineMedium:
        return AppTypography.headlineMedium;
      case CatkTextVariant.headlineSmall:
        return AppTypography.headlineSmall;
      case CatkTextVariant.titleLarge:
        return AppTypography.titleLarge;
      case CatkTextVariant.titleMedium:
        return AppTypography.titleMedium;
      case CatkTextVariant.bodyLarge:
        return AppTypography.bodyLarge;
      case CatkTextVariant.bodyMedium:
        return AppTypography.bodyMedium;
      case CatkTextVariant.bodySmall:
        return AppTypography.bodySmall;
      case CatkTextVariant.labelLarge:
        return AppTypography.labelLarge;
      case CatkTextVariant.labelSmall:
        return AppTypography.labelSmall;
      case CatkTextVariant.arabic:
        return AppTypography.arabicBody;
      case CatkTextVariant.arabicTitle:
        return AppTypography.arabicTitle;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultColor =
        isDark ? AppColors.darkText : AppColors.textPrimary;

    return Text(
      text,
      style: _style.copyWith(color: color ?? defaultColor),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }
}
