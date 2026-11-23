// apps/admin-portal/lib/models/product/product_model.dart

import 'category_model.dart';
import 'product_image_model.dart';
import 'product_variant_model.dart';
import 'subcategory_model.dart';

/// Entidad Maestra de Producto en el Catálogo.
///
/// Mapea la tabla `producto` del backend FastAPI (`producto_model.py`).
/// Centraliza la información comercial, relaciones multimedia, categorización
/// y reglas operativas de inventario y vitrina.
class Product {
  /// Identificador único del producto (`prod_id`).
  final int id;

  /// Nombre comercial descriptivo (`prod_nombre`).
  final String name;

  /// Descripción detallada o ficha técnica (`prod_descripcion`).
  final String? description;

  /// Código de barras principal EAN/UPC (`prod_codigo_barra`).
  final String? barcode;

  /// Precio base de venta al público (`prod_precio_venta`).
  final double salePrice;

  /// Costo de adquisición ante proveedor (`prod_precio_costo`).
  final double? costPrice;

  /// Existencias físicas directas si el ítem no usa variantes (`prod_stock`).
  final int stock;

  /// Umbral para disparo de alertas de inventario crítico (`prod_stock_minimo`).
  final int? minStock;

  /// Si es `true`, exige al comprador seleccionar una variante (`prod_solo_variantes`).
  final bool onlyVariants;

  /// Control de baja lógica (`prod_activo`).
  final bool isActive;

  /// Interruptor general de disponibilidad (`prod_disponible`).
  final bool isAvailable;

  /// Visibilidad pública en la vitrina del e-commerce (`prod_visible`).
  final bool isVisibleInShowcase;

  /// Habilita venta sin stock físico / backorders (`prod_per_sin_stock`).
  final bool allowBackorder;

  /// ID foráneo de la categoría primaria (`cat_id`).
  final int categoryId;

  /// Relación Many-to-One con la categoría primaria.
  final Category? category;

  /// Galería de imágenes asociadas (Relación One-to-Many). Puede venir vacía.
  final List<ProductImage> images;

  /// Listado de variantes o presentaciones vendibles (Relación One-to-Many).
  final List<ProductVariant> variants;

  /// Relación Many-to-Many con subcategorías.
  final List<Subcategory> subcategories;

  /// Crea una instancia inmutable de [Product].
  const Product({
    required this.id,
    required this.name,
    this.description,
    this.barcode,
    required this.salePrice,
    this.costPrice,
    required this.stock,
    this.minStock,
    this.onlyVariants = false,
    this.isActive = true,
    this.isAvailable = true,
    this.isVisibleInShowcase = true,
    this.allowBackorder = false,
    required this.categoryId,
    this.category,
    this.images = const [],
    this.variants = const [],
    this.subcategories = const [],
  });

  /// Indica si el producto cuenta con al menos una imagen con URL válida.
  bool get hasImages => images.any((img) => img.url.trim().isNotEmpty);

  /// Resuelve la URL de la imagen destacada o la primera URL válida disponible.
  ///
  /// Retorna `null` de forma segura cuando el producto no tiene fotos en BD.
  String? get primaryImageUrl {
    final validImages = images.where((img) => img.url.trim().isNotEmpty);
    if (validImages.isEmpty) return null;

    for (final img in validImages) {
      if (img.isFeatured) return img.url.trim();
    }
    return validImages.first.url.trim();
  }

  /// Evalúa si el producto se encuentra en condición crítica de inventario.
  bool get isCriticalStock {
    if (allowBackorder) return false;
    final limit = minStock ?? 5;
    return totalStock <= limit;
  }

  /// Calcula el stock total consolidando las existencias de variantes si aplica.
  int get totalStock {
    if (onlyVariants && variants.isNotEmpty) {
      return variants.fold(0, (acc, variant) => acc + variant.stock);
    }
    return stock;
  }

