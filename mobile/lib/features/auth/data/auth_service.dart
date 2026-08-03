import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/constants/api_constants.dart';
import '../../../core/network/dio_client.dart';
import '../domain/user_model.dart';

class AuthService {
  final DioClient _client;
  final FlutterSecureStorage _storage;

  AuthService(this._client)
      : _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(
      String email, String password) async {
    final response = await _client.post(
      ApiConstants.login,
      data: {'email': email, 'password': password},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await _client.post(
      ApiConstants.register,
      data: {'name': name, 'email': email, 'password': password},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<void> logout() async {
    try {
      await _client.post(ApiConstants.logout);
    } catch (_) {}
    await _storage.delete(key: ApiConstants.tokenKey);
    await _storage.delete(key: ApiConstants.refreshTokenKey);
  }

  Future<UserModel?> getProfile() async {
    try {
      final response = await _client.get(ApiConstants.profile);
      final data = response.data as Map<String, dynamic>;
      return UserModel.fromJson(data['data'] as Map<String, dynamic>);
    } on DioException {
      return null;
    }
  }

  Future<void> saveTokens(
      {required String token, String? refreshToken}) async {
    await _storage.write(key: ApiConstants.tokenKey, value: token);
    if (refreshToken != null) {
      await _storage.write(
          key: ApiConstants.refreshTokenKey, value: refreshToken);
    }
  }

  Future<String?> getToken() =>
      _storage.read(key: ApiConstants.tokenKey);

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
}
