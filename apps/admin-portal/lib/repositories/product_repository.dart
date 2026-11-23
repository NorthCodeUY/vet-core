// apps/admin-portal/lib/repositories/product_repository.dart

import 'package:dio/dio.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Repositorio y capa de acceso a datos para el ciclo de vida del catálogo en FastAPI.
///
/// Centraliza lectura administrativa, altas (`POST`), modificaciones integrales (`PUT`),
/// toggles rápidos de vitrina (`PATCH`) y bajas lógicas (`DELETE`), normalizando
/// errores HTTP y validaciones Pydantic `422`.
class ProductRepository {
  /// Cliente HTTP compartido configurado con base URL dinámica e interceptores JWT.
  final ApiClient _apiClient;

  /// Crea el repositorio permitiendo inyectar un [ApiClient] en pruebas unitarias.
  ProductRepository({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  /// Obtiene todos los productos del catálogo administrativo
  /// (`GET /api/productos/admin_todos`).
  Future<List<Product>> getProducts() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.adminProducts);
      final rawList = response.data as List<dynamic>? ?? const [];

      return rawList
          .whereType<Map<String, dynamic>>()
          .map(Product.fromJson)
          .toList();
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al conectar con /api/productos/admin_todos.'),
      );
    }
  }

  /// Crea un nuevo producto integral en el catálogo (`POST /api/productos` -> `201`).
  ///
  /// Incluye relación primaria (`cat_id`), galería (`imagenes`), subcategorías
  /// N:M y variantes (`variantes`).
  Future<Product> createProduct({required Product product}) async {
    try {
      final payload = _buildProductPayload(product);
      // <!> Asegúrate de tener definido `static const String products = '/api/productos';` en `api_endpoints.dart`.
      final response = await _apiClient.post(
        ApiEndpoints.products,
        data: payload,
      );
      return Product.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw Exception(_extractErrorMessage(e, 'Error al crear el producto.'));
    }
  }

  /// Modificación integral de producto (`PUT /api/productos/{prod_id}`).
  ///
  /// Actualiza los atributos base y sincroniza sus colecciones de imágenes,
  /// subcategorías y variantes según el contrato Pydantic del backend.
  Future<Product> updateProduct({
    required int productId,
    required Product product,
  }) async {
    try {
      final payload = _buildProductPayload(product);
      final response = await _apiClient.put(
        ApiEndpoints.productById(productId),
        data: payload,
      );
      return Product.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al modificar el producto #$productId.'),
      );
    }
  }

  /// Alterna rápidamente la visibilidad pública en vitrina
  /// (`PATCH /api/productos/{prod_id}/vitrina`).
  Future<void> toggleShowcaseVisibility({
    required int productId,
    required bool isVisible,
  }) async {
    try {
      await _apiClient.patch(
        ApiEndpoints.toggleShowcase(productId),
        data: {'prod_visible': isVisible},
      );
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'No se pudo modificar la visibilidad en vitrina.'),
      );
    }
  }

  /// Actualización rápida de inventario y precios base (`PUT /api/productos/{prod_id}`).
  Future<Product> updateProductStockAndPrice({
    required int productId,
    required int stock,
    required double salePrice,
    double? costPrice,
  }) async {
    try {
      final response = await _apiClient.put(
        ApiEndpoints.productById(productId),
        data: {
          'prod_stock': stock,
          'prod_precio_venta': salePrice,
          if (costPrice != null) 'prod_precio_costo': costPrice,
        },
      );
      return Product.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al actualizar stock y precio del producto.'),
      );
    }
  }

  /// Baja lógica de producto (`DELETE /api/productos/{prod_id}` -> `prod_activo = False`).
  Future<void> softDeleteProduct(int productId) async {
    try {
      await _apiClient.delete(ApiEndpoints.productById(productId));
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'No se pudo dar de baja el producto.'),
      );
    }
  }

  /// Construye el payload unificado para `POST` y `PUT` manteniendo simetría
  /// exacta con los schemas Pydantic de FastAPI.
  Map<String, dynamic> _buildProductPayload(Product product) {
    return <String, dynamic>{
      'prod_nombre': product.name,
      'prod_descripcion': product.description,
      'prod_codigo_barra': product.barcode,
      'prod_precio_venta': product.salePrice,
      'prod_precio_costo': product.costPrice,
      'prod_stock': product.stock,
      'prod_stock_minimo': product.minStock,
      'prod_solo_variantes': product.onlyVariants,
      'prod_activo': product.isActive,
      'prod_disponible': product.isAvailable,
      'prod_visible': product.isVisibleInShowcase,
      'prod_per_sin_stock': product.allowBackorder,
      'cat_id': product.categoryId,
      'imagenes': product.images.map((img) => img.url).toList(),
      // <!> Verifica en tu schema FastAPI si la clave esperada es `subcategorias_ids`, `subc_ids` o `subcategorias`.
      'subcategorias_ids': product.subcategories.map((s) => s.id).toList(),
      'variantes': product.variants
          .map(
            (v) => <String, dynamic>{
              'var_tipo': v.type,
              'var_nombre': v.name,
              'var_precio_venta': v.salePrice,
              'var_precio_costo': v.costPrice,
              'var_stock': v.stock,
              'var_stock_minimo': v.minStock,
              'val_sku': v.sku,
              'var_codigo_barra': v.barcode,
              if (v.color != null) 'col_id': v.color!.id,
              'var_activo': v.isActive,
              'var_visible': v.isVisibleInShowcase,
              'var_disponible': v.isAvailable,
              'var_permitir_sin_stock': v.allowBackorder,
            },
          )
          .toList(),
    };
  }

  /// Normaliza errores HTTP de FastAPI (`detail` como string o lista de validación `422`).
  String _extractErrorMessage(DioException e, String fallback) {
    final data = e.response?.data;
    if (data is Map<String, dynamic>) {
      final detail = data['detail'];
      if (detail is String && detail.trim().isNotEmpty) {
        return detail.trim();
      }
      if (detail is List && detail.isNotEmpty) {
        final first = detail.first;
        if (first is Map<String, dynamic> && first['msg'] is String) {
          return first['msg'] as String;
        }
      }
    }
    return fallback;
  }
}