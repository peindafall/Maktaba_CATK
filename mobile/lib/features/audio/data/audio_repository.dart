import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import 'audio_model.dart';

final audioRepositoryProvider = Provider<AudioRepository>((ref) {
  return AudioRepository(ref.read(dioClientProvider));
});

class AudioRepository {
  final DioClient _client;

  AudioRepository(this._client);

  Future<List<AudioModel>> getAudios({
    int page = 1,
    int perPage = 20,
    String? category,
  }) async {
    final response = await _client.get(
      ApiConstants.audios,
      queryParameters: {
        'page': page,
        'per_page': perPage,
        if (category != null) 'category': category,
      },
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => AudioModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<AudioModel> getAudioById(String id) async {
    final response = await _client
        .get(ApiConstants.audioDetail.replaceAll('{id}', id));
    final data = response.data as Map<String, dynamic>;
    return AudioModel.fromJson(data['data'] as Map<String, dynamic>);
  }

  Future<List<AudioModel>> getPopular() async {
    final response = await _client.get(
      ApiConstants.audios,
      queryParameters: {'sort': 'popular', 'per_page': 10},
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => AudioModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
