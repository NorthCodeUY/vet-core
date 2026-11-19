//apps/admin-portal/lib/features/catalog/domain/product_model.dart

/// Entidad de producto agnóstica para el catálogo administrativo.
class Product {
  final int id;
  final String title;
  final String category;
  final String sku;
  final String? ean;
  final double salePrice;
  final double costPrice;
  final int stock;
  final int minStock;
  final bool isVisibleInShowcase;
  final bool isBackorder;
  final String imageUrl;
  final List<String> variants;

  const Product({
    required this.id,
    required this.title,
    required this.category,
    required this.sku,
    this.ean,
    required this.salePrice,
    required this.costPrice,
    required this.stock,
    this.minStock = 5,
    required this.isVisibleInShowcase,
    this.isBackorder = false,
    required this.imageUrl,
    this.variants = const [],
  });

  bool get isCriticalStock => stock <= minStock && !isBackorder;

  Product copyWith({
    bool? isVisibleInShowcase,
    int? stock,
  }) {
    return Product(
      id: id,
      title: title,
      category: category,
      sku: sku,
      ean: ean,
      salePrice: salePrice,
      costPrice: costPrice,
      stock: stock ?? this.stock,
      minStock: minStock,
      isVisibleInShowcase: isVisibleInShowcase ?? this.isVisibleInShowcase,
      isBackorder: isBackorder,
      imageUrl: imageUrl,
      variants: variants,
    );
  }
}