// apps/admin-portal/lib/screens/product_form/product_form_handler.dart
// Propósito: Orquestar estado del formulario de producto, selector cámara/archivos y guardado PUT integral.

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'product_form_screen.dart';

/// Controlador de estado para el alta y modificación integral de un [Product].
///
/// Precarga los campos cuando recibe [productToEdit], gestiona el cálculo
/// reactivo de margen, captura fotos desde cámara o archivos con [ImagePicker]
/// y envía la actualización completa a `PUT /api/productos/{prod_id}`.
class ProductFormHandler extends StatefulWidget {
  // --- Estado y Dependencias ---

  /// Producto existente a editar; si es `null`, el formulario opera en modo alta.
  final Product? productToEdit;

  /// Crea el controlador del formulario [ProductFormHandler].
  const ProductFormHandler({super.key, this.productToEdit});

  @override
  State<ProductFormHandler> createState() => _ProductFormHandlerState();
}

class _ProductFormHandlerState extends State<ProductFormHandler> {
  // --- Estado y Dependencias ---

  final _formKey = GlobalKey<FormState>();
  final _productRepository = ProductRepository();
  final _imagePicker = ImagePicker();

  late final TextEditingController _nameController;
  late final TextEditingController _barcodeController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _salePriceController;
  late final TextEditingController _costPriceController;
  late final TextEditingController _stockController;
  late final TextEditingController _minStockController;

  bool _isSubmitting = false;
  int? _selectedCategoryId;

  // Catálogo base alineado con BD; si el producto trae una categoría adicional se inyecta dinámicamente.
  late final List<Category> _categories;

  /// Catálogo de subcategorías traído desde el backend para el tenant activo.
  final List<Subcategory> _availableSubcategories = [];

  /// IDs de subcategorías asignadas al producto actual.
  final List<int> _selectedSubcategoryIds = [];

  final List<String> _imageUrls = [];
  double _marginPercentage = 0.0;

  bool _isVisible = true;
  bool _isAvailable = true;
  bool _onlyVariants = false;
  bool _allowBackorder = false;
  List<ProductVariant> _variants = [];

  // --- Ciclo de Vida / Inicialización ---

  @override
  void initState() {
    super.initState();
    final p = widget.productToEdit;

    _categories = [
      const Category(id: 1, name: 'Accesorios'),
      const Category(id: 2, name: 'Alimento'),
      const Category(id: 3, name: 'Higiene'),
      const Category(id: 4, name: 'Jardinería'),
      const Category(id: 5, name: 'Medicamentos'),
    ];

    // Garantiza que el Dropdown no lance excepción si FastAPI retorna un cat_id fuera del listado base.
    if (p != null && !_categories.any((c) => c.id == p.categoryId)) {
      _categories.add(
        p.category ?? Category(id: p.categoryId, name: 'Categoría #${p.categoryId}'),
      );
    }

    _nameController = TextEditingController(text: p?.name ?? '');
    _barcodeController = TextEditingController(text: p?.barcode ?? '');
    _descriptionController = TextEditingController(text: p?.description ?? '');
    _salePriceController = TextEditingController(
      text: p != null ? p.salePrice.toStringAsFixed(0) : '',
    );
    _costPriceController = TextEditingController(
      text: p?.costPrice != null ? p!.costPrice!.toStringAsFixed(0) : '',
    );
    _stockController = TextEditingController(text: p?.stock.toString() ?? '0');
    _minStockController = TextEditingController(text: p?.minStock?.toString() ?? '5');

    if (p != null) {
      _selectedCategoryId = p.categoryId;
      _isVisible = p.isVisibleInShowcase;
      _isAvailable = p.isAvailable;
      _onlyVariants = p.onlyVariants;
      _allowBackorder = p.allowBackorder;
      _imageUrls.addAll(p.images.map((img) => img.url));
      _variants = List.from(p.variants);
    } else {
      _selectedCategoryId = _categories.first.id;
    }

    // <!> Calcula el margen inicial sin invocar setState() dentro de initState().
    _marginPercentage = _computeMarginPercentage();

    _salePriceController.addListener(_calculateMargin);
    _costPriceController.addListener(_calculateMargin);
  }

  @override
  void dispose() {
    _salePriceController.removeListener(_calculateMargin);
    _costPriceController.removeListener(_calculateMargin);
    _nameController.dispose();
    _barcodeController.dispose();
    _descriptionController.dispose();
    _salePriceController.dispose();
    _costPriceController.dispose();
    _stockController.dispose();
    _minStockController.dispose();
    super.dispose();
  }

  // --- Construcción de Vista ---

  @override
  Widget build(BuildContext context) {
    return ProductFormScreen(
      formKey: _formKey,
      isSubmitting: _isSubmitting,
      isEditing: widget.productToEdit != null,
      nameController: _nameController,
      barcodeController: _barcodeController,
      descriptionController: _descriptionController,
      salePriceController: _salePriceController,
      costPriceController: _costPriceController,
      stockController: _stockController,
      minStockController: _minStockController,
      selectedCategoryId: _selectedCategoryId,
      categories: _categories,
      onCategoryChanged: (id) => setState(() => _selectedCategoryId = id),
      // <!> Conexión de subcategorías dinámicas hacia ProductFormScreen -> BasicInfoSection.
      availableSubcategories: _availableSubcategories,
      selectedSubcategoryIds: _selectedSubcategoryIds,
      onSubcategoryToggled: _toggleSubcategory,
      onManageSubcategories: null,
      subcategoryImageBuilder: null,
      imageUrls: _imageUrls,
      onPickFromCamera: () => _pickImage(ImageSource.camera),
      onPickFromGallery: () => _pickImage(ImageSource.gallery),
      onRemoveImage: (i) => setState(() => _imageUrls.removeAt(i)),
      onSetFeatured: _setFeaturedImage,
      marginPercentage: _marginPercentage,
      isVisible: _isVisible,
      isAvailable: _isAvailable,
      onlyVariants: _onlyVariants,
      allowBackorder: _allowBackorder,
      onVisibleChanged: (v) => setState(() => _isVisible = v),
      onAvailableChanged: (v) => setState(() => _isAvailable = v),
      onOnlyVariantsChanged: (v) => setState(() => _onlyVariants = v),
      onAllowBackorderChanged: (v) => setState(() => _allowBackorder = v),
      variants: _variants,
      onAddVariant: _addEmptyVariant,
      onRemoveVariant: (i) => setState(() => _variants.removeAt(i)),
      onSubmit: _submitProduct,
    );
  }

