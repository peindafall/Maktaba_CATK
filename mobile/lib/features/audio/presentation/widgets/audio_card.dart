import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/utils/duration_formatter.dart';
import '../../../../core/widgets/loading_shimmer.dart';
import '../../data/audio_model.dart';

class AudioCard extends StatelessWidget {
  final AudioModel audio;
  final VoidCallback? onTap;
  final VoidCallback? onPlay;

  const AudioCard({
    super.key,
    required this.audio,
    this.onTap,
    this.onPlay,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: AppDimensions.cardElevation,
      shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(AppDimensions.cardRadius)),
      child: InkWell(
        onTap: onTap ?? () => context.go('/audios/${audio.id}'),
        borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              // Thumbnail
              ClipRRect(
                borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                child: audio.imageUrl != null
                    ? CachedNetworkImage(
                        imageUrl: audio.imageUrl!,
                        width: AppDimensions.audioCardImageSize,
                        height: AppDimensions.audioCardImageSize,
                        fit: BoxFit.cover,
                        placeholder: (_, __) => const LoadingShimmer(
                            width: AppDimensions.audioCardImageSize,
                            height: AppDimensions.audioCardImageSize),
                        errorWidget: (_, __, ___) =>
                            _defaultThumbnail(),
                      )
                    : _defaultThumbnail(),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      audio.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          audio.category,
                          style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary),
                        ),
                        const SizedBox(width: 8),
                        const Text('•',
                            style: TextStyle(
                                color: AppColors.textSecondary)),
                        const SizedBox(width: 8),
                        Text(
                          DurationFormatter.formatFromSeconds(
                              audio.durationSeconds),
                          style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.headphones_outlined,
                            size: 12,
                            color: AppColors.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          '${audio.playCount}',
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (onPlay != null)
                IconButton(
                  icon: const Icon(Icons.play_circle_filled_rounded,
                      color: AppColors.primaryGreen, size: 36),
                  onPressed: onPlay,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _defaultThumbnail() {
    return Container(
      width: AppDimensions.audioCardImageSize,
      height: AppDimensions.audioCardImageSize,
      decoration: BoxDecoration(
        color: AppColors.primaryGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
      ),
      child: const Icon(Icons.music_note_rounded,
          color: AppColors.primaryGreen, size: 28),
    );
  }
}
