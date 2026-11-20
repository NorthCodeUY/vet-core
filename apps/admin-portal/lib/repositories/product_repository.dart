// apps/admin-portal/lib/repositories/product_repository.dart

import 'package:dio/dio.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';
import 'package:admin_portal/models/product/product.dart';

/// Caso de uso y repositorio para el ciclo de vida del catálogo en FastAPI.
class ProductRepository {

  
  final ApiClient _apiClient;  // Inyección de dependencia para pruebas unitarias y desacoplamiento.

  ProductRepository({ApiClient? apiClient}) 
      : _apiClient = apiClient ?? ApiClient();


  /// Obtiene todos los productos del catálogo (`GET /api/productos/admin_todos`).
  Future<List<Product>> getProducts() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.adminProducts);

      final List<dynamic> rawList = response.data as List<dynamic>;
      return rawList
          .map((item) => Product.fromJson(item as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      final message = e.response?.data?['detail'] ??
          'Error al conectar con /api/productos/admin_todos';
      throw Exception(message);
    }
  }


  /// Alterna la visibilidad en vitrina (`PATCH /api/productos/:id/vitrina`).
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
      final message = e.response?.data?['detail'] ??
          'No se pudo modificar la visibilidad en vitrina.';
      throw Exception(message);
    }
  }

  /// Modifica inventario o precios base (`PUT /api/productos/:id`).
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
      final message =
          e.response?.data?['detail'] ?? 'Error al actualizar producto.';
      throw Exception(message);
    }
  }

  /// Baja lógica de producto (`DELETE /api/productos/:id` -> `prod_activo = False`).
  Future<void> softDeleteProduct(int productId) async {
    try {
      await _apiClient.delete(ApiEndpoints.productById(productId));
    } on DioException catch (e) {
      final message =
          e.response?.data?['detail'] ?? 'No se pudo dar de baja el producto.';
      throw Exception(message);
    }
  }
}