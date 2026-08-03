import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/utils/duration_formatter.dart';
import '../../../videos/data/video_model.dart';

class LatestVideos extends StatelessWidget {
  final List<VideoModel> videos;

  const LatestVideos({super.key, required this.videos});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.screenPaddingH),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Émissions récentes',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              TextButton(
                onPressed: () => context.go('/videos'),
                child: const Text('Voir tout'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 160,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.screenPaddingH),
            itemCount: videos.length,
            itemBuilder: (context, index) {
              return _VideoCard(
                video: videos[index],
                onTap: () => context.go('/videos/${videos[index].id}'),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _VideoCard extends StatelessWidget {
  final VideoModel video;
  final VoidCallback onTap;

  const _VideoCard({required this.video, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 220,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Stack(
          children: [
            ClipRRect(
              borderRadius:
                  BorderRadius.circular(AppDimensions.cardRadius),
              child: CachedNetworkImage(
                imageUrl: video.thumbnailUrlYt,
                width: 220,
                height: 160,
                fit: BoxFit.cover,
                placeholder: (_, __) => Container(
                  color: AppColors.darkBackground,
                  child: const Center(
                    child: Icon(Icons.play_circle_outline,
                        color: Colors.white54, size: 48),
                  ),
                ),
                errorWidget: (_, __, ___) => Container(
                  color: AppColors.darkBackground,
                  child: const Center(
                    child: Icon(Icons.video_library,
                        color: Colors.white54, size: 48),
                  ),
                ),
              ),
            ),
            // Play button overlay
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius:
                      BorderRadius.circular(AppDimensions.cardRadius),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.6),
                    ],
                  ),
                ),
              ),
            ),
            const Positioned.fill(
              child: Center(
                child: Icon(Icons.play_circle_filled,
                    color: Colors.white, size: 44),
              ),
            ),
            Positioned(
              bottom: 8,
              left: 8,
              right: 8,
              child: Text(
                video.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600),
              ),
            ),
            if (video.durationSeconds > 0)
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    DurationFormatter.formatFromSeconds(
                        video.durationSeconds),
                    style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