  /// Retorna una copia con los campos especificados modificados preservando inmutabilidad.
  Product copyWith({
    int? id,
    String? name,
    String? description,
    String? barcode,
    double? salePrice,
    double? costPrice,
    int? stock,
    int? minStock,
    bool? onlyVariants,
    bool? isActive,
    bool? isAvailable,
    bool? isVisibleInShowcase,
    bool? allowBackorder,
    int? categoryId,
    Category? category,
    List<ProductImage>? images,
    List<ProductVariant>? variants,
    List<Subcategory>? subcategories,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      barcode: barcode ?? this.barcode,
      salePrice: salePrice ?? this.salePrice,
      costPrice: costPrice ?? this.costPrice,
      stock: stock ?? this.stock,
      minStock: minStock ?? this.minStock,
      onlyVariants: onlyVariants ?? this.onlyVariants,
      isActive: isActive ?? this.isActive,
      isAvailable: isAvailable ?? this.isAvailable,
      isVisibleInShowcase: isVisibleInShowcase ?? this.isVisibleInShowcase,
      allowBackorder: allowBackorder ?? this.allowBackorder,
      categoryId: categoryId ?? this.categoryId,
      category: category ?? this.category,
      images: images ?? this.images,
      variants: variants ?? this.variants,
      subcategories: subcategories ?? this.subcategories,
    );
  }

  /// Deserializa el payload relacional emitido por FastAPI con tolerancia a
  /// colecciones vacías, nulos parciales y valores numéricos genéricos.
  factory Product.fromJson(Map<String, dynamic> json) {
    final rawCategory = json['rel_categoria'];
    final rawImages = json['rel_imagenes'] as List<dynamic>?;
    final rawVariants = json['rel_variantes'] as List<dynamic>?;
    final rawSubcategories = json['rel_subcategoria'] as List<dynamic>?;

    return Product(
      id: (json['prod_id'] as num?)?.toInt() ?? 0,
      name: json['prod_nombre'] as String? ?? 'Sin nombre',
      description: json['prod_descripcion'] as String?,
      barcode: json['prod_codigo_barra'] as String?,
      salePrice: (json['prod_precio_venta'] as num?)?.toDouble() ?? 0.0,
      costPrice: (json['prod_precio_costo'] as num?)?.toDouble(),
      stock: (json['prod_stock'] as num?)?.toInt() ?? 0,
      minStock: (json['prod_stock_minimo'] as num?)?.toInt(),
      onlyVariants: json['prod_solo_variantes'] as bool? ?? false,
      isActive: json['prod_activo'] as bool? ?? true,
      isAvailable: json['prod_disponible'] as bool? ?? true,
      isVisibleInShowcase: json['prod_visible'] as bool? ?? true,
      allowBackorder: json['prod_per_sin_stock'] as bool? ?? false,
      categoryId: (json['cat_id'] as num?)?.toInt() ?? 1,
      category: rawCategory is Map<String, dynamic>
          ? Category.fromJson(rawCategory)
          : null,
      // Filtra elementos nulos o URLs vacías para evitar errores en Image.network.
      images: rawImages
              ?.whereType<Map<String, dynamic>>()
              .map(ProductImage.fromJson)
              .where((img) => img.url.isNotEmpty)
              .toList() ??
          const [],
      variants: rawVariants
              ?.whereType<Map<String, dynamic>>()
              .map(ProductVariant.fromJson)
              .toList() ??
          const [],
      subcategories: rawSubcategories
              ?.whereType<Map<String, dynamic>>()
              .map(Subcategory.fromJson)
              .toList() ??
          const [],
    );
  }

  /// Serializa los atributos escalares base a JSON para peticiones HTTP.
  Map<String, dynamic> toJson() => {
        'prod_id': id,
        'prod_nombre': name,
        'prod_descripcion': description,
        'prod_codigo_barra': barcode,
        'prod_precio_venta': salePrice,
        'prod_precio_costo': costPrice,
        'prod_stock': stock,
        'prod_stock_minimo': minStock,
        'prod_solo_variantes': onlyVariants,
        'prod_activo': isActive,
        'prod_disponible': isAvailable,
        'prod_visible': isVisibleInShowcase,
        'prod_per_sin_stock': allowBackorder,
        'cat_id': categoryId,
      };
}