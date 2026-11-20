// apps/admin-portal/lib/models/product/subcategory_model.dart

class Subcategory {
  final int id;
  final String name;
  final String? icon;
  final String? imageUrl;

  const Subcategory({
    required this.id,
    required this.name,
    this.icon,
    this.imageUrl,
  });

  factory Subcategory.fromJson(Map<String, dynamic> json) {
    // Parsea tanto el nodo intermedio como el directo
    final nested = json['rel_subcategoria'] as Map<String, dynamic>? ?? json;
    return Subcategory(
      id: nested['subc_id'] as int? ?? 0,
      name: nested['subc_nombre'] as String? ?? 'General',
      icon: nested['subc_icono'] as String?,
      imageUrl: nested['subc_imagen_url'] as String?,
    );
  }
}