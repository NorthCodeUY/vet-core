
// apps/admin-portal/lib/config/app_environment.dart

import 'package:flutter/foundation.dart';

class AppEnvironment {
  /// URL del backend FastAPI. <!> EL PROBLEMA QEU PASA CUADO TENGO VARIOS PORTALES QUE PASA CREO QEU ESTO DEVERIA PASARLO A VARAIABLEW DE ENTRONE Y TRABAJARLO DE HAY NO SE 
  /// 
  /// - En Web Producción (compilado): Usa ruta relativa vacía "" para que las peticiones
  ///   vayan a '/api/auth/token' y NGINX las redirija a ${BACKEND_HOST}.
  /// - En Desarrollo local: Usa --dart-define=API_URL o fallback a localhost:8001.
  static String get apiUrl {
    if (kIsWeb && const bool.fromEnvironment('dart.vm.product', defaultValue: false)) {
      return ''; // Relativo al dominio actual: https://administracion.veterinaria-beltramelli.com
    }
    return const String.fromEnvironment(
      'API_URL',
      defaultValue: 'http://127.0.0.1:8001',
    );
  }
}