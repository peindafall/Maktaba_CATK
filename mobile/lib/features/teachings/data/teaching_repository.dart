import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import 'teaching_model.dart';

final teachingRepositoryProvider = Provider<TeachingRepository>((ref) {
  return TeachingRepository(ref.read(dioClientProvider));
});

class TeachingRepository {
  final DioClient _client;

  TeachingRepository(this._client);

  Future<List<TeachingModel>> getTeachings({
    int page = 1,
    int perPage = 20,
    String? category,
    String? language,
  }) async {
    final response = await _client.get(
      ApiConstants.teachings,
      queryParameters: {
        'page': page,
        'per_page': perPage,
        if (category != null) 'category': category,
        if (language != null) 'language': language,
      },
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => TeachingModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<TeachingModel> getTeachingById(String id) async {
    final response = await _client.get(
        ApiConstants.teachingDetail.replaceAll('{id}', id));
    final data = response.data as Map<String, dynamic>;
    return TeachingModel.fromJson(
        data['data'] as Map<String, dynamic>);
  }

  Future<List<TeachingModel>> getFeatured() async {
    final response = await _client
        .get(ApiConstants.teachings, queryParameters: {'featured': true});
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => TeachingModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
