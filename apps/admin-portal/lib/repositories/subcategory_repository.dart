// apps/admin-portal/lib/repositories/subcategory_repository.dart

import 'package:dio/dio.dart';
import 'package:admin_portal/models/product/subcategory_model.dart';
import 'package:admin_portal/network/api_client.dart';
import 'package:admin_portal/network/api_endpoints.dart';

/// Repositorio encargado de operar el CRUD de subcategorías contra FastAPI.
///
/// Centraliza el consumo de [ApiEndpoints.subcategorias] usando [ApiClient],
/// deserializa hacia la entidad [Subcategory] y traduce errores HTTP (`422`,
/// `404`, conflictos de unicidad) en excepciones legibles para la capa UI.
class SubcategoryRepository {
  /// Cliente HTTP compartido configurado con interceptores JWT y base URL del tenant.
  final ApiClient _client;

  /// Crea el repositorio permitiendo inyectar un [ApiClient] en pruebas unitarias.
  SubcategoryRepository({ApiClient? client}) : _client = client ?? ApiClient();

  /// Lista todas las subcategorías configuradas para el tenant activo
  /// (`GET /api/subcategorias`).
  Future<List<Subcategory>> getAll() async {
    try {
      final response = await _client.dio.get<List<dynamic>>(
        ApiEndpoints.subcategorias,
      );
      final data = response.data ?? const [];

      // Filtra entradas válidas para evitar fallos de casteo ante respuestas parciales.
      return data
          .whereType<Map<String, dynamic>>()
          .map(Subcategory.fromJson)
          .toList();
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'No se pudieron cargar las subcategorías.'),
      );
    }
  }

  /// Obtiene el detalle de una subcategoría por su identificador
  /// (`GET /api/subcategorias/{subc_id}`).
  Future<Subcategory> getById(int subcId) async {
    try {
      final response = await _client.dio.get<Map<String, dynamic>>(
        ApiEndpoints.subcategoriaDetalle(subcId),
      );
      return Subcategory.fromJson(response.data ?? const {});
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Subcategoría no encontrada.'),
      );
    }
  }

  /// Crea una nueva subcategoría (`POST /api/subcategorias` -> `201`).
  ///
  /// Recibe el discriminador [iconType] (`ICONO` | `IMAGEN`) para garantizar
  /// consistencia entre `subc_icono` y `subc_imagen_url` en FastAPI.
  Future<Subcategory> create({
    required String name,
    required SubcategoryIconType iconType,
    String? iconName,
    String? imageUrl,
  }) async {
    try {
      final payload = Subcategory(
        id: 0,
        name: name,
        iconType: iconType,
        iconName: iconName,
        imageUrl: imageUrl,
      ).toPayloadJson();

      final response = await _client.dio.post<Map<String, dynamic>>(
        ApiEndpoints.subcategorias,
        data: payload,
      );
      return Subcategory.fromJson(response.data ?? const {});
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al crear la subcategoría.'),
      );
    }
  }

  /// Modifica una subcategoría existente (`PUT /api/subcategorias/{subc_id}`).
  Future<Subcategory> update({
    required int id,
    required String name,
    required SubcategoryIconType iconType,
    String? iconName,
    String? imageUrl,
  }) async {
    try {
      final payload = Subcategory(
        id: id,
        name: name,
        iconType: iconType,
        iconName: iconName,
        imageUrl: imageUrl,
      ).toPayloadJson();

      final response = await _client.dio.put<Map<String, dynamic>>(
        ApiEndpoints.subcategoriaDetalle(id),
        data: payload,
      );
      return Subcategory.fromJson(response.data ?? const {});
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al actualizar la subcategoría.'),
      );
    }
  }

  /// Elimina una subcategoría y remueve sus vínculos en la tabla intermedia N:M
  /// (`DELETE /api/subcategorias/{subc_id}`).
  Future<void> delete(int subcId) async {
    try {
      await _client.dio.delete<Map<String, dynamic>>(
        ApiEndpoints.subcategoriaDetalle(subcId),
      );
    } on DioException catch (e) {
      throw Exception(
        _extractErrorMessage(e, 'Error al eliminar la subcategoría.'),
      );
    }
  }

  /// Extrae mensajes de error de FastAPI soportando tanto strings simples (`400`/`404`/`409`)
  /// como listas de errores de validación Pydantic (`422`) sin lanzar excepciones de tipo.
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