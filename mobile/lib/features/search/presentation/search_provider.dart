import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import '../../teachings/data/teaching_model.dart';
import '../../audio/data/audio_model.dart';
import '../../videos/data/video_model.dart';
import '../../questions/data/question_model.dart';

class SearchResults {
  final List<TeachingModel> teachings;
  final List<AudioModel> audios;
  final List<VideoModel> videos;
  final List<QuestionModel> questions;

  const SearchResults({
    this.teachings = const [],
    this.audios = const [],
    this.videos = const [],
    this.questions = const [],
  });

  bool get isEmpty =>
      teachings.isEmpty &&
      audios.isEmpty &&
      videos.isEmpty &&
      questions.isEmpty;

  int get totalCount =>
      teachings.length + audios.length + videos.length + questions.length;
}

class SearchState {
  final String query;
  final SearchResults? results;
  final bool isLoading;
  final String? error;

  const SearchState({
    this.query = '',
    this.results,
    this.isLoading = false,
    this.error,
  });

  SearchState copyWith({
    String? query,
    SearchResults? results,
    bool? isLoading,
    String? error,
  }) {
    return SearchState(
      query: query ?? this.query,
      results: results ?? this.results,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class SearchNotifier extends StateNotifier<SearchState> {
  final DioClient _client;

  SearchNotifier(this._client) : super(const SearchState());

  Future<void> search(String query) async {
    if (query.trim().isEmpty) {
      state = const SearchState();
      return;
    }
    state = state.copyWith(query: query, isLoading: true, error: null);
    try {
      final response = await _client.get(
        ApiConstants.search,
        queryParameters: {'q': query},
      );
      final data = response.data as Map<String, dynamic>;
      final d = data['data'] as Map<String, dynamic>? ?? {};

      final teachingsList = (d['enseignements'] as List? ?? [])
          .map((e) => TeachingModel.fromJson(e as Map<String, dynamic>))
          .toList();
      final audiosList = (d['audios'] as List? ?? [])
          .map((e) => AudioModel.fromJson(e as Map<String, dynamic>))
          .toList();
      final videosList = (d['videos'] as List? ?? [])
          .map((e) => VideoModel.fromJson(e as Map<String, dynamic>))
          .toList();
      final questionsList = (d['questions'] as List? ?? [])
          .map((e) => QuestionModel.fromJson(e as Map<String, dynamic>))
          .toList();

      state = SearchState(
        query: query,
        results: SearchResults(
          teachings: teachingsList,
          audios: audiosList,
          videos: videosList,
          questions: questionsList,
        ),
        isLoading: false,
      );
    } catch (e) {
      state =
          state.copyWith(isLoading: false, error: 'Erreur de recherche');
    }
  }

  void clear() {
    state = const SearchState();
  }
}

final searchProvider =
    StateNotifierProvider<SearchNotifier, SearchState>((ref) {
  return SearchNotifier(ref.read(dioClientProvider));
});
