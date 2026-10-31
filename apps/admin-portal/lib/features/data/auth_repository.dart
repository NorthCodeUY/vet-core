// apps/admin-portal/lib/features/data/auth_repository.dart


import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:admin_portal/core/config/app_environment.dart';
import '../domain/auth_models.dart';

/// Repositorio encargado de la comunicación con los endpoints de autenticación.
class AuthRepository {
  late final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const String _tokenKey = 'auth_access_token';

  AuthRepository() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppEnvironment.apiUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Accept': 'application/json',
        },
      ),
    );
  }

  /// Autentica al usuario contra FastAPI (`POST /api/auth/token`).
  ///
  /// Utiliza formato form-url-encoded compatible con OAuth2PasswordRequestForm de FastAPI.
  Future<AuthSession> login(LoginCredentials credentials) async {
    try {
      final response = await _dio.post(
        '/api/auth/token',
        data: {
          'username': credentials.username,
          'password': credentials.password,
        },
        options: Options(
          contentType: Headers.formUrlEncodedContentType,
        ),
      );

      final session = AuthSession.fromJson(response.data as Map<String, dynamic>);
      await _storage.write(key: _tokenKey, value: session.accessToken);
      return session;
    } on DioException catch (e) {
      final message = e.response?.data?['detail'] ?? 'Error de conexión con el servidor.';
      throw Exception(message);
    }
  }

  /// Valida si existe un token guardado previamente (Persistencia de sesión).
  Future<bool> hasActiveSession() async {
    final token = await _storage.read(key: _tokenKey);
    return token != null && token.isNotEmpty;
  }

  /// Elimina el token del almacenamiento seguro.
  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }
}