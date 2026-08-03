import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/utils/duration_formatter.dart';
import 'audio_provider.dart';
import '../data/audio_model.dart';

class AudiosScreen extends ConsumerWidget {
  const AudiosScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(audiosProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Audios'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: state.isLoading
          ? const Center(
              child:
                  CircularProgressIndicator(color: AppColors.primaryGreen))
          : state.error != null
              ? Center(child: Text(state.error!))
              : RefreshIndicator(
                  onRefresh: () =>
                      ref.read(audiosProvider.notifier).loadAudios(refresh: true),
                  color: AppColors.primaryGreen,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(AppDimensions.screenPaddingH),
                    itemCount:
                        state.audios.length + (state.hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == state.audios.length) {
                        ref.read(audiosProvider.notifier).loadMore();
                        return const Padding(
                          padding: EdgeInsets.all(16),
                          child: Center(
                            child: CircularProgressIndicator(
                                color: AppColors.primaryGreen,
                                strokeWidth: 2),
                          ),
                        );
                      }
                      return _AudioCard(
                        audio: state.audios[index],
                        onTap: () =>
                            context.go('/audios/${state.audios[index].id}'),
                        onPlay: () => ref
                            .read(audioPlayerProvider.notifier)
                            .play(state.audios[index]),
                      );
                    },
                  ),
                ),
    );
  }
}

class _AudioCard extends StatelessWidget {
  final AudioModel audio;
  final VoidCallback onTap;
  final VoidCallback onPlay;

  const _AudioCard(
      {required this.audio, required this.onTap, required this.onPlay});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.cardRadius)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppDimensions.cardRadius),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.music_note_rounded,
                    color: AppColors.primaryGreen, size: 30),
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
                  ],
                ),
              ),
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
}
