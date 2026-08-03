import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/utils/duration_formatter.dart';
import 'audio_provider.dart';

class AudioDetailScreen extends ConsumerWidget {
  final String id;

  const AudioDetailScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final audioAsync = ref.watch(audioDetailProvider(id));
    final playerState = ref.watch(audioPlayerProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lecture Audio'),
        backgroundColor: AppColors.primaryGreenDark,
        foregroundColor: Colors.white,
      ),
      body: audioAsync.when(
        loading: () => const Center(
            child: CircularProgressIndicator(
                color: AppColors.primaryGreen)),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline,
                  size: 64, color: AppColors.error),
              const SizedBox(height: 16),
              const Text('Impossible de charger cet audio'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () =>
                    ref.invalidate(audioDetailProvider(id)),
                child: const Text('Réessayer'),
              ),
            ],
          ),
        ),
        data: (audio) {
          final isCurrent = playerState.currentAudio?.id == audio.id;

          return SingleChildScrollView(
            child: Column(
              children: [
                // Header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(32),
                  decoration: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.15),
                          shape: BoxShape.circle,
                          border: Border.all(
                              color: AppColors.goldPrimary
                                  .withOpacity(0.5),
                              width: 2),
                        ),
                        child: const Icon(Icons.music_note_rounded,
                            color: Colors.white, size: 70),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        audio.title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        audio.category,
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: 14),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      // Progress slider
                      if (isCurrent) ...[
                        Slider(
                          value: playerState.progress,
                          onChanged: (v) {
                            final ms = (v *
                                    playerState.duration.inMilliseconds)
                                .toInt();
                            ref
                                .read(audioPlayerProvider.notifier)
                                .seek(
                                    Duration(milliseconds: ms));
                          },
                          activeColor: AppColors.primaryGreen,
                        ),
                        Row(
                          mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              DurationFormatter.format(
                                  playerState.position),
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary),
                            ),
                            Text(
                              DurationFormatter.format(
                                  playerState.duration),
                              style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                      ] else ...[
                        const SizedBox(height: 16),
                      ],
                      // Controls
                      Row(
                        mainAxisAlignment:
                            MainAxisAlignment.spaceEvenly,
                        children: [
                          if (isCurrent)
                            IconButton(
                              icon: const Icon(Icons.replay_10_rounded,
                                  size: 36),
                              onPressed: () => ref
                                  .read(audioPlayerProvider.notifier)
                                  .seek(playerState.position -
                                      const Duration(seconds: 10)),
                            ),
                          _PlayButton(
                            isPlaying:
                                isCurrent && playerState.isPlaying,
                            isBuffering:
                                isCurrent && playerState.isBuffering,
                            onPressed: () {
                              if (isCurrent) {
                                ref
                                    .read(audioPlayerProvider.notifier)
                                    .togglePlay();
                              } else {
                                ref
                                    .read(audioPlayerProvider.notifier)
                                    .play(audio);
                              }
                            },
                          ),
                          if (isCurrent)
                            IconButton(
                              icon: const Icon(Icons.forward_30_rounded,
                                  size: 36),
                              onPressed: () => ref
                                  .read(audioPlayerProvider.notifier)
                                  .seek(playerState.position +
                                      const Duration(seconds: 30)),
                            ),
                        ],
                      ),
                      const SizedBox(height: 32),
                      if (audio.description != null) ...[
                        const Divider(),
                        const SizedBox(height: 16),
                        const Align(
                          alignment: Alignment.centerLeft,
                          child: Text('Description',
                              style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          audio.description!,
                          style: const TextStyle(
                              fontSize: 14,
                              height: 1.7,
                              color: AppColors.textSecondary),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _PlayButton extends StatelessWidget {
  final bool isPlaying;
  final bool isBuffering;
  final VoidCallback onPressed;

  const _PlayButton({
    required this.isPlaying,
    required this.isBuffering,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 72,
      height: 72,
      decoration: BoxDecoration(
        color: AppColors.primaryGreen,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryGreen.withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: IconButton(
        icon: isBuffering
            ? const SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                    color: Colors.white, strokeWidth: 2))
            : Icon(
                isPlaying
                    ? Icons.pause_rounded
                    : Icons.play_arrow_rounded,
                color: Colors.white,
                size: 36,
              ),
        onPressed: onPressed,
      ),
    );
  }
}
