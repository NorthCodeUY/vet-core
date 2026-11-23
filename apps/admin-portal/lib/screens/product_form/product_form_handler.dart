// apps/admin-portal/lib/screens/product_form/product_form_handler.dart
// Propósito: Orquestar estado del formulario maestro de producto, subcategorías,
// multimedia y persistencia POST/PUT contra FastAPI.

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/models/product/subcategory_model.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'package:admin_portal/repositories/subcategory_repository.dart';
import 'package:admin_portal/screens/product_form/widgets/subcategory_form_dialog.dart';
import 'product_form_screen.dart';

/// Controlador de estado (`Handler`) para el alta y edición integral de un [Product].
///
/// Separa completamente la lógica de negocio de la UI pura ([ProductFormScreen]):
/// - Precarga campos cuando recibe [productToEdit] (`PUT`) o inicializa valores base (`POST`).
/// - Hidrata subcategorías desde `GET /api/subcategorias` y permite crear nuevas en vivo.
/// - Calcula el margen comercial de forma reactiva ante cambios de precio/costo.
/// - Captura imágenes multiplataforma y coordina el guardado final en [ProductRepository].
class ProductFormHandler extends StatefulWidget {
  /// Producto existente a editar; si es `null`, el formulario opera en modo creación.
  final Product? productToEdit;

  /// Crea el controlador del formulario [ProductFormHandler].
  const ProductFormHandler({super.key, this.productToEdit});

  @override
  State<ProductFormHandler> createState() => _ProductFormHandlerState();
}

class _ProductFormHandlerState extends State<ProductFormHandler> {
  // ===========================================================================
  // 1. DEPENDENCIAS Y CONTROLADORES DE TEXTO
  // ===========================================================================

  final _formKey = GlobalKey<FormState>();
  final _productRepository = ProductRepository();
  final _subcategoryRepository = SubcategoryRepository();
  final _imagePicker = ImagePicker();

  late final TextEditingController _nameController;
  late final TextEditingController _barcodeController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _salePriceController;
  late final TextEditingController _costPriceController;
  late final TextEditingController _stockController;
  late final TextEditingController _minStockController;

  // ===========================================================================
  // 2. ESTADO REACTIVO DEL FORMULARIO
  // ===========================================================================

  bool _isSubmitting = false;
  int? _selectedCategoryId;
  late final List<Category> _categories;

  List<Subcategory> _availableSubcategories = [];
  final List<int> _selectedSubcategoryIds = [];
  bool _isLoadingSubcategories = false;

  final List<String> _imageUrls = [];
  double _marginPercentage = 0.0;

  bool _isVisible = true;
  bool _isAvailable = true;
  bool _onlyVariants = false;
  bool _allowBackorder = false;
  List<ProductVariant> _variants = [];

  // ===========================================================================
  // 3. CICLO DE VIDA (INICIALIZACIÓN Y LIMPIEZA)
  // ===========================================================================

  @override
  void initState() {
    super.initState();
    final product = widget.productToEdit;

    _initCategoryCatalog(product);
    _initTextControllers(product);
    if (product != null) {
      _hydrateProductState(product);
    }

    // Calcula el margen inicial sin disparar setState() durante initState().
    _marginPercentage = _computeMarginPercentage();
    _salePriceController.addListener(_calculateMargin);
    _costPriceController.addListener(_calculateMargin);

    // Carga asíncrona del catálogo real de subcategorías desde FastAPI.
    _loadSubcategories();
  }

  /// Inicializa el catálogo base de categorías asegurando que el `cat_id`
  /// del producto editado siempre exista en el selector para evitar fallos de Dropdown.
  void _initCategoryCatalog(Product? product) {
    _categories = [
      const Category(id: 1, name: 'Accesorios'),
      const Category(id: 2, name: 'Alimento'),
      const Category(id: 3, name: 'Higiene'),
      const Category(id: 4, name: 'Jardinería'),
      const Category(id: 5, name: 'Medicamentos'),
    ];

    if (product != null && !_categories.any((c) => c.id == product.categoryId)) {
      _categories.add(
        product.category ??
            Category(
              id: product.categoryId,
              name: 'Categoría #${product.categoryId}',
            ),
      );
    }

    _selectedCategoryId = product?.categoryId ?? _categories.first.id;
  }

