// apps/admin-portal/lib/screens/product_form/product_form_handler.dart
// Propósito: Orquestar estado del formulario maestro de producto, subcategorías,
// subida de imágenes a Cloudflare R2 y persistencia POST/PUT contra FastAPI.

import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';


import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'package:admin_portal/repositories/subcategory_repository.dart';
import 'package:admin_portal/screens/product_form/widgets/subcategory_form_dialog.dart';
import 'product_form_screen.dart';
// Make sure ProductFormScreen is defined in product_form_screen.dart and exported properly.




/// Controlador de estado (`Handler`) para el alta y edición integral de un [Product].
///
/// Separa completamente la lógica de negocio de la UI pura ([ProductFormScreen]):
/// - Precarga campos cuando recibe [productToEdit] (`PUT`) o inicializa valores base (`POST`).
/// - Hidrata subcategorías desde `GET /api/subcategorias` y permite crear nuevas en vivo.
/// - Calcula el margen comercial de forma reactiva ante cambios de precio/costo.
/// - Conserva imágenes remotas previas (R2), valida fotos nuevas locales (JPG/PNG/WEBP <= 5 MB),
///   las sube a `POST /api/productos/upload-imagen` y envía `"imagenes": List<String>` al guardar.
class ProductFormHandler extends StatefulWidget {
  /// Producto existente a editar; si es `null`, el formulario opera en modo creación.
  final Product? productToEdit;

  /// Crea el controlador del formulario [ProductFormHandler].
  const ProductFormHandler({super.key, this.productToEdit});

  @override
  State<ProductFormHandler> createState() => _ProductFormHandlerState();
}

/// Representa un ítem dentro de la galería en edición.
///
/// Unifica en una sola lista ordenada:
/// - **Entradas remotas:** URLs ya persistidas en Cloudflare R2 (`isLocal == false`).
/// - **Entradas locales:** Bytes seleccionados en el dispositivo pendientes de subir (`isLocal == true`).
class _PendingImageEntry {
  /// URL remota (`https://...`) o Data URI local (`data:image/...;base64,...`) para preview.
  final String previewSource;

  /// Bytes crudos de la imagen local; es `null` cuando ya existe en Cloudflare R2.
  final Uint8List? localBytes;

  /// Nombre del archivo enviado en el campo `file` del `multipart/form-data`.
  final String? filename;

  /// Tipo MIME validado (`image/jpeg`, `image/png` o `image/webp`).
  final String? mimeType;

  const _PendingImageEntry._({
    required this.previewSource,
    this.localBytes,
    this.filename,
    this.mimeType,
  });

  /// Crea una referencia a una imagen ya almacenada en Cloudflare R2.
  factory _PendingImageEntry.remote(String url) =>
      _PendingImageEntry._(previewSource: url.trim());

  /// Crea una referencia a una imagen local pendiente de subida.
  factory _PendingImageEntry.local({
    required String dataUri,
    required Uint8List bytes,
    required String filename,
    required String mimeType,
  }) =>
      _PendingImageEntry._(
        previewSource: dataUri,
        localBytes: bytes,
        filename: filename,
        mimeType: mimeType,
      );

