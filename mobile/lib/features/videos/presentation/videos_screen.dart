import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/utils/duration_formatter.dart';
import 'videos_provider.dart';
import '../data/video_model.dart';

class VideosScreen extends ConsumerWidget {
  const VideosScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(videosProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Émissions YouTube'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: state.isLoading
          ? const Center(
              child: CircularProgressIndicator(
                  color: AppColors.primaryGreen))
          : state.error != null
              ? Center(child: Text(state.error!))
              : RefreshIndicator(
                  onRefresh: () => ref
                      .read(videosProvider.notifier)
                      .loadVideos(refresh: true),
                  color: AppColors.primaryGreen,
                  child: GridView.builder(
                    padding: const EdgeInsets.all(
                        AppDimensions.screenPaddingH),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.75,
                    ),
                    itemCount: state.videos.length,
                    itemBuilder: (context, index) {
                      return VideoCard(
                        video: state.videos[index],
                        onTap: () => context
                            .go('/videos/${state.videos[index].id}'),
                      );
                    },
                  ),
                ),
    );
  }
}

class VideoCard extends StatelessWidget {
  final VideoModel video;
  final VoidCallback onTap;

  const VideoCard({super.key, required this.video, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.cardRadius)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppDimensions.cardRadius),
                topRight: Radius.circular(AppDimensions.cardRadius),
              ),
              child: Stack(
                children: [
                  CachedNetworkImage(
                    imageUrl: video.thumbnailUrlYt,
                    width: double.infinity,
                    height: 110,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Container(
                      height: 110,
                      color: AppColors.darkBackground,
                    ),
                    errorWidget: (_, __, ___) => Container(
                      height: 110,
                      color: AppColors.darkBackground,
                      child: const Icon(Icons.play_circle_outline,
                          color: Colors.white54, size: 40),
                    ),
                  ),
                  Positioned.fill(
                    child: const Center(
                      child: Icon(Icons.play_circle_filled,
                          color: Colors.white70, size: 36),
                    ),
                  ),
                  if (video.durationSeconds > 0)
                    Positioned(
                      bottom: 4,
                      right: 4,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 5, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.75),
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
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                video.title,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    fontSize: 12, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
