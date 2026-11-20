// apps/admin-portal/lib/repositories/auth_repository.dart
// Propósito: Orquestar autenticación OAuth2, persistencia segura de JWT y restauración de sesión.

import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:admin_portal/models/auth_models.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Repositorio de autenticación y gestión de sesión JWT para el portal SaaS.
///
/// Centraliza el login OAuth2 contra FastAPI, almacena el token de acceso en
/// almacenamiento cifrado ([FlutterSecureStorage]) y recuerda el último usuario
/// en preferencias locales para agilizar re-autenticaciones tras expiración.
class AuthRepository {
  // --- Estado y Dependencias ---

  final ApiClient _apiClient;
  final FlutterSecureStorage _storage;

  /// Clave canónica del JWT en almacenamiento cifrado.
  static const String _tokenKey = 'auth_access_token';

  /// Clave no sensible para prellenar el último identificador usado tras logout/expiración.
  static const String _lastUserKey = 'auth_last_username';

  /// Crea una instancia de [AuthRepository] permitiendo inyección de dependencias para tests.
  AuthRepository({
    ApiClient? apiClient,
    FlutterSecureStorage? storage,
  })  : _apiClient = apiClient ?? ApiClient(),
        _storage = storage ?? const FlutterSecureStorage();

  // --- Acciones Públicas ---

  /// Autentica al usuario contra FastAPI (`POST /api/auth/token`).
  ///
  /// Recibe [credentials] en formato OAuth2 (`x-www-form-urlencoded`), persiste
  /// el JWT resultante en almacenamiento cifrado y guarda el nombre de usuario.
  /// Lanza [Exception] con el mensaje de detalle de FastAPI ante credenciales inválidas o error de red.
  Future<AuthSession> login(LoginCredentials credentials) async {
    try {
      final response = await _apiClient.dio.post(
        ApiEndpoints.login,
        data: {
          'username': credentials.username,
          'password': credentials.password,
        },
        options: Options(
          contentType: Headers.formUrlEncodedContentType,
          // Evita que AuthInterceptor adjunte un token previo o expirado en el endpoint de login.
          extra: {'requiresAuth': false},
        ),
      );

      final session = AuthSession.fromJson(response.data as Map<String, dynamic>);

      await _storage.write(key: _tokenKey, value: session.accessToken);
      await _saveLastUsername(credentials.username);

      return session;
    } on DioException catch (e) {
      final message = e.response?.data?['detail'] ?? 'Error de conexión con el servidor.';
      throw Exception(message);
    }
  }

  /// Verifica si existe un JWT almacenado y vigente para habilitar Auto-Login.
  ///
  /// Si el token está corrupto o expirado según su claim `exp`, lo depura
  /// automáticamente del almacenamiento seguro y retorna `false`.
  Future<bool> hasActiveSession() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      if (token == null || token.isEmpty) return false;

      if (_isJwtExpired(token)) {
        await _storage.delete(key: _tokenKey);
        return false;
      }

      return true;
    } catch (_) {
      // Ante fallos de descifrado (ej. cambio de clave WebCrypto/Keyring), fuerza login limpio.
      await logout();
      return false;
    }
  }

  /// Recupera el JWT activo almacenado o `null` si no hay sesión iniciada.
  Future<String?> getActiveToken() async {
    try {
      return await _storage.read(key: _tokenKey);
    } catch (_) {
      return null;
    }
  }

  /// Obtiene el último usuario que inició sesión exitosamente para prellenar el formulario.
  Future<String?> getLastUsername() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_lastUserKey);
  }

  /// Revoca la sesión local eliminando el JWT del almacenamiento cifrado.
  ///
  /// Conserva [_lastUserKey] para mejorar la UX en el siguiente ingreso.
  Future<void> logout() async {
    await _storage.delete(key: _tokenKey);
  }

  // --- Helpers Privados ---

  Future<void> _saveLastUsername(String username) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_lastUserKey, username);
  }

  /// Decodifica el payload del JWT sin dependencias externas para evaluar expiración local.
  bool _isJwtExpired(String token) {
    try {
      final parts = token.split('.');
      // Si el backend emitiera un token opaco no-JWT, delega la validación al servidor.
      if (parts.length != 3) return false;

      final normalized = base64Url.normalize(parts[1]);
      final payloadJson = utf8.decode(base64Url.decode(normalized));
      final payload = jsonDecode(payloadJson) as Map<String, dynamic>;

      final exp = payload['exp'];
      if (exp is! num) return false;

      // Margen de seguridad de 30s para evitar navegar al dashboard con un token a punto de caducar.
      final nowMs = DateTime.now().millisecondsSinceEpoch;
      final expMs = (exp * 1000).toInt();
      return nowMs >= (expMs - 30000);
    } catch (_) {
      return true;
    }
  }
}