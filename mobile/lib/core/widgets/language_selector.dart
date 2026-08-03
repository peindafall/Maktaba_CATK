import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../utils/language_helper.dart';

class LanguageSelector extends StatelessWidget {
  final String currentLocale;
  final ValueChanged<String> onLocaleChanged;

  const LanguageSelector({
    super.key,
    required this.currentLocale,
    required this.onLocaleChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: LanguageHelper.supportedLocales.map((code) {
        final isSelected = code == currentLocale;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: InkWell(
            onTap: () => onLocaleChanged(code),
            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primaryGreen
                    : AppColors.primaryGreen.withOpacity(0.1),
                borderRadius:
                    BorderRadius.circular(AppDimensions.radiusMd),
                border: isSelected
                    ? null
                    : Border.all(
                        color: AppColors.primaryGreen.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    LanguageHelper.getLanguageFlag(code),
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    LanguageHelper.getLanguageName(code),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: isSelected
                          ? Colors.white
                          : AppColors.primaryGreen,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
