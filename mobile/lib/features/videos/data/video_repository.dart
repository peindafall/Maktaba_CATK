import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import 'video_model.dart';

final videoRepositoryProvider = Provider<VideoRepository>((ref) {
  return VideoRepository(ref.read(dioClientProvider));
});

class VideoRepository {
  final DioClient _client;

  VideoRepository(this._client);

  Future<List<VideoModel>> getVideos({
    int page = 1,
    int perPage = 20,
    String? category,
  }) async {
    final response = await _client.get(
      ApiConstants.videos,
      queryParameters: {
        'page': page,
        'per_page': perPage,
        if (category != null) 'category': category,
      },
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => VideoModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<VideoModel> getVideoById(String id) async {
    final response = await _client
        .get(ApiConstants.videoDetail.replaceAll('{id}', id));
    final data = response.data as Map<String, dynamic>;
    return VideoModel.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<List<VideoModel>> getLatest() async {
    final response = await _client.get(
      ApiConstants.videos,
      queryParameters: {'sort': 'latest', 'per_page': 10},
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => VideoModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
