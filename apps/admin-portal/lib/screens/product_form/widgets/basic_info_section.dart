// lib/widgets/product_form/basic_info_section.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'form_section_card.dart';

class BasicInfoSection extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController barcodeController;
  final TextEditingController descriptionController;
  final int? selectedCategoryId;
  final List<Category> categories;
  final ValueChanged<int?> onCategoryChanged;
  final List<String> availableTags;
  final List<String> selectedTags;
  final ValueChanged<String> onTagToggled;
  final VoidCallback onScanBarcode;

  const BasicInfoSection({
    super.key,
    required this.nameController,
    required this.barcodeController,
    required this.descriptionController,
    required this.selectedCategoryId,
    required this.categories,
    required this.onCategoryChanged,
    required this.availableTags,
    required this.selectedTags,
    required this.onTagToggled,
    required this.onScanBarcode,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return FormSectionCard(
      icon: Icons.info_outline,
      title: 'Información Básica',
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
          // 1. Nombre comercial
          TextFormField(
            controller: nameController,
            decoration: const InputDecoration(
              labelText: 'Nombre del Producto *',
              hintText: 'Ej: Alimento Balanceado Royal Vet Renal Canino 7.5kg',
              border: OutlineInputBorder(),
            ),
            validator: (v) =>
                v == null || v.trim().isEmpty ? 'El nombre es obligatorio' : null,
          ),
          const SizedBox(height: 14),

          // 2. Selector de Categoría (cat_id)
          DropdownButtonFormField<int>(
            initialValue: selectedCategoryId,
            decoration: const InputDecoration(
              labelText: 'Categoría Principal (cat_id) *',
              border: OutlineInputBorder(),
            ),
            items: categories
                .map((c) => DropdownMenuItem(value: c.id, child: Text(c.name)))
                .toList(),
            onChanged: onCategoryChanged,
            validator: (v) => v == null ? 'Selecciona una categoría' : null,
          ),
          const SizedBox(height: 14),

          // 3. Chips de Subcategorías y Etiquetas
          Text(
            'Etiquetas y Subcategorías',
            style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: availableTags.map((tag) {
              final isSelected = selectedTags.contains(tag);
              return FilterChip(
                label: Text(tag),
                selected: isSelected,
                onSelected: (_) => onTagToggled(tag),
                selectedColor: colorScheme.primary,
                labelStyle: TextStyle(
                  color: isSelected ? colorScheme.onPrimary : colorScheme.onSurface,
                  fontSize: 12,
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 14),

          // 4. Código de Barras / EAN con botón de escáner
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

          // 5. Descripción técnica
          TextFormField(
            controller: descriptionController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Descripción y Dosificación Técnica',
              hintText: 'Composición, indicaciones veterinarias...',
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
    );
  }
}