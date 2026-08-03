import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/constants/api_constants.dart';
import 'question_model.dart';

final questionRepositoryProvider = Provider<QuestionRepository>((ref) {
  return QuestionRepository(ref.read(dioClientProvider));
});

class QuestionRepository {
  final DioClient _client;

  QuestionRepository(this._client);

  Future<List<QuestionModel>> getQuestions({
    int page = 1,
    int perPage = 20,
    String? category,
  }) async {
    final response = await _client.get(
      ApiConstants.questions,
      queryParameters: {
        'page': page,
        'per_page': perPage,
        if (category != null) 'category': category,
      },
    );
    final data = response.data as Map<String, dynamic>;
    final items = data['data']['items'] as List;
    return items
        .map((e) => QuestionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<QuestionModel> getQuestionById(String id) async {
    final response = await _client
        .get(ApiConstants.questionDetail.replaceAll('{id}', id));
    final data = response.data as Map<String, dynamic>;
    return QuestionModel.fromJson(
        data['data'] as Map<String, dynamic>);
  }
}
