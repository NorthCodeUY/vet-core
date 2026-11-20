// apps/admin-portal/lib/models/product/category_model.dart

/// Entidad que representa la categoría primaria de un producto.
///
/// Mapea la tabla `categoria` del backend FastAPI (`categoria_model.py`).
/// Se utiliza para el filtrado taxonómico y agrupación en catálogo.
class Category {
  /// Identificador único autoincremental (`cat_id`).
  final int id;
  /// Nombre visible de la categoría (`cat_nombre`).
  final String name;

  const Category({
    required this.id,
    required this.name,
  });

  /// Deserializa la respuesta JSON devuelta por SQLAlchemy/Pydantic.
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['cat_id'] as int,
      name: json['cat_nombre'] as String? ?? 'General',
    );
  }

  /// Serializa la entidad a formato JSON para inserción o actualización.
  Map<String, dynamic> toJson() => {
        'cat_id': id,
        'cat_nombre': name,
      };
}