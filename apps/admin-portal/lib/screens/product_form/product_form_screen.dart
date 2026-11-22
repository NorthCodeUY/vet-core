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
  // --- Estado y Dependencias ---

  /// Clave global para disparar validaciones del [Form] antes de guardar.
  final GlobalKey<FormState> formKey;

  /// Bloquea múltiples envíos mientras se ejecuta la petición HTTP en el handler.
  final bool isSubmitting;

  /// Define si el formulario opera en modo modificación (`true`) o alta (`false`).
  final bool isEditing;

  /// Controlador del nombre comercial del producto.
  final TextEditingController nameController;

  /// Controlador del código de barras EAN/UPC principal.
  final TextEditingController barcodeController;

  /// Controlador de la descripción técnica o comercial.
  final TextEditingController descriptionController;

  /// Controlador del Precio de Venta al Público (PVP).
  final TextEditingController salePriceController;

  /// Controlador del precio de costo ante proveedor.
  final TextEditingController costPriceController;

  /// Controlador de existencias físicas base.
  final TextEditingController stockController;

  /// Controlador del umbral de stock crítico.
  final TextEditingController minStockController;

  /// ID de la categoría principal seleccionada.
  final int? selectedCategoryId;

  /// Listado de categorías disponibles para el selector.
  final List<Category> categories;

  /// Callback al cambiar la categoría principal.
  final ValueChanged<int?> onCategoryChanged;

  /// <!> Listado completo de subcategorías disponibles obtenidas desde la API.
  final List<Subcategory> availableSubcategories;

  /// <!> Identificadores de las subcategorías actualmente asignadas al producto.
  final List<int> selectedSubcategoryIds;

  /// <!> Callback al asignar o remover una subcategoría mediante su ID.
  final ValueChanged<int> onSubcategoryToggled;

  /// <!> Acción opcional para abrir el flujo o modal de gestión de subcategorías.
  final VoidCallback? onManageSubcategories;

  /// <!> Extractor opcional de URL multimedia para mostrar miniaturas de cada subcategoría.
  final String? Function(Subcategory subcategory)? subcategoryImageBuilder;

  /// URLs remotas o Data URIs locales de la galería multimedia.
  final List<String> imageUrls;

  /// Callback legado de respaldo para agregar imagen.
  final VoidCallback? onAddImage;

  /// Callback para capturar foto directa con cámara.
  final VoidCallback? onPickFromCamera;

  /// Callback para elegir imagen desde galería o archivos.
  final VoidCallback? onPickFromGallery;

  /// Callback al eliminar una imagen por índice.
  final ValueChanged<int> onRemoveImage;

  /// Callback al fijar una miniatura como portada principal por índice.
  final ValueChanged<int> onSetFeatured;

  /// Margen comercial porcentual calculado reactivamente por el handler.
  final double marginPercentage;

  /// Visibilidad pública del producto en vitrina web.
  final bool isVisible;

  /// Disponibilidad comercial inmediata.
  final bool isAvailable;

  /// Exige selección de variante al comprar.
  final bool onlyVariants;

  /// Permite vender sin existencias físicas.
  final bool allowBackorder;

  /// Callback al cambiar visibilidad en vitrina.
  final ValueChanged<bool> onVisibleChanged;

  /// Callback al cambiar disponibilidad operativa.
  final ValueChanged<bool> onAvailableChanged;

  /// Callback al alternar obligatoriedad de variantes.
  final ValueChanged<bool> onOnlyVariantsChanged;

  /// Callback al alternar venta sin stock.
  final ValueChanged<bool> onAllowBackorderChanged;

  /// Lista actual de variantes físicas (SKUs) del producto.
  final List<ProductVariant> variants;

  /// Callback para añadir una nueva variante al listado.
  final VoidCallback onAddVariant;

  /// Callback para eliminar una variante por índice.
  final ValueChanged<int> onRemoveVariant;

  /// Callback maestro al confirmar guardado o publicación.
  final VoidCallback onSubmit;

  // --- Ciclo de Vida / Inicialización ---

  /// Construye la vista [ProductFormScreen] con los controladores y callbacks del handler.
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

  // --- Construcción de Interfaz ---

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Editar Producto' : 'Nuevo Producto'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: FilledButton.icon(
              // Deshabilita el botón durante el envío para prevenir doble submit.
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
            // <!> Sección 1: Información básica conectada al catálogo de subcategorías del backend.
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

            // Sección 2: Galería multimedia y selección de portada principal.
            GalleryPickerSection(
              imageUrls: imageUrls,
              onAddImage: onAddImage,
              onPickFromCamera: onPickFromCamera,
              onPickFromGallery: onPickFromGallery,
              onRemoveImage: onRemoveImage,
              onSetFeatured: onSetFeatured,
            ),
            const SizedBox(height: 16),

            // Sección 3: Estructura financiera de PVP, costo y margen calculado.
            PricingFinanceSection(
              salePriceController: salePriceController,
              costPriceController: costPriceController,
              marginPercentage: marginPercentage,
            ),
            const SizedBox(height: 16),

            // Sección 4: Control de stock físico y punto de reposición.
            InventoryStockSection(
              stockController: stockController,
              minStockController: minStockController,
            ),
            const SizedBox(height: 16),

            // Sección 5: Reglas operativas de visibilidad y disponibilidad en vitrina.
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

            // Sección 6: Editor dinámico de variantes/presentaciones (SKUs).
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