// apps/admin-portal/lib/config/app_environment.dart
// Propósito: Resolver dinámicamente el host del backend en Web Debug (localhost, LAN o WireGuard) y rutas relativas en producción.

import 'package:flutter/foundation.dart';

/// Proveedor de configuración de entorno inyectada en compilación o resuelta en runtime.
abstract final class AppEnvironment {
  /// Puerto del backend inyectado vía `--dart-define=API_PORT=8001`.
  static const String _apiPort = String.fromEnvironment('API_PORT', defaultValue: '8001');

  /// URL base del backend FastAPI para el portal activo.
  ///
  /// Prioridad de resolución:
  /// 1. `--dart-define=API_URL=...` explícito (Desktop, Mobile o entorno custom).
  /// 2. Cadena vacía (`""`) en Web Release (`kReleaseMode`) detrás de Nginx Proxy.
  /// 3. En Web Debug (`kIsWeb`), reutiliza automáticamente `Uri.base.host` (soporta
  ///    `localhost`, IP de red local `192.168.x.x` y VPN WireGuard `10.252.x.x`).
  /// 4. Fallback `http://127.0.0.1:<API_PORT>` en nativo sin flags.
  // <!> Permite abrir el portal desde WireGuard/LAN/celular apuntando al backend en la misma IP del host
  static String get apiUrl {
    const definedUrl = String.fromEnvironment('API_URL', defaultValue: '');
    if (definedUrl.isNotEmpty) {
      return definedUrl;
    }

    if (kIsWeb && kReleaseMode) {
      return '';
    }

    if (kIsWeb) {
      final scheme = Uri.base.scheme.isNotEmpty ? Uri.base.scheme : 'http';
      final host = Uri.base.host.isNotEmpty ? Uri.base.host : 'localhost';
      return '$scheme://$host:$_apiPort';
    }

    return 'http://127.0.0.1:$_apiPort';
  }

  /// Normaliza una ruta de imagen relativa (`/static/...`) para consumo en [Image.network].
  ///
  /// Mantiene intactas las URLs absolutas (`http://` / `https://` de R2 o S3) y antepone
  /// [apiUrl] cuando el backend devuelve rutas relativas.
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