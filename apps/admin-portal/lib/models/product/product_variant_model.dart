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

  /// Serializa esta instancia de [ProductVariant] a un `Map<String, dynamic>`
  /// compatible con los esquemas Pydantic (`POST` / `PUT`) de FastAPI.
  ///
  /// Incluye los campos planos de inventario y precios; excluye [color]
  /// (relación de solo lectura) y respeta el nombre heredado `val_sku` en BD.
  ///
  /// Retorna el mapa listo para ser codificado por [Dio] como JSON.
  
  Map<String, dynamic> toJson() => {
        'var_id': id, // PK autogenerada en tabla producto_variante
        'prod_id': productId, // FK hacia producto padre
        'var_tipo': type, // Eje de variación ('Presentación', 'Talle', 'Peso')
        'var_nombre': name, // Etiqueta visible en chips ('500ml', 'XL')
        'val_sku': sku, // Nota BD: en FastAPI la columna conserva el prefijo 'val_sku' (no 'var_sku')
        'var_codigo_barra': barcode, // Código EAN/UPC específico de esta presentación
        'var_precio_venta': salePrice, // PVP vigente; prevalece sobre el precio base del producto
        'var_precio_costo': costPrice, // Costo confidencial para cálculo de margen en portal admin
        'var_stock': stock, // Existencias físicas de este SKU
        'var_stock_minimo': minStock, // Umbral de alerta crítica independiente por variante
        'var_activo': isActive, // Control de baja lógica (soft delete)
        'var_visible': isVisibleInShowcase, // Visibilidad individual en vitrina pública
        'var_disponible': isAvailable, // Habilita o pausa compra de esta presentación
        'var_permitir_sin_stock': allowBackorder, // Permite venta con stock <= 0
      };
}