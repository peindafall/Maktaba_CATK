import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/widgets/loading_shimmer.dart';
import '../../../teachings/data/teaching_model.dart';

class FeaturedTeachings extends StatelessWidget {
  final List<TeachingModel> teachings;

  const FeaturedTeachings({super.key, required this.teachings});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(
          title: 'Enseignements en vedette',
          onSeeAll: () => context.go('/enseignements'),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 210,
          child: teachings.isEmpty
              ? _buildShimmer()
              : ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.screenPaddingH),
                  itemCount: teachings.length,
                  itemBuilder: (context, index) {
                    return _FeaturedCard(
                      teaching: teachings[index],
                      onTap: () =>
                          context.go('/enseignements/${teachings[index].id}'),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildShimmer() {
    return ListView.builder(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.screenPaddingH),
      itemCount: 4,
      itemBuilder: (_, __) => const Padding(
        padding: EdgeInsets.only(right: 12),
        child: TeachingCardShimmer(),
      ),
    );
  }
}

class _FeaturedCard extends StatelessWidget {
  final TeachingModel teaching;
  final VoidCallback onTap;

  const _FeaturedCard({required this.teaching, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: AppDimensions.teachingCardWidth,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.07),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppDimensions.cardRadius),
                topRight: Radius.circular(AppDimensions.cardRadius),
              ),
              child: CachedNetworkImage(
                imageUrl: teaching.imageUrl ?? '',
                width: AppDimensions.teachingCardWidth,
                height: AppDimensions.teachingCardImageHeight,
                fit: BoxFit.cover,
                placeholder: (_, __) => const LoadingShimmer(
                    width: double.infinity,
                    height: AppDimensions.teachingCardImageHeight),
                errorWidget: (_, __, ___) => Container(
                  width: double.infinity,
                  height: AppDimensions.teachingCardImageHeight,
                  color: AppColors.primaryGreen.withOpacity(0.1),
                  child: const Icon(Icons.menu_book,
                      color: AppColors.primaryGreen, size: 48),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      teaching.category,
                      style: const TextStyle(
                          fontSize: 10,
                          color: AppColors.primaryGreen,
                          fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    teaching.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600),
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

class _SectionHeader extends StatelessWidget {
  final String title;
  final VoidCallback? onSeeAll;

  const _SectionHeader({required this.title, this.onSeeAll});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.screenPaddingH),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: Theme.of(context)
                .textTheme
                .titleLarge
                ?.copyWith(fontWeight: FontWeight.w700),
          ),
          if (onSeeAll != null)
            TextButton(
              onPressed: onSeeAll,
              child: const Text('Voir tout'),
            ),
        ],
      ),
    );
  }
}
