// lib/repositories/auth_repository.dart

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:admin_portal/models/auth_models.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Repositorio de Autenticación y Control de Sesión.
///
/// Actúa como puente entre la interfaz de usuario y la infraestructura de red (`ApiClient`).
/// Coordina la validación OAuth2 contra FastAPI, el almacenamiento cifrado del JWT
/// y el soporte para acceso automático/modo demo sin reingreso constante de credenciales.
class AuthRepository {
  // INFRAESTRUCTURA HTTP: Reutiliza la instancia centralizada de Dio configurada en network/
  final ApiClient _apiClient;

  // Persistencia segura en disco (Keychain en Apple, KeyStore en Android, Web Crypto en navegadores)
  final FlutterSecureStorage _storage;

  // Clave canónica del token en el almacenamiento local
  static const String _tokenKey = 'auth_access_token';

  AuthRepository({
    ApiClient? apiClient,
    FlutterSecureStorage? storage,
  })  : _apiClient = apiClient ?? ApiClient(),
        _storage = storage ?? const FlutterSecureStorage();

  /// Autentica al usuario contra FastAPI (`POST /api/auth/token`).
  ///
  /// Utiliza formato application/x-www-form-urlencoded requerido por OAuth2PasswordRequestForm.
  Future<AuthSession> login(LoginCredentials credentials) async {
    try {
      // <!> DELEGACIÓN A NETWORK: La URL base y los timeouts los resuelve ApiClient
      final response = await _apiClient.dio.post(
        ApiEndpoints.login,
        data: {
          'username': credentials.username,
          'password': credentials.password,
        },
        options: Options(
          contentType: Headers.formUrlEncodedContentType,
          // Evita que el interceptor intente inyectar un Bearer Token antes de obtenerlo
          extra: {'requiresAuth': false},
        ),
      );

      final session = AuthSession.fromJson(response.data as Map<String, dynamic>);

      // Persistencia cifrada del JWT para sesiones duraderas
      await _storage.write(key: _tokenKey, value: session.accessToken);

      return session;
    } on DioException catch (e) {
      final message = e.response?.data?['detail'] ?? 'Error de conexión con el servidor.';
      throw Exception(message);
    }
  }

  /// <!> ACCESO RÁPIDO / MODO DEMO:
  /// Permite iniciar sesión automáticamente sin tipear credenciales cada vez que se reinicia el entorno.
  Future<AuthSession> loginAsDemo() async {
    return await login(
      const LoginCredentials(
        username: 'admin@beltramelli.com',
        password: '654321',
      ),
    );
  }

  /// Verifica si existe una sesión válida guardada en disco para realizar Auto-Login.
  Future<bool> hasActiveSession() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      return token != null && token.isNotEmpty;
    } catch (_) {
      return false;
    }
  }

  /// Retorna el token activo en memoria.
  Future<String?> getActiveToken() async {
    return await _storage.read(key: _tokenKey);
  }

  /// Cierra la sesión activa revocando las credenciales locales.
  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }
}