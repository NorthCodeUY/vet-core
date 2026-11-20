// apps/admin-portal/lib/screens/product_form/product_form_handler.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'product_form_screen.dart';

class ProductFormHandler extends StatefulWidget {
  final Product? productToEdit;

  const ProductFormHandler({super.key, this.productToEdit});

  @override
  State<ProductFormHandler> createState() => _ProductFormHandlerState();
}

class _ProductFormHandlerState extends State<ProductFormHandler> {
  final _formKey = GlobalKey<FormState>();
  final _productRepository = ProductRepository();

  // Controllers
  late final TextEditingController _nameController;
  late final TextEditingController _barcodeController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _salePriceController;
  late final TextEditingController _costPriceController;
  late final TextEditingController _stockController;
  late final TextEditingController _minStockController;

  // Estado
  bool _isSubmitting = false;
  int? _selectedCategoryId;
  List<Category> _categories = const [
    Category(id: 1, name: 'Nutrición Clínica'),
    Category(id: 2, name: 'Farmacia y Medicamentos'),
    Category(id: 3, name: 'Higiene & Cuidado'),
  ];
  final List<String> _availableTags = ['Caninos', 'Medicados', 'Bolsa Grande', 'Renal Care'];
  final List<String> _selectedTags = [];
  final List<String> _imageUrls = [];
  double _marginPercentage = 0.0;

  // Booleans
  bool _isVisible = true;
  bool _isAvailable = true;
  bool _onlyVariants = false;
  bool _allowBackorder = false;

  // Variantes
  List<ProductVariant> _variants = [];

  @override
  void initState() {
    super.initState();
    final p = widget.productToEdit;

    _nameController = TextEditingController(text: p?.name ?? '');
    _barcodeController = TextEditingController(text: p?.barcode ?? '');
    _descriptionController = TextEditingController(text: p?.description ?? '');
    _salePriceController = TextEditingController(text: p?.salePrice.toStringAsFixed(0) ?? '');
    _costPriceController = TextEditingController(text: p?.costPrice?.toStringAsFixed(0) ?? '');
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
    }

    _salePriceController.addListener(_calculateMargin);
    _costPriceController.addListener(_calculateMargin);
    _calculateMargin();
  }

  void _calculateMargin() {
    final sale = double.tryParse(_salePriceController.text) ?? 0.0;
    final cost = double.tryParse(_costPriceController.text) ?? 0.0;
    if (cost > 0 && sale > cost) {
      setState(() {
        _marginPercentage = ((sale - cost) / cost) * 100;
      });
    } else {
      setState(() {
        _marginPercentage = 0.0;
      });
    }
  }

  Future<void> _submitProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      final payload = {
        'prod_nombre': _nameController.text.trim(),
        'prod_descripcion': _descriptionController.text.trim(),
        'prod_codigo_barra': _barcodeController.text.trim().isEmpty ? null : _barcodeController.text.trim(),
        'prod_precio_venta': double.parse(_salePriceController.text),
        'prod_precio_costo': double.tryParse(_costPriceController.text),
        'prod_stock': int.tryParse(_stockController.text) ?? 0,
        'prod_stock_minimo': int.tryParse(_minStockController.text) ?? 5,
        'prod_visible': _isVisible,
        'prod_disponible': _isAvailable,
        'prod_solo_variantes': _onlyVariants,
        'prod_per_sin_stock': _allowBackorder,
        'cat_id': _selectedCategoryId ?? 1,
      };

      // Si edita hace PUT, si no hace POST
      if (widget.productToEdit != null) {
        await _productRepository.updateProductStockAndPrice(
          productId: widget.productToEdit!.id,
          stock: payload['prod_stock'] as int,
          salePrice: payload['prod_precio_venta'] as double,
          costPrice: payload['prod_precio_costo'] as double?,
        );
      }

      if (!mounted) return;
      Navigator.pop(context, true); // Retorna 'true' para refrescar el catálogo
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al guardar: $e')),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _barcodeController.dispose();
    _descriptionController.dispose();
    _salePriceController.dispose();
    _costPriceController.dispose();
    _stockController.dispose();
    _minStockController.dispose();
    super.dispose();
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
      availableTags: _availableTags,
      selectedTags: _selectedTags,
      onTagToggled: (tag) {
        setState(() {
          _selectedTags.contains(tag) ? _selectedTags.remove(tag) : _selectedTags.add(tag);
        });
      },
      imageUrls: _imageUrls,
      onAddImage: () {
        // Simulación: agregamos una foto de ejemplo
        setState(() => _imageUrls.add('https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300'));
      },
      onRemoveImage: (i) => setState(() => _imageUrls.removeAt(i)),
      onSetFeatured: (i) {},
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
      onAddVariant: () {
        setState(() {
          _variants.add(ProductVariant(
            id: DateTime.now().millisecondsSinceEpoch,
            productId: widget.productToEdit?.id ?? 0,
            type: 'Presentación',
            name: 'Nueva Variante',
            salePrice: double.tryParse(_salePriceController.text) ?? 0.0,
            stock: 10,
          ));
        });
      },
      onRemoveVariant: (i) => setState(() => _variants.removeAt(i)),
      onSubmit: _submitProduct,
    );
  }
}