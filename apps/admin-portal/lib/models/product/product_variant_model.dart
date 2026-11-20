// apps/admin-portal/lib/models/product/product_variant_model.dart

import 'color_model.dart';


/// Unidad mínima de inventario físico (SKU) con existencias y precios propios.
///
/// Mapea la tabla `producto_variante` del backend FastAPI (`producto_variante_model.py`).
/// Permite discriminar por tamaño, volumen, peso o talle con reglas financieras independientes.
class ProductVariant {

  /// Relación Many-to-One con la entidad de color (opcional).
  final ProductColor? color;

  /// Identificador único de la variante (`var_id`).
  final int id;

  /// ID del producto padre al que pertenece (`prod_id`).
  final int productId;

  /// Tipo de atributo: 'Talle', 'Volumen', 'Peso', 'Medida' (`var_tipo`).
  final String type;

  /// Etiqueta visible al público: '3kg', 'XL', '250ml' (`var_nombre`).
  final String name;

  /// Código interno de almacén (`val_sku`).
  final String? sku;

  /// Código de barras óptico individual (`var_codigo_barra`).
  final String? barcode;

  /// Precio de venta al público en moneda local (`var_precio_venta`).
  final double salePrice;

  /// Precio de costo/adquisición confidencial (`var_precio_costo`).
  final double? costPrice;

  /// Cantidad física disponible en depósito (`var_stock`).
  final int stock;

  /// Umbral mínimo para disparo de alerta de reposición (`var_stock_minimo`).
  final int? minStock;

  /// Estado de baja lógica (`var_activo`).
  final bool isActive;

  /// Interruptor de visibilidad en vitrina digital (`var_visible`).
  final bool isVisibleInShowcase;

  /// Disponibilidad comercial inmediata (`var_disponible`).
  final bool isAvailable;

  /// Permite venta por encargo con stock físico en cero (`var_permitir_sin_stock`).
  final bool allowBackorder;

  const ProductVariant({
    required this.id,
    required this.productId,
    required this.type,
    required this.name,
    this.color,
    this.sku,
    this.barcode,
    required this.salePrice,
    this.costPrice,
    required this.stock,
    this.minStock,
    this.isActive = true,
    this.isVisibleInShowcase = true,
    this.isAvailable = true,
    this.allowBackorder = false,
  });

  /// Determina si la presentación se encuentra por debajo del nivel de reposición.
  bool get isCriticalStock =>
      minStock != null && stock <= minStock! && !allowBackorder;

  /// Deserializa la respuesta estructurada desde FastAPI.
  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['var_id'] as int,
      productId: json['prod_id'] as int? ?? 0,
      type: json['var_tipo'] as String? ?? 'Presentación',
      name: json['var_nombre'] as String? ?? '',
      sku: json['val_sku'] as String?,
      barcode: json['var_codigo_barra'] as String?,
      salePrice: (json['var_precio_venta'] as num?)?.toDouble() ?? 0.0,
      costPrice: (json['var_precio_costo'] as num?)?.toDouble(),
      stock: json['var_stock'] as int? ?? 0,
      minStock: json['var_stock_minimo'] as int?,
      isActive: json['var_activo'] as bool? ?? true,
      isVisibleInShowcase: json['var_visible'] as bool? ?? true,
      isAvailable: json['var_disponible'] as bool? ?? true,
      allowBackorder: json['var_permitir_sin_stock'] as bool? ?? false,
      // Dentro de ProductVariant.fromJson:
      color: json['rel_color'] != null
        ? ProductColor.fromJson(json['rel_color'] as Map<String, dynamic>)
        : null,
      );
  }

  /// Serializa la variante para operaciones de creación o actualización.
  //<!> Esto no lo tengo calro mejroa los comentarios no se como se ase aca yo en react tenia @ y mejroes cometarios y ponele cometarios a ladoa >
  Map<String, dynamic> toJson() => {
        'var_id': id,
        'prod_id': productId,
        'var_tipo': type,
        'var_nombre': name,
        'val_sku': sku,
        'var_codigo_barra': barcode,
        'var_precio_venta': salePrice,
        'var_precio_costo': costPrice,
        'var_stock': stock,
        'var_stock_minimo': minStock,
        'var_activo': isActive,
        'var_visible': isVisibleInShowcase,
        'var_disponible': isAvailable,
        'var_permitir_sin_stock': allowBackorder,
      };
}