import 'package:audioplayers/audioplayers.dart' as ap;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/audio_repository.dart';
import '../data/audio_model.dart';

// ── Player State ───────────────────────────────────────────────────────────

class PlayerState {
  final AudioModel? currentAudio;
  final bool isPlaying;
  final Duration position;
  final Duration duration;
  final bool isBuffering;

  const PlayerState({
    this.currentAudio,
    this.isPlaying = false,
    this.position = Duration.zero,
    this.duration = Duration.zero,
    this.isBuffering = false,
  });

  PlayerState copyWith({
    AudioModel? currentAudio,
    bool? isPlaying,
    Duration? position,
    Duration? duration,
    bool? isBuffering,
  }) {
    return PlayerState(
      currentAudio: currentAudio ?? this.currentAudio,
      isPlaying: isPlaying ?? this.isPlaying,
      position: position ?? this.position,
      duration: duration ?? this.duration,
      isBuffering: isBuffering ?? this.isBuffering,
    );
  }

  double get progress {
    if (duration.inMilliseconds == 0) return 0;
    return position.inMilliseconds / duration.inMilliseconds;
  }
}

// ── Audio Player Notifier ──────────────────────────────────────────────────

class AudioPlayerNotifier extends StateNotifier<PlayerState> {
  final ap.AudioPlayer _player = ap.AudioPlayer();

  AudioPlayerNotifier() : super(const PlayerState()) {
    _player.onPositionChanged.listen((pos) {
      state = state.copyWith(position: pos);
    });
    _player.onDurationChanged.listen((dur) {
      state = state.copyWith(duration: dur);
    });
    _player.onPlayerStateChanged.listen((s) {
      state = state.copyWith(isPlaying: s == ap.PlayerState.playing);
    });
    _player.onPlayerComplete.listen((_) {
      state = state.copyWith(isPlaying: false, position: Duration.zero);
    });
  }

  Future<void> play(AudioModel audio) async {
    state = state.copyWith(currentAudio: audio, isBuffering: true);
    await _player.play(ap.UrlSource(audio.audioUrl));
    state = state.copyWith(isBuffering: false);
  }

  Future<void> resume() => _player.resume();
  Future<void> pause() => _player.pause();

  Future<void> togglePlay() async {
    if (state.isPlaying) {
      await _player.pause();
    } else {
      await _player.resume();
    }
  }

  Future<void> seek(Duration position) => _player.seek(position);

  Future<void> stop() async {
    await _player.stop();
    state = const PlayerState();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}

// ── Audios List State ─────────────────────────────────────────────────────

class AudiosState {
  final List<AudioModel> audios;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String? selectedCategory;

  const AudiosState({
    this.audios = const [],
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.selectedCategory,
  });

  AudiosState copyWith({
    List<AudioModel>? audios,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? selectedCategory,
  }) {
    return AudiosState(
      audios: audios ?? this.audios,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }
}

class AudiosNotifier extends StateNotifier<AudiosState> {
  final AudioRepository _repo;

  AudiosNotifier(this._repo) : super(const AudiosState()) {
    loadAudios();
  }

  Future<void> loadAudios({bool refresh = false}) async {
    if (state.isLoading) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      final audios = await _repo.getAudios(
        page: 1,
        category: state.selectedCategory,
      );
      state = AudiosState(
        audios: audios,
        isLoading: false,
        currentPage: 1,
        hasMore: audios.length >= 20,
        selectedCategory: state.selectedCategory,
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
      final next = await _repo.getAudios(
        page: state.currentPage + 1,
        category: state.selectedCategory,
      );
      state = state.copyWith(
        audios: [...state.audios, ...next],
        isLoadingMore: false,
        currentPage: state.currentPage + 1,
        hasMore: next.length >= 20,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false);
    }
  }

  void filterByCategory(String? category) {
    state = state.copyWith(selectedCategory: category);
    loadAudios(refresh: true);
  }
}

// ── Providers ─────────────────────────────────────────────────────────────

final audioPlayerProvider =
    StateNotifierProvider<AudioPlayerNotifier, PlayerState>((ref) {
  return AudioPlayerNotifier();
});

final audiosProvider =
    StateNotifierProvider<AudiosNotifier, AudiosState>((ref) {
  return AudiosNotifier(ref.read(audioRepositoryProvider));
});

final audioDetailProvider =
    FutureProvider.family<AudioModel, String>((ref, id) {
  return ref.read(audioRepositoryProvider).getAudioById(id);
});

final popularAudiosProvider = FutureProvider<List<AudioModel>>((ref) {
  return ref.read(audioRepositoryProvider).getPopular();
});
