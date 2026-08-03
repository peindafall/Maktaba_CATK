import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/home_repository.dart';

class HomeState {
  final HomeData? data;
  final bool isLoading;
  final String? error;

  const HomeState({
    this.data,
    this.isLoading = false,
    this.error,
  });

  HomeState copyWith({
    HomeData? data,
    bool? isLoading,
    String? error,
  }) {
    return HomeState(
      data: data ?? this.data,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class HomeNotifier extends StateNotifier<HomeState> {
  final HomeRepository _repo;

  HomeNotifier(this._repo) : super(const HomeState()) {
    loadHome();
  }

  Future<void> loadHome() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final data = await _repo.getHomeData();
      state = HomeState(data: data, isLoading: false);
    } catch (e) {
      state = state.copyWith(
          isLoading: false, error: 'Erreur de chargement');
    }
  }
}

final homeProvider =
    StateNotifierProvider<HomeNotifier, HomeState>((ref) {
  return HomeNotifier(ref.read(homeRepositoryProvider));
});
