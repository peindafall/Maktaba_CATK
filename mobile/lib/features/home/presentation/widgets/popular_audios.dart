import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/utils/duration_formatter.dart';
import '../../../audio/data/audio_model.dart';

class PopularAudios extends StatelessWidget {
  final List<AudioModel> audios;

  const PopularAudios({super.key, required this.audios});

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
                'Audios populaires',
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.w700),
              ),
              TextButton(
                onPressed: () => context.go('/audios'),
                child: const Text('Voir tout'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        ...audios.map((audio) => _AudioListItem(
              audio: audio,
              onTap: () => context.go('/audios/${audio.id}'),
            )),
      ],
    );
  }
}

class _AudioListItem extends StatelessWidget {
  final AudioModel audio;
  final VoidCallback onTap;

  const _AudioListItem({required this.audio, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(
            horizontal: AppDimensions.screenPaddingH, vertical: 8),
        child: Row(
          children: [
            Container(
              width: AppDimensions.audioCardImageSize,
              height: AppDimensions.audioCardImageSize,
              decoration: BoxDecoration(
                color: AppColors.primaryGreen.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
              ),
              child: const Icon(Icons.music_note_rounded,
                  color: AppColors.primaryGreen, size: 28),
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
                            fontSize: 12, color: AppColors.textSecondary),
                      ),
                      const SizedBox(width: 8),
                      const Text('•',
                          style: TextStyle(color: AppColors.textSecondary)),
                      const SizedBox(width: 8),
                      Text(
                        DurationFormatter.formatFromSeconds(
                            audio.durationSeconds),
                        style: const TextStyle(
                            fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Icon(Icons.play_circle_outline_rounded,
                color: AppColors.primaryGreen, size: 32),
          ],
        ),
      ),
    );
  }
}
