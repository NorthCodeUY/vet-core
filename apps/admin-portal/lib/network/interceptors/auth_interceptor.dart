// apps/admin-portal/lib/network/interceptors/auth_interceptor.dart

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Interceptor de seguridad HTTP encargado de la gestión de credenciales Bearer.
///
/// Responsabilidades arquitectónicas:
/// 1. Interceptar solicitudes salientes para inyectar la cabecera `Authorization: Bearer <token>`.
/// 2. Omitir la inyección en rutas públicas (como el endpoint de login).
/// 3. Capturar errores HTTP `401 Unauthorized` de forma centralizada para revocar
///    credenciales obsoletas o expiradas en disco local.
class AuthInterceptor extends Interceptor {
  // Almacenamiento seguro nativo (Keychain en iOS/macOS, KeyStore en Android, Cifrado en Web)
  final FlutterSecureStorage _storage;

  // Clave canónica bajo la cual se almacena el JWT
  static const String _tokenKey = 'auth_access_token';

  /// Constructor con inyección de dependencias para facilitar testing unitario mediante mocks.
  AuthInterceptor({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // =========================================================================
    // 1. FILTRADO DE RUTAS EXENTAS DE AUTENTICACIÓN
    // =========================================================================
    // Evita enviar cabeceras vacías o tokens residuales durante el login inicial
    final isAuthEndpoint = options.path.contains(ApiEndpoints.login);

    if (!isAuthEndpoint) {
      try {
        // Recuperación asíncrona del JWT desde el almacenamiento seguro
        final token = await _storage.read(key: _tokenKey);

        if (token != null && token.isNotEmpty) {
          // Inyección del formato estándar OAuth2 Bearer
          options.headers['Authorization'] = 'Bearer $token';
        }
      } catch (e) {
        debugPrint('⚠️ [AuthInterceptor] Error al leer el token de seguridad: $e');
      }
    }

    // Permite que la petición continúe su flujo hacia el servidor
    return handler.next(options);
  }

  @override
  void onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // =========================================================================
    // 2. GESTIÓN CENTRALIZADA DE SESIÓN EXPIRADA (HTTP 401)
    // =========================================================================
    if (err.response?.statusCode == 401) {
      debugPrint('⛔ [AuthInterceptor] 401 Unauthorized detectado en: ${err.requestOptions.path}');
      debugPrint('🧹 [AuthInterceptor] Purgando credenciales inválidas de disco...');

      try {
        // Elimina el token corrupto o expirado para forzar re-autenticación limpia
        await _storage.delete(key: _tokenKey);
      } catch (e) {
        debugPrint('⚠️ [AuthInterceptor] Error al purgar token: $e');
      }
    }

    // Propaga el error para que los repositorios y la UI puedan renderizar mensajes al usuario
    return handler.next(err);
  }
}