  // --- Helpers Privados ---

  /// Calcula el porcentaje de margen bruto sobre costo sin mutar estado de widget.
  double _computeMarginPercentage() {
    final sale = double.tryParse(_salePriceController.text) ?? 0.0;
    final cost = double.tryParse(_costPriceController.text) ?? 0.0;
    return (cost > 0 && sale > cost) ? ((sale - cost) / cost) * 100 : 0.0;
  }

  /// Actualiza reactivamente el margen mostrado al editar precio de venta o costo.
  void _calculateMargin() {
    final nextMargin = _computeMarginPercentage();
    if (nextMargin == _marginPercentage) return;
    setState(() => _marginPercentage = nextMargin);
  }

  /// Asigna o remueve una subcategoría seleccionada por su identificador único.
  void _toggleSubcategory(int subId) {
    setState(() {
      if (_selectedSubcategoryIds.contains(subId)) {
        _selectedSubcategoryIds.remove(subId);
      } else {
        _selectedSubcategoryIds.add(subId);
      }
    });
  }

  /// Agrega una variante base tomando como referencia el precio de venta actual.
  void _addEmptyVariant() {
    setState(() {
      _variants.add(
        ProductVariant(
          id: DateTime.now().millisecondsSinceEpoch,
          productId: widget.productToEdit?.id ?? 0,
          type: 'Presentación',
          name: 'Nueva Variante',
          salePrice: double.tryParse(_salePriceController.text) ?? 0.0,
          stock: 10,
        ),
      );
    });
  }

  /// Abre cámara o galería/archivos y convierte la foto a Data URI para previsualización multiplataforma.
  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _imagePicker.pickImage(
        source: source,
        imageQuality: 85,
        maxWidth: 1600,
      );
      if (picked == null || !mounted) return;

      final bytes = await picked.readAsBytes();
      final mime = picked.mimeType ?? 'image/jpeg';
      final dataUri = 'data:$mime;base64,${base64Encode(bytes)}';

      if (!mounted) return;
      setState(() => _imageUrls.add(dataUri));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo seleccionar la imagen: $e')),
      );
    }
  }

  /// Mueve la imagen seleccionada a la posición 0 para marcarla como portada principal.
  void _setFeaturedImage(int index) {
    if (index <= 0 || index >= _imageUrls.length) return;
    setState(() {
      final selected = _imageUrls.removeAt(index);
      _imageUrls.insert(0, selected);
    });
  }

  /// Valida el formulario, construye el payload de [Product] y persiste contra FastAPI.
  Future<void> _submitProduct() async {
    if (_isSubmitting || !_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final existing = widget.productToEdit;

      // Filtra solo URLs remotas válidas; las fotos locales (data:...) requieren endpoint de subida a R2.
      final hasPendingLocalImages = _imageUrls.any((u) => u.startsWith('data:'));
      final remoteImages = _imageUrls
          .asMap()
          .entries
          .where((e) => !e.value.startsWith('data:'))
          .map(
            (e) => ProductImage(
              id: 0,
              url: e.value,
              isFeatured: e.key == 0,
            ),
          )
          .toList();

      final productPayload = Product(
        id: existing?.id ?? 0,
        name: _nameController.text.trim(),
        description: _descriptionController.text.trim().isEmpty
            ? null
            : _descriptionController.text.trim(),
        barcode: _barcodeController.text.trim().isEmpty
            ? null
            : _barcodeController.text.trim(),
        salePrice: double.tryParse(_salePriceController.text) ?? 0.0,
        costPrice: double.tryParse(_costPriceController.text),
        stock: int.tryParse(_stockController.text) ?? 0,
        minStock: int.tryParse(_minStockController.text) ?? 5,
        onlyVariants: _onlyVariants,
        isActive: existing?.isActive ?? true,
        isAvailable: _isAvailable,
        isVisibleInShowcase: _isVisible,
        allowBackorder: _allowBackorder,
        categoryId: _selectedCategoryId ?? existing?.categoryId ?? 1,
        images: remoteImages,
        variants: _variants,
      );

      // Ejecuta actualización integral PUT /api/productos/{prod_id}.
      if (existing != null) {
        await _productRepository.updateProduct(
          productId: existing.id,
          product: productPayload,
        );
      } else {
        throw Exception(
          'El alta de producto (POST) aún está pendiente de conectar en ProductRepository.',
        );
      }

      if (!mounted) return;
      if (hasPendingLocalImages) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Producto actualizado. Las fotos locales nuevas requieren conectar el endpoint de subida a R2.',
            ),
          ),
        );
      }
      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Error al guardar: ${e.toString().replaceAll('Exception: ', '')}',
          ),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }
}