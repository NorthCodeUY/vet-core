// apps/admin-portal/lib/network/api_client.dart

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:admin_portal/config/app_environment.dart';
import 'interceptors/auth_interceptor.dart';

/// Cliente HTTP centralizado para la comunicación con el silo FastAPI.
///
/// Implementa una envoltura sobre [Dio] que garantiza:
/// 1. Inyección de `baseUrl` resuelta en tiempo de compilación o runtime.
/// 2. Configuración uniforme de cabeceras (`Content-Type`, `Accept`).
/// 3. Inyección automática del token JWT mediante [AuthInterceptor].
/// 4. Tiempos de espera (timeouts) estrictos para evitar bloqueos de interfaz.
/// 5. Registro estructurado de logs en modo depuración (Debug Mode).
class ApiClient {
  /// Instancia configurada de Dio para ejecutar peticiones HTTP.
  late final Dio dio;

  /// Constructor que inicializa las opciones globales de red.
  ApiClient() {
    dio = Dio(
      BaseOptions(
        // <!> RESOLUCIÓN DE HOST: Toma el valor de AppEnvironment (--dart-define=API_URL)
        baseUrl: AppEnvironment.apiUrl,
        connectTimeout: const Duration(seconds: 10), // Límite para establecer conexión
        receiveTimeout: const Duration(seconds: 10), // Límite para recibir datos
        sendTimeout: const Duration(seconds: 10),    // Límite para subir payloads/fotos
        headers: const {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _setupInterceptors();
  }

  /// Registra los interceptores de seguridad y diagnóstico.
  void _setupInterceptors() {
    // 1. Interceptor de seguridad: Inyecta Bearer Token y captura 401
    dio.interceptors.add(AuthInterceptor());

    // 2. Interceptor de logging: Solo activo en entorno de desarrollo local
    if (kDebugMode) {
      dio.interceptors.add(
        LogInterceptor(
          request: true,
          requestHeader: true,
          requestBody: true,
          responseHeader: false,
          responseBody: true,
          error: true,
          logPrint: (object) => debugPrint('🌐 [DIO] $object'),
        ),
      );
    }
  }

  // ===========================================================================
  // MÉTODOS DE CONVENIENCIA HTTP (CRUD BÁSICO)
  // ===========================================================================

  /// Petición HTTP GET.
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.get<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// Petición HTTP POST.
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// Petición HTTP PUT.
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// Petición HTTP PATCH.
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.patch<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// Petición HTTP DELETE.
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return await dio.delete<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }
}