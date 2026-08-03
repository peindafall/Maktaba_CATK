import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import '../../../core/constants/app_colors.dart';
import 'videos_provider.dart';

class VideoDetailScreen extends ConsumerStatefulWidget {
  final String id;

  const VideoDetailScreen({super.key, required this.id});

  @override
  ConsumerState<VideoDetailScreen> createState() =>
      _VideoDetailScreenState();
}

class _VideoDetailScreenState
    extends ConsumerState<VideoDetailScreen> {
  YoutubePlayerController? _controller;

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final videoAsync = ref.watch(videoDetailProvider(widget.id));

    return videoAsync.when(
      loading: () => const Scaffold(
        body: Center(
            child: CircularProgressIndicator(
                color: AppColors.primaryGreen)),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(title: const Text('Émission')),
        body: const Center(
            child: Text('Impossible de charger cette émission')),
      ),
      data: (video) {
        _controller ??= YoutubePlayerController.fromVideoId(
          videoId: video.youtubeId,
          autoPlay: true,
          params: const YoutubePlayerParams(
            mute: false,
          ),
        );

        return YoutubePlayerScaffold(
          controller: _controller!,
          builder: (context, player) => Scaffold(
            appBar: AppBar(
              title: Text(
                video.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              backgroundColor: AppColors.primaryGreenDark,
              foregroundColor: Colors.white,
            ),
            body: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  player,
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          video.title,
                          style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.primaryGreen
                                    .withOpacity(0.12),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                video.category,
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.primaryGreen,
                                    fontWeight: FontWeight.w600),
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Icon(Icons.remove_red_eye_outlined,
                                size: 16,
                                color: AppColors.textSecondary),
                            const SizedBox(width: 4),
                            Text('${video.viewCount}',
                                style: const TextStyle(
                                    color: AppColors.textSecondary)),
                          ],
                        ),
                        if (video.description != null) ...[
                          const SizedBox(height: 20),
                          const Divider(),
                          const SizedBox(height: 12),
                          const Text('Description',
                              style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700)),
                          const SizedBox(height: 8),
                          Text(
                            video.description!,
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
            ),
          ),
        );
      },
    );
  }
}
