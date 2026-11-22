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


// <!> metodo agregar 
// 

  /// Modificación integral de producto (`PUT /api/productos/{prod_id}`).
  ///
  /// Recibe el [productId] objetivo y el [product] completo con sus listas de
  /// imágenes y variantes actualizadas; mapea el payload al contrato Pydantic
  /// (`imagenes: List<String>`, `variantes: List<Map>` con `col_id`).
  ///
  /// Retorna el [Product] actualizado devuelto por FastAPI o lanza [Exception]
  /// con el detalle de validación ante errores `422` o de red.
  /// 
  /// 
  // <!> Implementación completa del contrato PUT /api/productos/{prod_id}
  Future<Product> updateProduct({
    required int productId,
    required Product product,
  }) async {
    try {
      final payload = <String, dynamic>{
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
        'variantes': product.variants.map((v) => <String, dynamic>{
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
        }).toList(),
      };

      final response = await _apiClient.put(
        ApiEndpoints.productById(productId),
        data: payload,
      );

      return Product.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      final detail = e.response?.data?['detail'];
      final message = detail is String
          ? detail
          : 'Error al modificar el producto #$productId.';
      throw Exception(message);
    }
  }



}