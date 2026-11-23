// apps/admin-portal/lib/screens/catalog_handler.dart
// Propósito: Controlador de estado (`Handler`) para el módulo de Catálogo y Vitrina;
// coordina carga de productos, filtrado local, toggles optimistas y bajas lógicas.

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'package:admin_portal/screens/product_form/product_form_handler.dart';
import 'catalog_screen.dart';

/// Controlador de Estado (`Handler`) para la gestión de Catálogo y Vitrina.
///
/// Separa completamente la lógica de negocio de la UI pura ([CatalogScreen]):
/// - Carga el inventario desde FastAPI (`GET /api/productos/admin/listado`).
/// - Ejecuta filtrado multicriterio en memoria (búsqueda por texto/EAN y chips).
/// - Aplica actualizaciones optimistas con rollback automático ante fallos de red
///   (visibilidad en vitrina, disponibilidad operativa y baja lógica).
class CatalogHandler extends StatefulWidget {
  /// Crea el controlador [CatalogHandler].
  const CatalogHandler({super.key});

  @override
  State<CatalogHandler> createState() => _CatalogHandlerState();
}

class _CatalogHandlerState extends State<CatalogHandler> {
  // ===========================================================================
  // 1. DEPENDENCIAS Y ESTADO REACTIVO
  // ===========================================================================

  final ProductRepository _productRepository = ProductRepository();

  List<Product> _products = [];
  bool _isLoading = true;
  String? _errorMessage;

  String _activeFilter = 'all';
  String _searchQuery = '';

  // ===========================================================================
  // 2. CICLO DE VIDA
  // ===========================================================================

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  // ===========================================================================
  // 3. NAVEGACIÓN Y CARGA DE CATÁLOGO
  // ===========================================================================

  /// Abre el formulario maestro en modo alta (`product == null`) o edición.
  ///
  /// Recarga el catálogo desde el servidor únicamente cuando el formulario
  /// confirma persistencia (`saved == true`).
  Future<void> _openProductForm({Product? product}) async {
    final saved = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => ProductFormHandler(productToEdit: product),
      ),
    );
    if (saved == true && mounted) {
      await _fetchProducts();
    }
  }

  /// Descarga los productos administrativos desde FastAPI y actualiza métricas.
  Future<void> _fetchProducts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final data = await _productRepository.getProducts();
      if (kDebugMode) {
        final withImages = data.where((p) => p.images.isNotEmpty).length;
        debugPrint(
          '📦 Catálogo parseado: ${data.length} productos | Con foto: $withImages',
        );
      }
      if (!mounted) return;
      setState(() {
        _products = data;
        _isLoading = false;
      });
    } catch (e, stack) {
      if (kDebugMode) {
        debugPrint('❌ Error en _fetchProducts: $e\n$stack');
      }
      if (!mounted) return;
      setState(() {
        _errorMessage = _cleanExceptionMessage(e);
        _isLoading = false;
      });
    }
  }

  // ===========================================================================
  // 4. MUTACIONES OPTIMISTAS (VITRINA, DISPONIBILIDAD Y BAJA LÓGICA)
  // ===========================================================================

  /// Conmuta de forma optimista la visibilidad en vitrina (`PATCH /api/productos/{id}/vitrina`).
  Future<void> _handleToggleShowcase(Product product, bool isVisible) async {
    final targetIndex = _products.indexWhere((p) => p.id == product.id);
    if (targetIndex == -1) return;

    final original = _products[targetIndex];
    setState(() {
      _products[targetIndex] = original.copyWith(isVisibleInShowcase: isVisible);
    });

    try {
      await _productRepository.toggleShowcaseVisibility(
        productId: product.id,
        isVisible: isVisible,
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _products[targetIndex] = original);
      _showErrorSnackBar('Error al cambiar vitrina: ${_cleanExceptionMessage(e)}');
    }
  }

  /// Alterna la disponibilidad operativa (`prod_disponible`) preservando galería y subcategorías.
  Future<void> _handleToggleAvailability(Product product) async {
    final targetIndex = _products.indexWhere((p) => p.id == product.id);
    if (targetIndex == -1) return;

    final original = _products[targetIndex];
    final updated = original.copyWith(isAvailable: !original.isAvailable);

    setState(() => _products[targetIndex] = updated);

    try {
      // Usa updateProduct para persistir `prod_disponible` sin perder imágenes ni variantes.
      final persisted = await _productRepository.updateProduct(
        productId: product.id,
        product: updated,
      );
      if (!mounted) return;
      setState(() => _products[targetIndex] = persisted);
    } catch (e) {
      if (!mounted) return;
      setState(() => _products[targetIndex] = original);
      _showErrorSnackBar(
        'Error al actualizar disponibilidad: ${_cleanExceptionMessage(e)}',
      );
    }
  }

  /// Ejecuta la baja lógica del producto (`DELETE /api/productos/{id}` -> `prod_activo = False`).
  Future<void> _handleDeleteProduct(Product product) async {
    final confirm = await _showDeleteConfirmationDialog(product);
    if (confirm != true || !mounted) return;

    final colorScheme = Theme.of(context).colorScheme;
    final messenger = ScaffoldMessenger.of(context);

    // Feedback inmediato usando tokens semánticos del tenant (Zero Hardcoding).
    messenger.showSnackBar(
      SnackBar(
        duration: const Duration(seconds: 2),
        content: Row(
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: colorScheme.onInverseSurface,
              ),
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
      setState(() => _products.removeWhere((p) => p.id == product.id));

      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: colorScheme.primary,
          content: Text('Producto "${product.name}" dado de baja correctamente.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      messenger.hideCurrentSnackBar();
      _showErrorSnackBar(
        'Error al dar de baja el producto: ${_cleanExceptionMessage(e)}',
      );
    }
  }

  // ===========================================================================
  // 5. FILTRADO EN MEMORIA Y HELPERS DE UI
  // ===========================================================================

  /// Pipeline de filtrado combinado por chip de estado y texto (nombre o código EAN).
  List<Product> _getFilteredProducts() {
    final query = _searchQuery.trim().toLowerCase();

    return _products.where((p) {
      final matchesFilter = switch (_activeFilter) {
        'with_photo' => p.images.isNotEmpty,
        'showcase' => p.isVisibleInShowcase,
        'critical' => p.isCriticalStock,
        'hidden' => !p.isVisibleInShowcase,
        _ => true,
      };
      if (!matchesFilter) return false;
      if (query.isEmpty) return true;

      return p.name.toLowerCase().contains(query) ||
          (p.barcode?.toLowerCase().contains(query) ?? false);
    }).toList();
  }

  /// Despliega diálogo destructivo Material 3 para confirmar la baja lógica.
  Future<bool?> _showDeleteConfirmationDialog(Product product) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        icon: Icon(
          Icons.delete_sweep_outlined,
          color: colorScheme.error,
          size: 36,
        ),
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
  }

  /// Normaliza el mensaje de excepción removiendo el prefijo técnico `Exception: `.
  String _cleanExceptionMessage(Object error) =>
      error.toString().replaceFirst('Exception: ', '').trim();

  /// Muestra un mensaje de error usando el token semántico `error` del tema activo.
  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Theme.of(context).colorScheme.error,
      ),
    );
  }

  // ===========================================================================
  // 6. CONSTRUCCIÓN DE VISTA DECLARATIVA
  // ===========================================================================

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
      onEditProduct: (p) => _openProductForm(product: p),
      onCreateProduct: () => _openProductForm(),
      onDeleteProduct: _handleDeleteProduct,
    );
  }
}