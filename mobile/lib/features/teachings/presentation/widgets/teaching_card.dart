import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/widgets/loading_shimmer.dart';
import '../../data/teaching_model.dart';

class TeachingCard extends StatelessWidget {
  final TeachingModel teaching;

  const TeachingCard({super.key, required this.teaching});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: AppDimensions.cardElevation,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.cardRadius)),
      child: InkWell(
        onTap: () => context.go('/enseignements/${teaching.id}'),
        borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppDimensions.cardRadius),
                topRight: Radius.circular(AppDimensions.cardRadius),
              ),
              child: CachedNetworkImage(
                imageUrl: teaching.imageUrl ?? '',
                width: double.infinity,
                height: 160,
                fit: BoxFit.cover,
                placeholder: (_, __) => const LoadingShimmer(
                    width: double.infinity, height: 160),
                errorWidget: (_, __, ___) => Container(
                  width: double.infinity,
                  height: 160,
                  color: AppColors.primaryGreen.withOpacity(0.08),
                  child: const Icon(Icons.menu_book,
                      color: AppColors.primaryGreen, size: 60),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Category badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      teaching.category,
                      style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.primaryGreen,
                          fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Title
                  Text(
                    teaching.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context)
                        .textTheme
                        .titleMedium
                        ?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  if (teaching.description != null) ...[
                    const SizedBox(height: 6),
                    Text(
                      teaching.description!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                          height: 1.4),
                    ),
                  ],
                  const SizedBox(height: 10),
                  // Stats row
                  Row(
                    children: [
                      const Icon(Icons.remove_red_eye_outlined,
                          size: 14, color: AppColors.textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        '${teaching.viewCount}',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const SizedBox(width: 16),
                      const Icon(Icons.download_outlined,
                          size: 14, color: AppColors.textSecondary),
                      const SizedBox(width: 4),
                      Text(
                        '${teaching.downloadCount}',
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const Spacer(),
                      if (teaching.pdfUrl != null)
                        TextButton.icon(
                          onPressed: () =>
                              context.go('/enseignements/${teaching.id}'),
                          icon: const Icon(Icons.picture_as_pdf,
                              size: 16),
                          label: const Text('Lire'),
                          style: TextButton.styleFrom(
                            foregroundColor: AppColors.primaryGreen,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
