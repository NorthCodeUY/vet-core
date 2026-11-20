// apps/admin-portal/lib/config/app_environment.dart
// Propósito: Resolver la URL base del backend FastAPI por entorno/tenant y normalizar rutas multimedia.

import 'package:flutter/foundation.dart';

/// Proveedor de configuración de entorno inyectada en tiempo de compilación o arranque.
abstract final class AppEnvironment {
  /// URL base del backend FastAPI para el portal activo.
  ///
  /// Prioridad de resolución (arquitectura Single-Binary multi-portal):
  /// 1. `--dart-define=API_URL=...` explícito (Desktop, Mobile o desarrollo local).
  /// 2. Cadena vacía (`""`) en Web Release detrás de Nginx Proxy (`location /api/`).
  /// 3. Fallback `http://127.0.0.1:8001` en modo debug local sin flags.
  // <!> Soporta múltiples portales sin hardcoding: Web usa ruta relativa hacia Nginx y nativo/dev usa --dart-define
  static String get apiUrl {
    const definedUrl = String.fromEnvironment('API_URL', defaultValue: '');
    if (definedUrl.isNotEmpty) {
      return definedUrl;
    }

    if (kIsWeb && const bool.fromEnvironment('dart.vm.product', defaultValue: false)) {
      return '';
    }

    return 'http://127.0.0.1:8001';
  }

  /// Convierte una ruta de imagen relativa (`/static/...`) en una URL utilizable por [Image.network].
  ///
  /// Mantiene intactas las URLs absolutas (`http://` / `https://` de R2 o S3) y antepone
  /// [apiUrl] cuando el backend devuelve rutas relativas.
  // <!> Evita que rutas relativas fallen en Linux/Desktop o apunten al puerto incorrecto en dev
  static String resolveMediaUrl(String rawUrl) {
    final trimmed = rawUrl.trim();
    if (trimmed.isEmpty) return '';

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    final base = apiUrl.endsWith('/') ? apiUrl.substring(0, apiUrl.length - 1) : apiUrl;
    final path = trimmed.startsWith('/') ? trimmed : '/$trimmed';
    return '$base$path';
  }
}