

// apps/admin-portal/lib/repositories/product_repository.dart
// Propósito: Capa de acceso a datos para catálogo de productos, subida de imágenes
// a Cloudflare R2 y normalización de errores HTTP FastAPI/Pydantic.

import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Repositorio para el ciclo de vida completo de productos en FastAPI.
///
/// Centraliza:
/// - Lectura administrativa (`GET /api/productos/admin/listado`).
/// - Subida de imágenes a Cloudflare R2 (`POST /api/productos/upload-imagen`).
/// - Altas (`POST /api/productos`) y ediciones integrales (`PUT /api/productos/{id}`).
/// - Toggles rápidos de vitrina (`PATCH`) y bajas lógicas (`DELETE`).
class ProductRepository {
  /// Cliente HTTP compartido configurado con base URL dinámica e interceptores JWT.
  final ApiClient _apiClient;

  /// Crea el repositorio permitiendo inyectar un [ApiClient] en pruebas unitarias.
  ProductRepository({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  /// Sube una imagen (`image/jpeg`, `image/png` o `image/webp`, máx. 5 MB) a Cloudflare R2
  /// (`POST /api/productos/upload-imagen`) y devuelve la URL pública `img_url`.
  Future<String> uploadProductImage({
    required Uint8List bytes,
    required String filename,
    required String mimeType,
  }) async {
    const maxBytes = 5 * 1024 * 1024;
    if (bytes.lengthInBytes > maxBytes) {
      throw Exception('La imagen "$filename" supera el límite máximo de 5 MB.');
    }

    final normalizedMime = mimeType.toLowerCase().trim();
    const allowedSubtypes = <String, String>{
      'image/jpeg': 'jpeg',
      'image/jpg': 'jpeg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    final subtype = allowedSubtypes[normalizedMime];
    if (subtype == null) {
      throw Exception(
        'Formato no soportado ($normalizedMime). Usa JPG, PNG o WEBP.',
      );
    }

    try {
      // Se fuerza DioMediaType explícito para evitar que Flutter Web envíe application/octet-stream (400).
      final formData = FormData.fromMap({
        'file': MultipartFile.fromBytes(
          bytes,
          filename: filename,
          contentType: DioMediaType('image', subtype),
        ),
      });

      final response = await _apiClient.post<Map<String, dynamic>>(
        ApiEndpoints.uploadProductImageR2,
        data: formData,
        // Sobrescribe Content-Type JSON global de BaseOptions y amplía timeouts para binarios.
        options: Options(
          contentType: Headers.multipartFormDataContentType,
          sendTimeout: const Duration(seconds: 30),
          receiveTimeout: const Duration(seconds: 30),
        ),
      );

      final imgUrl = (response.data?['img_url'] as String? ?? '').trim();
      if (imgUrl.isEmpty) {
        throw Exception('El servidor no devolvió la URL de la imagen subida.');
      }
      return imgUrl;
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al subir la imagen al servidor.'),
      );
    }
  }

  /// Obtiene todos los productos del catálogo administrativo
  /// (`GET /api/productos/admin/listado`).





// <!> Listado paginado compatible hacia atrás con skip, limit, search y cat_id.
  /// Obtiene productos del catálogo administrativo (`GET /api/productos/admin/listado`).
  Future<List<Product>> getProducts({
    int skip = 0,
    int limit = 50,
    String? search,
    int? categoryId,
  }) async {
    try {
      final trimmedSearch = search?.trim() ?? '';
      final response = await _apiClient.get(
        ApiEndpoints.adminProducts,
        queryParameters: <String, dynamic>{
          'skip': skip,
          'limit': limit,
          if (trimmedSearch.isNotEmpty) 'search': trimmedSearch,
          if (categoryId != null) 'cat_id': categoryId,
        },
      );
      final rawList = response.data as List<dynamic>? ?? const [];

      return rawList
          .whereType<Map<String, dynamic>>()
          .map(Product.fromJson)
          .toList();
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al obtener el listado administrativo.'),
      );
    }
  }





  // Future<List<Product>> getProducts() async {
  //   try {
  //     final response = await _apiClient.get(ApiEndpoints.adminProducts);
  //     final rawList = response.data as List<dynamic>? ?? const [];

  //     return rawList
  //         .whereType<Map<String, dynamic>>()
  //         .map(Product.fromJson)
  //         .toList();
  //   } on DioException catch (e) {
  //     throw Exception(
  //       _extractErrorMessage(e, 'Error al obtener el listado administrativo.'),
  //     );
  //   }
  // }













  // <!> Buscador irrestricto contra backend (`GET /api/productos/admin/filtrados`).
  /// Ejecuta búsqueda administrativa irrestricto por [search] y/o [categoryId].
  ///
  /// Devuelve coincidencias aunque el producto tenga `prod_activo = false`,
  /// `prod_visible = false` o `prod_stock = 0`, ordenado por `prod_id DESC`.
  Future<List<Product>> searchAdminProducts({
    String? search,
    int? categoryId,
  }) async {
    try {
      final trimmedSearch = search?.trim() ?? '';
      final queryParameters = <String, dynamic>{
        if (trimmedSearch.isNotEmpty) 'search': trimmedSearch,
        if (categoryId != null) 'cat_id': categoryId,
      };

      final response = await _apiClient.get(
        ApiEndpoints.adminFilteredProducts,
        queryParameters: queryParameters.isEmpty ? null : queryParameters,
      );
      final rawList = response.data as List<dynamic>? ?? const [];

      return rawList
          .whereType<Map<String, dynamic>>()
          .map(Product.fromJson)
          .toList();
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al filtrar productos en el servidor.'),
      );
    }
  }

  // <!> Catálogo de categorías para poblar el filtro en SearchAndFilters.
  /// Obtiene las categorías disponibles (`GET /api/categorias`).
  Future<List<Category>> getCategories() async {
    try {
      final response = await _apiClient.get(ApiEndpoints.categorias);
      final rawList = response.data as List<dynamic>? ?? const [];

      return rawList
          .whereType<Map<String, dynamic>>()
          .map(Category.fromJson)
          .toList();
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al obtener las categorías.'),
      );
    }
  }














  /// Crea un nuevo producto integral en el catálogo (`POST /api/productos` -> `201`).
  ///
  /// Incluye categoría primaria (`cat_id`), lista plana de URLs (`imagenes`),
  /// subcategorías N:M (`subcategorias_ids`) y variantes (`variantes`).
  Future<Product> createProduct({required Product product}) async {
    try {
      final payload = _buildProductPayload(product);
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
  /// Reemplaza la galería completa enviando `"imagenes": List<String>` (índice `0` = principal)
  /// y sincroniza atributos, subcategorías y variantes según contrato FastAPI.
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

  /// Construye el payload unificado para `POST` y `PUT` cumpliendo la asimetría del backend:
  /// al leer devuelve `rel_imagenes`, pero al escribir espera `imagenes: List<String>`.
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

  /// Normaliza errores HTTP de FastAPI (`detail` como string o lista `422`) y códigos críticos.
  String _extractErrorMessage(DioException e, String fallback) {
    final statusCode = e.response?.statusCode;
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

    return switch (statusCode) {
      400 => 'Solicitud inválida o formato de imagen no permitido (400).',
      413 => 'La imagen supera el tamaño máximo permitido de 5 MB (413).',
      422 => 'Datos de producto inválidos según validación del servidor (422).',
      502 => 'Error de comunicación con el almacenamiento de imágenes R2 (502).',
      _ => fallback,
    };
  }
}