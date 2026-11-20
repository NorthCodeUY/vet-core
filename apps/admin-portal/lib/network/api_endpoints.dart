// apps/admin-portal/lib/network/api_endpoints.dart

// lib/network/api_endpoints.dart

/// Catálogo centralizado de rutas y endpoints de la API REST (FastAPI).
///
/// Implementa una clase abstracta final para:
/// 1. Prevenir instanciaciones accidentales (`final class` en Dart 3).
/// 2. Erradicar URLs y strings quemados en repositorios y controladores.
/// 3. Estandarizar rutas con parámetros dinámicos mediante métodos estáticos.
abstract final class ApiEndpoints {
  // ===========================================================================
  // 1. MÓDULO DE AUTENTICACIÓN Y SEGURIDAD (OAuth2 / JWT)
  // ===========================================================================
  /// Endpoint de emisión de tokens OAuth2 (`POST`).
  /// Espera formato `application/x-www-form-urlencoded` con 'username' y 'password'.
  static const String login = '/api/auth/token';

  /// Endpoint para validar o refrescar el token de acceso activo (`POST`).
  static const String refreshToken = '/api/auth/refresh';

  /// Endpoint para revocar la sesión en el servidor (`POST`).
  static const String logout = '/api/auth/logout';

  // ===========================================================================
  // 2. MÓDULO DE CATÁLOGO, PRODUCTOS Y VITRINA (E-COMMERCE)
  // ===========================================================================

  /// Listado de productos para portal administrativo (`GET /api/productos/admin_todos`). 
  static const String adminProducts = '/api/productos/admin_todos';

  /// Operaciones sobre un producto específico por ID (`GET`, `PUT`, `DELETE`).
  /// - `DELETE`: Baja lógica (`prod_activo = false`).
  /// - `PUT`: Actualización de stock, precios y datos.
  static String productById(int id) => '/api/productos/$id';

  /// Conmutador de visibilidad para publicar u ocultar en la vitrina web (`PATCH /api/productos/:id/vitrina`).
  static String toggleShowcase(int id) => '/api/productos/$id/vitrina';

  /// Carga y actualización de imagen principal del producto (`POST` multipart). <!> no lo uso creo
  static String uploadProductImage(int id) => '/api/productos/$id/imagen';

  // ===========================================================================
  // 3. MÓDULO DE ÓRDENES Y PEDIDOS (MONITOREO)
  // ===========================================================================
  /// Listado de pedidos recibidos desde la tienda pública (`GET`). /<!> no lo uso
  static const String orders = '/api/pedidos';

  /// Detalle o actualización de estado de un pedido (`GET`, `PATCH`).<!> No lo uso
  static String orderById(int id) => '/api/pedidos/$id';

  // ===========================================================================
  // 4. MÓDULO DE CONFIGURACIÓN DEL COMERCIO
  // ===========================================================================
  /// Metadatos operativos del tenant (horarios, teléfonos, bancos) (`GET`, `PUT`).
  static const String businessSettings = '/api/configuracion';


}