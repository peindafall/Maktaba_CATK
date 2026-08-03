import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import '../../teachings/data/teaching_model.dart';
import '../../audio/data/audio_model.dart';
import '../../videos/data/video_model.dart';

final homeRepositoryProvider = Provider<HomeRepository>((ref) {
  return HomeRepository(ref.read(dioClientProvider));
});

class HomeData {
  final List<TeachingModel> featuredTeachings;
  final List<AudioModel> popularAudios;
  final List<VideoModel> latestVideos;
  final List<Map<String, dynamic>> categories;

  const HomeData({
    required this.featuredTeachings,
    required this.popularAudios,
    required this.latestVideos,
    required this.categories,
  });
}

class HomeRepository {
  final DioClient _client;

  HomeRepository(this._client);

  Future<HomeData> getHomeData() async {
    final results = await Future.wait([
      _getFeaturedTeachings(),
      _getPopularAudios(),
      _getLatestVideos(),
      _getCategories(),
    ]);
    return HomeData(
      featuredTeachings: results[0] as List<TeachingModel>,
      popularAudios: results[1] as List<AudioModel>,
      latestVideos: results[2] as List<VideoModel>,
      categories: results[3] as List<Map<String, dynamic>>,
    );
  }

  Future<List<TeachingModel>> _getFeaturedTeachings() async {
    try {
      final res = await _client.get(
        ApiConstants.teachings,
        queryParameters: {'featured': true, 'per_page': 8},
      );
      final data = res.data as Map<String, dynamic>;
      final items = data['data']['items'] as List? ?? [];
      return items
          .map((e) => TeachingModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<AudioModel>> _getPopularAudios() async {
    try {
      final res = await _client.get(
        ApiConstants.audios,
        queryParameters: {'sort': 'popular', 'per_page': 6},
      );
      final data = res.data as Map<String, dynamic>;
      final items = data['data']['items'] as List? ?? [];
      return items
          .map((e) => AudioModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<VideoModel>> _getLatestVideos() async {
    try {
      final res = await _client.get(
        ApiConstants.videos,
        queryParameters: {'sort': 'latest', 'per_page': 6},
      );
      final data = res.data as Map<String, dynamic>;
      final items = data['data']['items'] as List? ?? [];
      return items
          .map((e) => VideoModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> _getCategories() async {
    try {
      final res =
          await _client.get(ApiConstants.homeCategories);
      final data = res.data as Map<String, dynamic>;
      final items = data['data'] as List? ?? [];
      return items
          .map((e) => e as Map<String, dynamic>)
          .toList();
    } catch (_) {
      return _defaultCategories;
    }
  }

  static const List<Map<String, dynamic>> _defaultCategories = [
    {'id': 'aqida', 'name': 'Aqida', 'icon': '📖', 'color': '#1EA478'},
    {'id': 'fiqh', 'name': 'Fiqh', 'icon': '⚖️', 'color': '#BF8B28'},
    {'id': 'tafsir', 'name': 'Tafsir', 'icon': '🌟', 'color': '#114D0D'},
    {'id': 'hadith', 'name': 'Hadith', 'icon': '📜', 'color': '#B35214'},
    {'id': 'tarbiya', 'name': 'Tarbiya', 'icon': '🌱', 'color': '#1FA645'},
    {'id': 'sira', 'name': 'Sira', 'icon': '🕌', 'color': '#A67723'},
  ];
}
