// apps/admin-portal/lib/screens/product_form/product_form_screen.dart
// Propósito: Vista declarativa pura del formulario maestro de alta y edición integral de productos.

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/screens/product_form/widgets/basic_info_section.dart';
import 'package:admin_portal/screens/product_form/widgets/gallery_picker_section.dart';
import 'package:admin_portal/screens/product_form/widgets/inventory_stock_section.dart';
import 'package:admin_portal/screens/product_form/widgets/pricing_finance_section.dart';
import 'package:admin_portal/screens/product_form/widgets/showcase_switches_section.dart';
import 'package:admin_portal/screens/product_form/widgets/variants_editor_section.dart';

/// Formulario maestro de alta y modificación integral de un [Product].
///
/// Sigue el patrón `Screen + Handler`: ensambla las 6 secciones atómicas sin
/// mantener estado mutable ni ejecutar peticiones HTTP directamente.
class ProductFormScreen extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final bool isSubmitting;
  final bool isEditing;
  final TextEditingController nameController;
  final TextEditingController barcodeController;
  final TextEditingController descriptionController;
  final TextEditingController salePriceController;
  final TextEditingController costPriceController;
  final TextEditingController stockController;
  final TextEditingController minStockController;
  final int? selectedCategoryId;
  final List<Category> categories;
  final ValueChanged<int?> onCategoryChanged;
  final List<Subcategory> availableSubcategories;
  final List<int> selectedSubcategoryIds;
  final ValueChanged<int> onSubcategoryToggled;
  final VoidCallback? onManageSubcategories;
  final String? Function(Subcategory subcategory)? subcategoryImageBuilder;
  final List<String> imageUrls;
  final VoidCallback? onAddImage;
  final VoidCallback? onPickFromCamera;
  final VoidCallback? onPickFromGallery;
  final ValueChanged<int> onRemoveImage;
  final ValueChanged<int> onSetFeatured;
  final double marginPercentage;
  final bool isVisible;
  final bool isAvailable;
  final bool onlyVariants;
  final bool allowBackorder;
  final ValueChanged<bool> onVisibleChanged;
  final ValueChanged<bool> onAvailableChanged;
  final ValueChanged<bool> onOnlyVariantsChanged;
  final ValueChanged<bool> onAllowBackorderChanged;
  final List<ProductVariant> variants;
  final VoidCallback onAddVariant;
  final ValueChanged<int> onRemoveVariant;
  final VoidCallback onSubmit;

  const ProductFormScreen({
    super.key,
    required this.formKey,
    required this.isSubmitting,
    this.isEditing = false,
    required this.nameController,
    required this.barcodeController,
    required this.descriptionController,
    required this.salePriceController,
    required this.costPriceController,
    required this.stockController,
    required this.minStockController,
    required this.selectedCategoryId,
    required this.categories,
    required this.onCategoryChanged,
    required this.availableSubcategories,
    required this.selectedSubcategoryIds,
    required this.onSubcategoryToggled,
    this.onManageSubcategories,
    this.subcategoryImageBuilder,
    required this.imageUrls,
    this.onAddImage,
    this.onPickFromCamera,
    this.onPickFromGallery,
    required this.onRemoveImage,
    required this.onSetFeatured,
    required this.marginPercentage,
    required this.isVisible,
    required this.isAvailable,
    required this.onlyVariants,
    required this.allowBackorder,
    required this.onVisibleChanged,
    required this.onAvailableChanged,
    required this.onOnlyVariantsChanged,
    required this.onAllowBackorderChanged,
    required this.variants,
    required this.onAddVariant,
    required this.onRemoveVariant,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Editar Producto' : 'Nuevo Producto'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: FilledButton.icon(
              onPressed: isSubmitting ? null : onSubmit,
              icon: isSubmitting
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.check_circle_outline),
              label: Text(isEditing ? 'Guardar' : 'Publicar'),
            ),
          ),
        ],
        bottom: isSubmitting
            ? const PreferredSize(
                preferredSize: Size.fromHeight(3),
                child: LinearProgressIndicator(minHeight: 3),
              )
            : null,
      ),
      body: AbsorbPointer(
        absorbing: isSubmitting,
        child: Form(
          key: formKey,
          child: ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              BasicInfoSection(
                nameController: nameController,
                barcodeController: barcodeController,
                descriptionController: descriptionController,
                selectedCategoryId: selectedCategoryId,
                categories: categories,
                onCategoryChanged: onCategoryChanged,
                availableSubcategories: availableSubcategories,
                selectedSubcategoryIds: selectedSubcategoryIds,
                onSubcategoryToggled: onSubcategoryToggled,
                onManageSubcategories: onManageSubcategories,
                subcategoryImageBuilder: subcategoryImageBuilder,
                onScanBarcode: () {},
              ),
              const SizedBox(height: 16),
              GalleryPickerSection(
                imageUrls: imageUrls,
                onAddImage: onAddImage,
                onPickFromCamera: onPickFromCamera,
                onPickFromGallery: onPickFromGallery,
                onRemoveImage: onRemoveImage,
                onSetFeatured: onSetFeatured,
              ),
              const SizedBox(height: 16),
              PricingFinanceSection(
                salePriceController: salePriceController,
                costPriceController: costPriceController,
                marginPercentage: marginPercentage,
              ),
              const SizedBox(height: 16),
              InventoryStockSection(
                stockController: stockController,
                minStockController: minStockController,
              ),
              const SizedBox(height: 16),
              ShowcaseSwitchesSection(
                isVisible: isVisible,
                isAvailable: isAvailable,
                onlyVariants: onlyVariants,
                allowBackorder: allowBackorder,
                onVisibleChanged: onVisibleChanged,
                onAvailableChanged: onAvailableChanged,
                onOnlyVariantsChanged: onOnlyVariantsChanged,
                onAllowBackorderChanged: onAllowBackorderChanged,
              ),
              const SizedBox(height: 16),
              VariantsEditorSection(
                variants: variants,
                onAddVariant: onAddVariant,
                onRemoveVariant: onRemoveVariant,
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}












