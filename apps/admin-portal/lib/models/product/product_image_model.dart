// apps/admin-portal/lib/models/product/product_image_model.dart

/// Entidad para la gestión de recursos multimedia asociados a un producto.
///
/// Mapea la tabla `imagen_url` del backend FastAPI (`imagen_url_model.py`).
/// Soporta tanto rutas estáticas locales (`/static/...`) como URLs absolutas (Cloudflare R2 / AWS S3).
class ProductImage {
  /// Identificador único del registro (`img_id`).
  final int id;

  /// URL absoluta o ruta relativa hacia el recurso gráfico (`img_url`).
  final String url;

  /// Indica si es la imagen principal de portada para la tarjeta (`img_principal`).
  final bool isFeatured;

  /// Clasificador del activo ('producto', 'banner', 'usuario') (`img_tipo`).
  final String type;

  const ProductImage({
    required this.id,
    required this.url,
    this.isFeatured = false,
    this.type = 'producto',
  });

  /// Deserializa el JSON proveniente de FastAPI.
 
  // <!> Mejora esto los cometarios  
  factory ProductImage.fromJson(Map<String, dynamic> json) {
    return ProductImage(
      id: json['img_id'] as int? ?? 0,
      url: json['img_url'] as String? ?? '',
      isFeatured: json['img_principal'] as bool? ?? false,
      type: json['img_tipo'] as String? ?? 'producto',
    );
  }

  /// Serializa los metadatos para persistencia.
  Map<String, dynamic> toJson() => {
        'img_id': id,
        'img_url': url,
        'img_principal': isFeatured,
        'img_tipo': type,
      };
}