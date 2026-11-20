// apps/admin-portal/lib/models/product/color_model.dart

class ProductColor {
  final int id;
  final String name;
  final String hex;

  const ProductColor({
    required this.id,
    required this.name,
    required this.hex,
  });

  factory ProductColor.fromJson(Map<String, dynamic> json) => ProductColor(
        id: json['col_id'] as int? ?? 0,
        name: json['col_nombre'] as String? ?? '',
        hex: json['col_hex'] as String? ?? '#000000',
      );
}