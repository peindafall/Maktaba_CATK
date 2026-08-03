import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/question_repository.dart';
import '../data/question_model.dart';

class QuestionsState {
  final List<QuestionModel> questions;
  final bool isLoading;
  final bool isLoadingMore;
  final String? error;
  final int currentPage;
  final bool hasMore;
  final String? selectedCategory;

  const QuestionsState({
    this.questions = const [],
    this.isLoading = false,
    this.isLoadingMore = false,
    this.error,
    this.currentPage = 1,
    this.hasMore = true,
    this.selectedCategory,
  });

  QuestionsState copyWith({
    List<QuestionModel>? questions,
    bool? isLoading,
    bool? isLoadingMore,
    String? error,
    int? currentPage,
    bool? hasMore,
    String? selectedCategory,
  }) {
    return QuestionsState(
      questions: questions ?? this.questions,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      error: error,
      currentPage: currentPage ?? this.currentPage,
      hasMore: hasMore ?? this.hasMore,
      selectedCategory: selectedCategory ?? this.selectedCategory,
    );
  }
}

class QuestionsNotifier extends StateNotifier<QuestionsState> {
  final QuestionRepository _repo;

  QuestionsNotifier(this._repo) : super(const QuestionsState()) {
    loadQuestions();
  }

  Future<void> loadQuestions({bool refresh = false}) async {
    if (state.isLoading) return;
    state = state.copyWith(isLoading: true, error: null);
    try {
      final questions = await _repo.getQuestions(page: 1);
      state = QuestionsState(
        questions: questions,
        isLoading: false,
        currentPage: 1,
        hasMore: questions.length >= 20,
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
          await _repo.getQuestions(page: state.currentPage + 1);
      state = state.copyWith(
        questions: [...state.questions, ...next],
        isLoadingMore: false,
        currentPage: state.currentPage + 1,
        hasMore: next.length >= 20,
      );
    } catch (_) {
      state = state.copyWith(isLoadingMore: false);
    }
  }
}

final questionsProvider =
    StateNotifierProvider<QuestionsNotifier, QuestionsState>((ref) {
  return QuestionsNotifier(ref.read(questionRepositoryProvider));
});

final questionDetailProvider =
    FutureProvider.family<QuestionModel, String>((ref, id) {
  return ref.read(questionRepositoryProvider).getQuestionById(id);
});
