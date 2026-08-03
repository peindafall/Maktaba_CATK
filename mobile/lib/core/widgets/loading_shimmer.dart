import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../constants/app_colors.dart';
import '../constants/app_dimensions.dart';

class LoadingShimmer extends StatelessWidget {
  final double width;
  final double height;
  final double radius;

  const LoadingShimmer({
    super.key,
    required this.width,
    required this.height,
    this.radius = AppDimensions.radiusSm,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Shimmer.fromColors(
      baseColor:
          isDark ? AppColors.darkSurface : AppColors.borderLight,
      highlightColor: isDark
          ? AppColors.darkBorder
          : AppColors.surface,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.borderLight,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}

class TeachingCardShimmer extends StatelessWidget {
  const TeachingCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppDimensions.md),
      child: SizedBox(
        width: AppDimensions.teachingCardWidth,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LoadingShimmer(
              width: AppDimensions.teachingCardWidth,
              height: AppDimensions.teachingCardImageHeight,
              radius: AppDimensions.radiusLg,
            ),
            const SizedBox(height: 8),
            const LoadingShimmer(width: 120, height: 12),
            const SizedBox(height: 6),
            const LoadingShimmer(width: 160, height: 14),
          ],
        ),
      ),
    );
  }
}

class AudioCardShimmer extends StatelessWidget {
  const AudioCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppDimensions.md),
      child: Row(
        children: [
          const LoadingShimmer(
            width: AppDimensions.audioCardImageSize,
            height: AppDimensions.audioCardImageSize,
            radius: AppDimensions.radiusMd,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                LoadingShimmer(width: double.infinity, height: 14),
                SizedBox(height: 6),
                LoadingShimmer(width: 100, height: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
