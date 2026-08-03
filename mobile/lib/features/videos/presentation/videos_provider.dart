import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/video_repository.dart';
import '../data/video_model.dart';

class VideosState {
  final List<VideoModel> videos;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String? selectedCategory;

  const VideosState({
    this.videos = const [],
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.selectedCategory,
  });

  VideosState copyWith({
    List<VideoModel>? videos,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? selectedCategory,
  }) {
    return VideosState(
      videos: videos ?? this.videos,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }
}

class VideosNotifier extends StateNotifier<VideosState> {
  final VideoRepository _repo;

  VideosNotifier(this._repo) : super(const VideosState()) {
    loadVideos();
  }

  Future<void> loadVideos({bool refresh = false}) async {
    if (state.isLoading) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      final videos = await _repo.getVideos(page: 1);
      state = VideosState(
        videos: videos,
        isLoading: false,
        currentPage: 1,
        hasMore: videos.length >= 20,
      );
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Erreur de chargement');
    }
  }

  Future<void> loadMore() async {
    if (!state.hasMore || state.isLoadingMore) return;
    state = state.copyWith(isLoadingMore: true);
    try {
      final next =
          await _repo.getVideos(page: state.currentPage + 1);
      state = state.copyWith(
        videos: [...state.videos, ...next],
        isLoadingMore: false,
        currentPage: state.currentPage + 1,
        hasMore: next.length >= 20,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false);
    }
  }
}

// ── Providers ─────────────────────────────────────────────────────────────

final videosProvider =
    StateNotifierProvider<VideosNotifier, VideosState>((ref) {
  return VideosNotifier(ref.read(videoRepositoryProvider));
});

final videoDetailProvider =
    FutureProvider.family<VideoModel, String>((ref, id) {
  return ref.read(videoRepositoryProvider).getVideoById(id);
});

final latestVideosProvider = FutureProvider<List<VideoModel>>((ref) {
  return ref.read(videoRepositoryProvider).getLatest();
});
