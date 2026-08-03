import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/teaching_repository.dart';
import '../data/teaching_model.dart';

// ── State ──────────────────────────────────────────────────────────────────

class TeachingsState {
  final List<TeachingModel> teachings;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String? selectedCategory;

  const TeachingsState({
    this.teachings = const [],
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.selectedCategory,
  });

  TeachingsState copyWith({
    List<TeachingModel>? teachings,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? selectedCategory,
  }) {
    return TeachingsState(
      teachings: teachings ?? this.teachings,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }
}

// ── Notifier ───────────────────────────────────────────────────────────────

class TeachingsNotifier extends StateNotifier<TeachingsState> {
  final TeachingRepository _repo;

  TeachingsNotifier(this._repo) : super(const TeachingsState()) {
    loadTeachings();
  }

  Future<void> loadTeachings({bool refresh = false}) async {
    if (state.isLoading) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      final teachings = await _repo.getTeachings(
        page: 1,
        category: state.selectedCategory,
      );
      state = TeachingsState(
        teachings: teachings,
        isLoading: false,
        currentPage: 1,
        hasMore: teachings.length >= 20,
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
      final next = await _repo.getTeachings(
        page: state.currentPage + 1,
        category: state.selectedCategory,
      );
      state = state.copyWith(
        teachings: [...state.teachings, ...next],
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
    loadTeachings(refresh: true);
  }
}

// ── Providers ─────────────────────────────────────────────────────────────

final teachingsProvider =
    StateNotifierProvider<TeachingsNotifier, TeachingsState>((ref) {
  return TeachingsNotifier(ref.read(teachingRepositoryProvider));
});

final teachingDetailProvider =
    FutureProvider.family<TeachingModel, String>((ref, id) {
  return ref.read(teachingRepositoryProvider).getTeachingById(id);
});

final featuredTeachingsProvider =
    FutureProvider<List<TeachingModel>>((ref) {
  return ref.read(teachingRepositoryProvider).getFeatured();
});
