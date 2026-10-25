// lib/core/config/app_environment.dart

/// Configuración de infraestructura inyectada en runtime.
class AppEnvironment {
  /// URL del backend FastAPI.
  /// 
  /// En desarrollo: Viene de --dart-define=API_URL=http://localhost:8000
  /// En producción Web/Nginx: Si no se define, usa una ruta relativa vacía o el proxy inverso.
  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://127.0.0.1:8000',
  );

  /// Identificador del entorno actual (desarrollo, produccion)
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'development',
  );
}