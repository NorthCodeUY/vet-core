// widgets/product_form/basic_info_section.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'form_section_card.dart';
import 'subcategories_selector.dart';

/// Sección de datos troncales del formulario de alta y edición de producto.
///
/// Agrupa identidad comercial, categorización primaria (`cat_id`), asociación
/// dinámica de subcategorías provenientes del backend, código EAN y
/// descripción técnica. Opera como widget puramente presentacional delegando
/// mutaciones y estado de negocio al handler padre.
class BasicInfoSection extends StatelessWidget {
  /// Controlador del nombre comercial del producto.
  final TextEditingController nameController;

  /// Controlador del código de barras / EAN principal.
  final TextEditingController barcodeController;

  /// Controlador de la descripción técnica o indicaciones de uso.
  final TextEditingController descriptionController;

  /// Identificador de la categoría primaria seleccionada (`cat_id`).
  final int? selectedCategoryId;

  /// Catálogo de categorías disponibles obtenidas desde el backend.
  final List<Category> categories;

  /// Callback disparado al seleccionar o cambiar la categoría primaria.
  final ValueChanged<int?> onCategoryChanged;

  ///  Catálogo completo de subcategorías activas retornadas por el backend.
  final List<Subcategory> availableSubcategories;

  ///  Lista de IDs de subcategorías actualmente asignadas al producto.
  final List<int> selectedSubcategoryIds;

  ///  Callback invocado al asignar o remover una subcategoría por su ID.
  final ValueChanged<int> onSubcategoryToggled;

  ///  Acción opcional para abrir el modal/flujo de creación o gestión de subcategorías.
  final VoidCallback? onManageSubcategories;

  ///  Extractor opcional de URL de imagen por subcategoría (permite
  /// desacoplar la UI del nombre exacto del campo multimedia en el modelo).
  final String? Function(Subcategory subcategory)? subcategoryImageBuilder;

  /// Callback para invocar el lector de código de barras por cámara.
  final VoidCallback onScanBarcode;

  /// Crea la sección de información básica del formulario de producto.
  const BasicInfoSection({
    super.key,
    required this.nameController,
    required this.barcodeController,
    required this.descriptionController,
    required this.selectedCategoryId,
    required this.categories,
    required this.onCategoryChanged,
    required this.availableSubcategories,
    required this.selectedSubcategoryIds,
    required this.onSubcategoryToggled,
    this.onManageSubcategories,
    this.subcategoryImageBuilder,
    required this.onScanBarcode,
  });

  @override
  Widget build(BuildContext context) {
    // Resuelve tokens semánticos desde el tema activo del tenant (Zero Hardcoding).
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.info_outline,
      title: 'Información Básica',
      // Badge semántico que alerta obligatoriedad de los campos primarios del schema.
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: colorScheme.errorContainer,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          '* Requerido',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.error,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Nombre comercial: campo obligatorio validado antes del envío al endpoint.
          TextFormField(
            controller: nameController,
            decoration: const InputDecoration(
              labelText: 'Nombre del Producto *',
              hintText: 'Ej: Producto de catálogo 7.5kg',
              border: OutlineInputBorder(),
            ),
            validator: (v) =>
                v == null || v.trim().isEmpty ? 'El nombre es obligatorio' : null,
          ),
          const SizedBox(height: 14),

          // 2. Selector de categoría principal: mapea directamente contra `cat_id` en FastAPI.
          DropdownButtonFormField<int>(
            initialValue: selectedCategoryId,
            decoration: const InputDecoration(
              labelText: 'Categoría Principal (cat_id) *',
              border: OutlineInputBorder(),
            ),
            items: categories
                .map((c) => DropdownMenuItem<int>(
                      value: c.id,
                      child: Text(c.name),
                    ))
                .toList(),
            onChanged: onCategoryChanged,
            validator: (v) => v == null ? 'Selecciona una categoría' : null,
          ),
          const SizedBox(height: 14),

          //  3. Componente desacoplado de subcategorías dinámicas (backend + imagen + filtro).
          SubcategoriesSelector(
            availableSubcategories: availableSubcategories,
            selectedSubcategoryIds: selectedSubcategoryIds,
            onSubcategoryToggled: onSubcategoryToggled,
            onManagePressed: onManageSubcategories,
            imageUrlBuilder: subcategoryImageBuilder,
          ),
          const SizedBox(height: 14),

          // 4. Código de barras / EAN: combina entrada manual con disparador de escáner nativo.
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: barcodeController,
                  decoration: const InputDecoration(
                    labelText: 'Código EAN / Barra Principal',
                    prefixIcon: Icon(Icons.qr_code),
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                tooltip: 'Escanear con cámara',
                icon: const Icon(Icons.qr_code_scanner),
                onPressed: onScanBarcode,
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 5. Descripción técnica: bloque multilínea para especificaciones o dosificación.
          TextFormField(
            controller: descriptionController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Descripción y Especificaciones Técnicas',
              hintText: 'Composición, indicaciones técnicas o detalles de uso...',
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
    );
  }
}