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

  /// Si es true, exige al comprador seleccionar una variante (`prod_solo_variantes`).
  final bool onlyVariants;

  /// Control de baja lógica (`prod_activo`).
  final bool isActive;

  /// Interruptor general de disponibilidad (`prod_disponible`).
  final bool isAvailable;

  /// Visibilidad pública en la vitrina del e-commerce (`prod_visible`).
  final bool isVisibleInShowcase;

  /// Habilita venta sin stock físico (Backorders) (`prod_per_sin_stock`).
  final bool allowBackorder;

  /// ID foráneo de la categoría primaria (`cat_id`).
  final int categoryId;

  /// Relación Many-to-One con la categoría.
  final Category? category;

  /// Galería de imágenes asociadas (Relación One-to-Many).
  final List<ProductImage> images;

  /// Listado de variantes o presentaciones vendibles (Relación One-to-Many).
  final List<ProductVariant> variants;

  /// Relación Many-to-Many con subcategorías.
  final List<Subcategory> subcategories;


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

  /// Resuelve la URL de la imagen destacada o la primera disponible.
  String? get primaryImageUrl {
    if (images.isEmpty) return null;
    final featured = images.firstWhere(
      (img) => img.isFeatured,
      orElse: () => images.first,
    );
    return featured.url.isNotEmpty ? featured.url : null;
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

  /// Retorna una copia con campos modificados preservando la inmutabilidad.
  Product copyWith({
    bool? isVisibleInShowcase,
    int? stock,
    double? salePrice,
    double? costPrice,
  }) {
    return Product(
      id: id,
      name: name,
      description: description,
      barcode: barcode,
      salePrice: salePrice ?? this.salePrice,
      costPrice: costPrice ?? this.costPrice,
      stock: stock ?? this.stock,
      minStock: minStock,
      onlyVariants: onlyVariants,
      isActive: isActive,
      isAvailable: isAvailable,
      isVisibleInShowcase: isVisibleInShowcase ?? this.isVisibleInShowcase,
      allowBackorder: allowBackorder,
      categoryId: categoryId,
      category: category,
      images: images,
      variants: variants,
      subcategories: subcategories,
    );
  }

  /// Deserializa el payload relacional emitido por FastAPI.
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['prod_id'] as int,
      name: json['prod_nombre'] as String? ?? 'Sin nombre',
      description: json['prod_descripcion'] as String?,
      barcode: json['prod_codigo_barra'] as String?,
      salePrice: (json['prod_precio_venta'] as num?)?.toDouble() ?? 0.0,
      costPrice: (json['prod_precio_costo'] as num?)?.toDouble(),
      stock: json['prod_stock'] as int? ?? 0,
      minStock: json['prod_stock_minimo'] as int?,
      onlyVariants: json['prod_solo_variantes'] as bool? ?? false,
      isActive: json['prod_activo'] as bool? ?? true,
      isAvailable: json['prod_disponible'] as bool? ?? true,
      isVisibleInShowcase: json['prod_visible'] as bool? ?? true,
      allowBackorder: json['prod_per_sin_stock'] as bool? ?? false,
      categoryId: json['cat_id'] as int? ?? 1,
      category: json['rel_categoria'] != null
          ? Category.fromJson(json['rel_categoria'] as Map<String, dynamic>)
          : null,
      images: (json['rel_imagenes'] as List<dynamic>?)
              ?.map((item) => ProductImage.fromJson(item as Map<String, dynamic>))
              .toList() ??
          const [],
      variants: (json['rel_variantes'] as List<dynamic>?)
              ?.map((item) => ProductVariant.fromJson(item as Map<String, dynamic>))
              .toList() ??
          const [],
      subcategories: (json['rel_subcategoria'] as List<dynamic>?)
        ?.map((item) => Subcategory.fromJson(item as Map<String, dynamic>))
        .toList() ??
          const [],
    );
  }

  /// Serializa la entidad base a JSON para peticiones HTTP POST/PUT.
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