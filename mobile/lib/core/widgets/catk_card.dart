import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';

class CatkCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? color;
  final double? elevation;
  final double radius;
  final bool hasShadow;

  const CatkCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.color,
    this.elevation,
    this.radius = AppDimensions.cardRadius,
    this.hasShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Material(
      color: color ?? (isDark ? AppColors.darkSurface : AppColors.surface),
      elevation: elevation ?? (hasShadow ? AppDimensions.cardElevation : 0),
      borderRadius: BorderRadius.circular(radius),
      shadowColor:
          isDark ? Colors.black54 : AppColors.textSecondary.withOpacity(0.15),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(AppDimensions.md),
          child: child,
        ),
      ),
    );
  }
}