  /// Retorna `true` si la imagen aún debe subirse al endpoint `/api/productos/upload-imagen`.
  bool get isLocal => localBytes != null;
}
//<!>Missing concrete implementation of 'State.build'.
// Try implementing the missing method, or make the class abstract.
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
  late List<Category> _categories;

  List<Subcategory> _availableSubcategories = [];
  final List<int> _selectedSubcategoryIds = [];
  bool _isLoadingSubcategories = false;

  /// Lista mutable ordenada que respalda la galería; el índice `0` será la portada.
  final List<_PendingImageEntry> _galleryEntries = [];

  double _marginPercentage = 0.0;
  bool _isVisible = true;
  bool _isAvailable = true;
  bool _onlyVariants = false;
  bool _allowBackorder = false;
  List<ProductVariant> _variants = [];
  /// Proyección de solo lectura con las fuentes visuales consumidas por `GalleryPickerSection`.
  List<_PendingImageEntry> get galleryEntries => List.unmodifiable(_galleryEntries);


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
    _selectedCategoryId = product?.categoryId ?? (_categories.isNotEmpty ? _categories.first.id : null);

  
  }// Fin _initCategoryCatalog(Product? product)




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








  /// Precarga banderas de vitrina, galería (portada primero), variantes y subcategorías.
  void _hydrateProductState(Product product) {
    _isVisible = product.isVisibleInShowcase;
    _isAvailable = product.isAvailable;
    _onlyVariants = product.onlyVariants;
    _allowBackorder = product.allowBackorder;

    // Ubica la imagen marcada como `img_principal` al inicio (índice 0) para mantenerla al editar.
    final sortedImages = [...product.images]
      
      
      // ..sort((a, b) => (a.isFeatured ? 1 : 0).compareTo(b.isFeatured ? 1 : 0));
      ..sort((a, b) => (b.isFeatured ? 1 : 0).compareTo(a.isFeatured ? 1 : 0));


    _galleryEntries.addAll(
      sortedImages
          .where((img) => img.url.trim().isNotEmpty)
          .map((img) => _PendingImageEntry.remote(img.url)),
    );

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



  // ===========================================================================
  // 3. CICLO DE VIDA (INICIALIZACIÓN Y LIMPIEZA)
  // ===========================================================================




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


  /// Selecciona imagen desde cámara o archivos, valida tamaño (`<= 5 MB`) y
  /// formato real (`JPG`, `PNG` o `WEBP`), y genera un Data URI local para preview.
  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _imagePicker.pickImage(
        source: source,
        imageQuality: 85,
        maxWidth: 1600,
      );
      if (picked == null || !mounted) return;

      final bytes = await picked.readAsBytes();
      const maxBytes = 5 * 1024 * 1024;
      if (bytes.lengthInBytes > maxBytes) {
        _showErrorSnackBar('La imagen supera el límite máximo de 5 MB.');
        return;
      }

      final detected = _detectImageFormat(
        bytes: bytes,
        fallbackMime: picked.mimeType,
        fallbackName: picked.name,
      );
      if (detected == null) {
        _showErrorSnackBar(
          'Formato no soportado. Selecciona una imagen JPG, PNG o WEBP.',
        );
        return;
      }

      final dataUri = 'data:${detected.mime};base64,${base64Encode(bytes)}';
      final safeName = picked.name.trim().isNotEmpty
          ? picked.name.trim()
          : 'producto_${DateTime.now().millisecondsSinceEpoch}.${detected.ext}';

      if (!mounted) return;
      setState(() {
        _galleryEntries.add(
          _PendingImageEntry.local(
            dataUri: dataUri,
            bytes: bytes,
            filename: safeName,
            mimeType: detected.mime,
          ),
        );
      });
    } catch (e) {
      if (!mounted) return;
      _showErrorSnackBar('No se pudo seleccionar la imagen: $e');
    }
  }

  /// Promueve la imagen en [index] al índice `0` para fijarla como portada.
  void _setFeaturedImage(int index) {
    if (index <= 0 || index >= _galleryEntries.length) return;
    setState(() {
      final selected = _galleryEntries.removeAt(index);
      _galleryEntries.insert(0, selected);
    });
  }

  /// Detecta el formato real (JPEG, PNG o WEBP) mediante magic bytes con fallback a MIME/extensión.
  ({String mime, String ext})? _detectImageFormat({
    required Uint8List bytes,
    String? fallbackMime,
    String? fallbackName,
  }) {
    if (bytes.length >= 3 &&
        bytes[0] == 0xFF &&
        bytes[1] == 0xD8 &&
        bytes[2] == 0xFF) {
      return (mime: 'image/jpeg', ext: 'jpg');
    }
    if (bytes.length >= 4 &&
        bytes[0] == 0x89 &&
        bytes[1] == 0x50 &&
        bytes[2] == 0x4E &&
        bytes[3] == 0x47) {
      return (mime: 'image/png', ext: 'png');
    }
    if (bytes.length >= 12 &&
        bytes[0] == 0x52 &&
        bytes[1] == 0x49 &&
        bytes[2] == 0x46 &&
        bytes[3] == 0x46 &&
        bytes[8] == 0x57 &&
        bytes[9] == 0x45 &&
        bytes[10] == 0x42 &&
        bytes[11] == 0x50) {
      return (mime: 'image/webp', ext: 'webp');
    }

    final mime = fallbackMime?.toLowerCase().trim();
    if (mime == 'image/jpeg' || mime == 'image/jpg') {
      return (mime: 'image/jpeg', ext: 'jpg');
    }
    if (mime == 'image/png') return (mime: 'image/png', ext: 'png');
    if (mime == 'image/webp') return (mime: 'image/webp', ext: 'webp');

    final lowerName = fallbackName?.toLowerCase() ?? '';
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
      return (mime: 'image/jpeg', ext: 'jpg');
    }
    if (lowerName.endsWith('.png')) return (mime: 'image/png', ext: 'png');
    if (lowerName.endsWith('.webp')) return (mime: 'image/webp', ext: 'webp');

    return null;
  }

  // ===========================================================================
  // 7. VALIDACIÓN, SUBIDA A R2 Y PERSISTENCIA (POST / PUT)
  // ===========================================================================

  /// Sube primero cada imagen local nueva a `/api/productos/upload-imagen`,
  /// conserva las URLs existentes en el orden actual y despacha `POST` o `PUT`.
  Future<void> _submitProduct() async {
    if (_isSubmitting || !_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      // Parallelize image uploads while preserving order
      final uploadFutures = _galleryEntries.asMap().entries.map((entry) async {
        final i = entry.key;
        final img = entry.value;
        if (!img.isLocal) {
          return img.previewSource;
        }
        final uploadedUrl = await _productRepository.uploadProductImage(
          bytes: img.localBytes!,
          filename: img.filename!,
          mimeType: img.mimeType!,
        );
        // Replace in memory for consistency
        _galleryEntries[i] = _PendingImageEntry.remote(uploadedUrl);
        return uploadedUrl;
      }).toList();

      final resolvedUrls = await Future.wait(uploadFutures);

      final existing = widget.productToEdit;
      final productPayload = _buildProductPayload(existing, resolvedUrls);

      if (existing != null) {
        await _productRepository.updateProduct(
          productId: existing.id,
          product: productPayload,
        );
      } else {
        await _productRepository.createProduct(product: productPayload);
      }

      if (!mounted) return;
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

  /// Ensambla la entidad [Product] inmutable incluyendo las URLs ordenadas para `"imagenes"`.
  Product _buildProductPayload(Product? existing, List<String> imageUrls) {
    final trimmedDescription = _descriptionController.text.trim();
    final trimmedBarcode = _barcodeController.text.trim();

    final images = imageUrls
        .asMap()
        .entries
        .map(
          (e) => ProductImage(
            id: 0,
            url: e.value,
            isFeatured: e.key == 0,
          ),
        )
        .toList();

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
      images: images,
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

       
      // <!> nuevo probar  
      subcategoryImageBuilder: (sub) => sub.isImageActive ? sub.imageUrl : null,

      imageUrls: galleryEntries.map((e) => e.previewSource).toList(growable: false),
      onPickFromCamera: () => _pickImage(ImageSource.camera),
      onPickFromGallery: () => _pickImage(ImageSource.gallery),
      onRemoveImage: (i) => setState(() => _galleryEntries.removeAt(i)),
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

}
