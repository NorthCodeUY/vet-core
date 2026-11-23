// apps/admin-portal/lib/models/product/subcategory_model.dart

/// Discriminador tipado 1:1 con la columna `subc_tipo_icono` en FastAPI.
///
/// Determina de forma explícita qué fuente visual está activa para renderizar
/// la [Subcategory] tanto en el portal administrativo como en el storefront React.
enum SubcategoryIconType {
  /// Iconografía vectorial estándar (`subc_icono`, ej. `'Dog'`, `'Scissors'`).
  icono('ICONO'),

  /// Imagen o SVG personalizado alojado en R2/CDN (`subc_imagen_url`).
  imagen('IMAGEN');

  /// Valor literal esperado y retornado por el backend FastAPI.
  final String apiValue;

  /// Asocia la constante del enum con su representación string en la API.
  const SubcategoryIconType(this.apiValue);

  /// Convierte el valor crudo recibido desde FastAPI a [SubcategoryIconType].
  ///
  /// Aplica fallback seguro a [SubcategoryIconType.icono] para mantener
  /// paridad con el valor por defecto (`"ICONO"`) definido en SQLAlchemy.
  static SubcategoryIconType fromApi(String? raw) {
    return raw?.trim().toUpperCase() == 'IMAGEN'
        ? SubcategoryIconType.imagen
        : SubcategoryIconType.icono;
  }
}

/// Entidad de dominio inmutable para una subcategoría del catálogo.
///
/// Representa la tabla `subcategoria` en FastAPI y soporta iconografía híbrida
/// controlada mediante el discriminador [iconType] (`subc_tipo_icono`):
/// - [iconName] (`subc_icono`): clave vectorial estándar (Lucide/Material).
/// - [imageUrl] (`subc_imagen_url`): URL absoluta a un SVG/PNG en Cloudflare R2.
class Subcategory {
  /// Identificador único de la subcategoría en base de datos (`subc_id`).
  final int id;

  /// Nombre único visible en catálogo, filtros y chips (`subc_nombre`).
  final String name;

  /// Discriminador activo que indica si se renderiza icono estándar o imagen (`subc_tipo_icono`).
  final SubcategoryIconType iconType;

  /// Clave estándar de icono Lucide (ej. `'Scissors'`, `'Dog'`).
  final String? iconName;

  /// URL absoluta de asset SVG o PNG específico en CDN/R2 (`subc_imagen_url`).
  final String? imageUrl;

  /// Crea una instancia inmutable de [Subcategory].
  const Subcategory({
    required this.id,
    required this.name,
    this.iconType = SubcategoryIconType.icono,
    this.iconName,
    this.imageUrl,
  });

  /// Alias de compatibilidad de solo lectura para código legado que acceda a `.icon`.
  String? get icon => iconName;

  /// Indica si existe una URL no vacía configurada en [imageUrl].
  bool get hasCustomImage => imageUrl != null && imageUrl!.trim().isNotEmpty;

  /// Indica si existe una clave no vacía configurada en [iconName].
  bool get hasStandardIcon => iconName != null && iconName!.trim().isNotEmpty;

  /// Indica si la subcategoría debe renderizarse usando [imageUrl] según [iconType].
  bool get isImageActive =>
      iconType == SubcategoryIconType.imagen && hasCustomImage;

  /// Indica si la subcategoría debe renderizarse usando [iconName] según [iconType].
  bool get isIconActive =>
      iconType == SubcategoryIconType.icono && hasStandardIcon;

  /// Deserializa la respuesta JSON de FastAPI hacia [Subcategory].
  ///
  /// Soporta tanto objetos planos (endpoint `/api/subcategorias`) como nodos
  /// anidados dentro de la relación N:M (`rel_subcategoria` en `/api/productos`).
  factory Subcategory.fromJson(Map<String, dynamic> json) {
    final nested = json['rel_subcategoria'] as Map<String, dynamic>? ?? json;

    return Subcategory(
      id: (nested['subc_id'] as num?)?.toInt() ?? 0,
      name: (nested['subc_nombre'] as String?) ?? 'General',
      iconType: SubcategoryIconType.fromApi(nested['subc_tipo_icono'] as String?),
      iconName: nested['subc_icono'] as String?,
      imageUrl: nested['subc_imagen_url'] as String?,
    );
  }

  /// Serializa el payload esperado por `POST /api/subcategorias` y
  /// `PUT /api/subcategorias/{subc_id}`.
  ///
  /// Omite `subc_id` y normaliza cadenas vacías a `null` para evitar errores de
  /// validación `422` en Pydantic.
  Map<String, dynamic> toPayloadJson() {
    final normalizedIcon = iconName?.trim();
    final normalizedImage = imageUrl?.trim();

    return {
      'subc_nombre': name.trim(),
      'subc_tipo_icono': iconType.apiValue,
      'subc_icono': (normalizedIcon != null && normalizedIcon.isNotEmpty)
          ? normalizedIcon
          : null,
      'subc_imagen_url': (normalizedImage != null && normalizedImage.isNotEmpty)
          ? normalizedImage
          : null,
    };
  }

  /// Retorna una copia de la subcategoría con los campos especificados actualizados.
  Subcategory copyWith({
    int? id,
    String? name,
    SubcategoryIconType? iconType,
    String? iconName,
    String? imageUrl,
  }) {
    return Subcategory(
      id: id ?? this.id,
      name: name ?? this.name,
      iconType: iconType ?? this.iconType,
      iconName: iconName ?? this.iconName,
      imageUrl: imageUrl ?? this.imageUrl,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Subcategory &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}