  /// Inicializa los controladores de texto con valores existentes o por defecto.
  void _initTextControllers(Product? product) {
    _nameController = TextEditingController(text: product?.name ?? '');
    _barcodeController = TextEditingController(text: product?.barcode ?? '');
    _descriptionController =
        TextEditingController(text: product?.description ?? '');
    _salePriceController = TextEditingController(
      text: product != null ? product.salePrice.toStringAsFixed(0) : '',
    );
    _costPriceController = TextEditingController(
      text: product?.costPrice != null
          ? product!.costPrice!.toStringAsFixed(0)
          : '',
    );
    _stockController =
        TextEditingController(text: product?.stock.toString() ?? '0');
    _minStockController =
        TextEditingController(text: product?.minStock?.toString() ?? '5');
  }

  /// Precarga banderas de vitrina, galería, variantes y subcategorías al editar.
  void _hydrateProductState(Product product) {
    _isVisible = product.isVisibleInShowcase;
    _isAvailable = product.isAvailable;
    _onlyVariants = product.onlyVariants;
    _allowBackorder = product.allowBackorder;
    _imageUrls.addAll(product.images.map((img) => img.url));
    _variants = List.from(product.variants);
    _selectedSubcategoryIds.addAll(product.subcategories.map((s) => s.id));
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

  // ===========================================================================
  // 4. CONSTRUCCIÓN DE VISTA DECLARATIVA
  // ===========================================================================

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
      availableSubcategories: _availableSubcategories,
      selectedSubcategoryIds: _selectedSubcategoryIds,
      onSubcategoryToggled: _toggleSubcategory,
      onManageSubcategories: _openCreateSubcategoryDialog,
      subcategoryImageBuilder: (sub) => sub.isImageActive ? sub.imageUrl : null,
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

  // ===========================================================================
  // 5. SUBCATEGORÍAS (CARGA, SELECCIÓN Y ALTA RÁPIDA)
  // ===========================================================================

  /// Consulta `GET /api/subcategorias` e hidrata el catálogo disponible.
  Future<void> _loadSubcategories() async {
    if (_isLoadingSubcategories) return;
    setState(() => _isLoadingSubcategories = true);

    try {
      final list = await _subcategoryRepository.getAll();
      if (!mounted) return;
      setState(() => _availableSubcategories = list);
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar(
        'Error al cargar subcategorías: ${e.toString().replaceAll('Exception: ', '')}',
      );
    } finally {
      if (mounted) setState(() => _isLoadingSubcategories = false);
    }
  }

  /// Alterna la asignación de una subcategoría por su identificador único.
  void _toggleSubcategory(int subId) {
    setState(() {
      if (_selectedSubcategoryIds.contains(subId)) {
        _selectedSubcategoryIds.remove(subId);
      } else {
        _selectedSubcategoryIds.add(subId);
      }
    });
  }

  /// Abre el modal `+ Gestionar`, persiste en `POST /api/subcategorias` y
  /// selecciona automáticamente la nueva subcategoría en el producto actual.
  Future<void> _openCreateSubcategoryDialog() async {
    final created = await SubcategoryFormDialog.show(
      context,
      onSubmit: ({
        required String name,
        required SubcategoryIconType iconType,
        String? iconName,
        String? imageUrl,
      }) {
        return _subcategoryRepository.create(
          name: name,
          iconType: iconType,
          iconName: iconName,
          imageUrl: imageUrl,
        );
      },
    );

    if (created == null || !mounted) return;

    setState(() {
      _availableSubcategories = [..._availableSubcategories, created];
      if (!_selectedSubcategoryIds.contains(created.id)) {
        _selectedSubcategoryIds.add(created.id);
      }
    });
  }

  // ===========================================================================
  // 6. FINANZAS, VARIANTES Y MULTIMEDIA
  // ===========================================================================

  /// Calcula el porcentaje de margen bruto sobre costo sin mutar el árbol UI.
  double _computeMarginPercentage() {
    final sale = double.tryParse(_salePriceController.text) ?? 0.0;
    final cost = double.tryParse(_costPriceController.text) ?? 0.0;
    return (cost > 0 && sale > cost) ? ((sale - cost) / cost) * 100 : 0.0;
  }

  /// Actualiza reactivamente el indicador de margen al editar precios.
  void _calculateMargin() {
    final nextMargin = _computeMarginPercentage();
    if (nextMargin == _marginPercentage) return;
    setState(() => _marginPercentage = nextMargin);
  }

  /// Inserta una nueva variante editable usando el PVP actual como precio base.
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

  /// Captura imagen desde cámara o archivos y genera un Data URI local para preview.
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
      _showErrorSnackBar('No se pudo seleccionar la imagen: $e');
    }
  }

  /// Promueve la imagen en [index] al índice 0 para fijarla como portada.
  void _setFeaturedImage(int index) {
    if (index <= 0 || index >= _imageUrls.length) return;
    setState(() {
      final selected = _imageUrls.removeAt(index);
      _imageUrls.insert(0, selected);
    });
  }

  // ===========================================================================
  // 7. VALIDACIÓN, CONSTRUCCIÓN DE PAYLOAD Y PERSISTENCIA (POST / PUT)
  // ===========================================================================

  /// Valida el formulario, construye el modelo [Product] y despacha `POST` o `PUT`.
  Future<void> _submitProduct() async {
    if (_isSubmitting || !_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final existing = widget.productToEdit;
      final hasPendingLocalImages = _imageUrls.any((u) => u.startsWith('data:'));
      final productPayload = _buildProductPayload(existing);

      if (existing != null) {
        await _productRepository.updateProduct(
          productId: existing.id,
          product: productPayload,
        );
      } else {
        await _productRepository.createProduct(product: productPayload);
      }

      if (!mounted) return;
      if (hasPendingLocalImages) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              existing != null
                  ? 'Producto actualizado. Las fotos locales nuevas requieren endpoint de subida a R2.'
                  : 'Producto creado. Las fotos locales nuevas requieren endpoint de subida a R2.',
            ),
          ),
        );
      }
      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar(
        'Error al guardar: ${e.toString().replaceAll('Exception: ', '')}',
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  /// Filtra únicamente URLs remotas persistibles; excluye Data URIs locales (`data:...`).
  List<ProductImage> _extractRemoteImages() {
    return _imageUrls
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
  }

  /// Resuelve las entidades [Subcategory] correspondientes a [_selectedSubcategoryIds].
  List<Subcategory> _resolveSelectedSubcategories() {
    return _selectedSubcategoryIds
        .map(
          (subId) => _availableSubcategories.firstWhere(
            (s) => s.id == subId,
            orElse: () => Subcategory(id: subId, name: ''),
          ),
        )
        .toList();
  }

  /// Ensambla la entidad [Product] inmutable a partir del estado actual del formulario.
  Product _buildProductPayload(Product? existing) {
    final trimmedDescription = _descriptionController.text.trim();
    final trimmedBarcode = _barcodeController.text.trim();

    return Product(
      id: existing?.id ?? 0,
      name: _nameController.text.trim(),
      description: trimmedDescription.isEmpty ? null : trimmedDescription,
      barcode: trimmedBarcode.isEmpty ? null : trimmedBarcode,
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
      images: _extractRemoteImages(),
      variants: _variants,
      subcategories: _resolveSelectedSubcategories(),
    );
  }

  /// Muestra notificaciones de error usando el token semántico de color del tenant.
  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }
}