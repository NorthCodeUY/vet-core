// apps/admin-portal/lib/screens/product_form_screen.dart

// lib/screens/product_form_screen.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/screens/product_form/widgets/basic_info_section.dart';
import 'package:admin_portal/screens/product_form/widgets/gallery_picker_section.dart';
import 'package:admin_portal/screens/product_form/widgets/inventory_stock_section.dart';
import 'package:admin_portal/screens/product_form/widgets/pricing_finance_section.dart';
import 'package:admin_portal/screens/product_form/widgets/showcase_switches_section.dart';
import 'package:admin_portal/screens/product_form/widgets/variants_editor_section.dart';




class ProductFormScreen extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final bool isSubmitting;
  final bool isEditing;

  // Controllers
  final TextEditingController nameController;
  final TextEditingController barcodeController;
  final TextEditingController descriptionController;
  final TextEditingController salePriceController;
  final TextEditingController costPriceController;
  final TextEditingController stockController;
  final TextEditingController minStockController;

  // Taxonomía
  final int? selectedCategoryId;
  final List<Category> categories;
  final ValueChanged<int?> onCategoryChanged;
  final List<String> availableTags;
  final List<String> selectedTags;
  final ValueChanged<String> onTagToggled;

  // Galería
  final List<String> imageUrls;
  final VoidCallback onAddImage;
  final ValueChanged<int> onRemoveImage;
  final ValueChanged<int> onSetFeatured;

  // Finanzas
  final double marginPercentage;

  // Switches
  final bool isVisible;
  final bool isAvailable;
  final bool onlyVariants;
  final bool allowBackorder;
  final ValueChanged<bool> onVisibleChanged;
  final ValueChanged<bool> onAvailableChanged;
  final ValueChanged<bool> onOnlyVariantsChanged;
  final ValueChanged<bool> onAllowBackorderChanged;

  // Variantes
  final List<ProductVariant> variants;
  final VoidCallback onAddVariant;
  final ValueChanged<int> onRemoveVariant;

  // Acciones
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
    required this.availableTags,
    required this.selectedTags,
    required this.onTagToggled,
    required this.imageUrls,
    required this.onAddImage,
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
      ),
      body: Form(
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
              availableTags: availableTags,
              selectedTags: selectedTags,
              onTagToggled: onTagToggled,
              onScanBarcode: () {},
            ),
            const SizedBox(height: 16),
            GalleryPickerSection(
              imageUrls: imageUrls,
              onAddImage: onAddImage,
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
    );
  }
}