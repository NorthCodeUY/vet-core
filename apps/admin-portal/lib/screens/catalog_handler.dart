// apps/admin-portal/lib/screens/catalog_handler.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'catalog_screen.dart';

import 'package:flutter/foundation.dart';


/// Controlador de Estado para la pantalla de Gestión de Catálogo y Vitrina.
///
/// Coordina:
/// - La carga asíncrona de productos desde FastAPI (`GET /api/productos`).
/// - El filtrado multicriterio en memoria (búsqueda de texto y chip de estado).
/// - Las mutaciones directas (visibilidad en vitrina, disponibilidad y bajas).
class CatalogHandler extends StatefulWidget {
  const CatalogHandler({super.key});

  @override
  State<CatalogHandler> createState() => _CatalogHandlerState();
}

class _CatalogHandlerState extends State<CatalogHandler> {
  final ProductRepository _productRepository = ProductRepository();

  List<Product> _products = [];
  bool _isLoading = true;
  String? _errorMessage;

  String _activeFilter = 'all';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  /// Carga los productos reales desde el backend FastAPI.
  Future<void> _fetchProducts() async {


    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    // try {
    //   final data = await _productRepository.getProducts();
    //   if (!mounted) return;
    //   setState(() {
    //     _products = data;
    //     _isLoading = false;
    //   });
    // } catch (e) {
    //   if (!mounted) return;
    //   setState(() {
    //     _errorMessage = e.toString().replaceAll('Exception: ', '');
    //     _isLoading = false;
    //   });
    // }


    try {
      final data = await _productRepository.getProducts();
      // <!> Traza temporal para confirmar cuántos productos y fotos llegaron realmente al estado
      if (kDebugMode) {
        final withImages = data.where((p) => p.images.isNotEmpty).length;
        debugPrint('📦 Catálogo parseado: ${data.length} productos | Con foto: $withImages');
      }
      if (!mounted) return;
      setState(() {
        _products = data;
        _isLoading = false;
      });
    } catch (e, stack) {
      // <!> Imprime la excepción y línea exacta si algún fromJson (Product, Variant o Color) falla
      if (kDebugMode) {
        debugPrint('❌ ERROR en _fetchProducts: $e\n$stack');
      }
      if (!mounted) return;
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
        _isLoading = false;
      });
    }



  }

  /// Conmuta optimistamente el interruptor de vitrina web (`PATCH /api/productos/:id/vitrina`).
  Future<void> _handleToggleShowcase(Product product, bool isVisible) async {
    // 1. Actualización optimista local
    final targetIndex = _products.indexWhere((p) => p.id == product.id);
    if (targetIndex == -1) return;

    final original = _products[targetIndex];
    setState(() {
      _products[targetIndex] = product.copyWith(isVisibleInShowcase: isVisible);
    });

    try {
      // 2. Persistencia en FastAPI
      await _productRepository.toggleShowcaseVisibility(
        productId: product.id,
        isVisible: isVisible,
      );
    } catch (e) {
      // 3. Rollback en caso de error de red
      if (!mounted) return;
      setState(() {
        _products[targetIndex] = original;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al cambiar vitrina: $e'),
          backgroundColor: Theme.of(context).colorScheme.error,
        ),
      );
    }
  }

  /// Cambia la disponibilidad operativa (Pausar producto).
  Future<void> _handleToggleAvailability(Product product) async {
    final newAvailability = !product.isAvailable;
    final targetIndex = _products.indexWhere((p) => p.id == product.id);
    if (targetIndex == -1) return;

    final original = _products[targetIndex];
    setState(() {
      _products[targetIndex] = Product(
        id: product.id,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
        salePrice: product.salePrice,
        costPrice: product.costPrice,
        stock: product.stock,
        minStock: product.minStock,
        onlyVariants: product.onlyVariants,
        isActive: product.isActive,
        isAvailable: newAvailability,
        isVisibleInShowcase: product.isVisibleInShowcase,
        allowBackorder: product.allowBackorder,
        categoryId: product.categoryId,
        category: product.category,
        images: product.images,
        variants: product.variants,
      );
    });

    try {
      await _productRepository.updateProductStockAndPrice(
        productId: product.id,
        stock: product.stock,
        salePrice: product.salePrice,
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _products[targetIndex] = original);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al actualizar disponibilidad: $e')),
      );
    }
  }

  /// Ejecuta la baja lógica del producto (`DELETE /api/productos/:id`).
  ///
  /// Solicita confirmación explícita mediante un diálogo destructivo Material 3.
  /// Si el usuario confirma, despacha la petición al backend FastAPI, actualiza
  /// optimistamente la lista en memoria y recalcula las métricas del catálogo.
  Future<void> _handleDeleteProduct(Product product) async {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        icon: Icon(Icons.delete_sweep_outlined, color: colorScheme.error, size: 36),
        title: const Text('Dar de baja producto'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text.rich(
              TextSpan(
                text: '¿Confirmas la baja de ',
                children: [
                  TextSpan(
                    text: '"${product.name}"',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const TextSpan(text: '?'),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: colorScheme.errorContainer.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, size: 16, color: colorScheme.error),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'El producto se marcará como inactivo (prod_activo = False) en la base de datos y dejará de exhibirse en vitrina.',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.onErrorContainer,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          FilledButton.icon(
            style: FilledButton.styleFrom(
              backgroundColor: colorScheme.error,
              foregroundColor: colorScheme.onError,
            ),
            icon: const Icon(Icons.delete_outline, size: 18),
            label: const Text('Confirmar Baja'),
            onPressed: () => Navigator.pop(ctx, true),
          ),
        ],
      ),
    );

    if (confirm != true || !mounted) return;

    final messenger = ScaffoldMessenger.of(context);

    // Feedback inmediato de operación en curso
    messenger.showSnackBar(
      SnackBar(
        duration: const Duration(seconds: 1),
        content: Row(
          children: [
            const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Expanded(child: Text('Dando de baja "${product.name}"...')),
          ],
        ),
      ),
    );

    try {
      await _productRepository.softDeleteProduct(product.id);
      if (!mounted) return;
      setState(() {
        _products.removeWhere((p) => p.id == product.id);
      });
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: colorScheme.primary,
          content: Text('Producto "${product.name}" dado de baja correctamente'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: colorScheme.error,
          content: Text('Error al dar de baja el producto: $e'),
        ),
      );
    }
  }

  /// Pipeline de filtrado combinado (Texto + Chips).
  List<Product> _getFilteredProducts() {
    return _products.where((p) {
      final matchesFilter = switch (_activeFilter) {
        'with_photo' => p.images.isNotEmpty,
        'showcase'   => p.isVisibleInShowcase,
        'critical'   => p.isCriticalStock,
        'hidden'     => !p.isVisibleInShowcase,
        _            => true,
      };
      if (!matchesFilter) return false;

      if (_searchQuery.trim().isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return p.name.toLowerCase().contains(q) ||
          (p.barcode?.toLowerCase().contains(q) ?? false);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return CatalogScreen(
      isLoading: _isLoading,
      errorMessage: _errorMessage,
      products: _getFilteredProducts(),
      totalCount: _products.length,
      showcaseCount: _products.where((p) => p.isVisibleInShowcase).length,
      criticalCount: _products.where((p) => p.isCriticalStock).length,
      hiddenCount: _products.where((p) => !p.isVisibleInShowcase).length,
      activeFilter: _activeFilter,
      onFilterChanged: (f) => setState(() => _activeFilter = f),
      onSearchChanged: (q) => setState(() => _searchQuery = q),
      onRefresh: _fetchProducts,
      onToggleShowcase: _handleToggleShowcase,
      onToggleAvailability: _handleToggleAvailability,
      onEditProduct: (p) {
        // TODO: Navegar a ProductFormScreen pasando 'p'
      },
      onDeleteProduct: _handleDeleteProduct,
      onCreateProduct: () {
        // TODO: Navegar a ProductFormScreen vacío
      },
    );
  }
}