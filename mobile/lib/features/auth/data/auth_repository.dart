import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../domain/user_model.dart';
import 'auth_service.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioClientProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.read(authServiceProvider));
});

class AuthRepository {
  final AuthService _service;

  AuthRepository(this._service);

  Future<UserModel> login(String email, String password) async {
    final data = await _service.login(email, password);
    await _service.saveTokens(
      token: data['access_token'] as String,
      refreshToken: data['refresh_token'] as String?,
    );
    return UserModel.fromJson(data['user'] as Map<String, dynamic>);
  }

  Future<UserModel> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final data = await _service.register(
        name: name, email: email, password: password);
    await _service.saveTokens(
      token: data['access_token'] as String,
      refreshToken: data['refresh_token'] as String?,
    );
    return UserModel.fromJson(data['user'] as Map<String, dynamic>);
  }

  Future<void> logout() => _service.logout();

  Future<UserModel?> getProfile() => _service.getProfile();

  Future<bool> isLoggedIn() => _service.isLoggedIn();
}
