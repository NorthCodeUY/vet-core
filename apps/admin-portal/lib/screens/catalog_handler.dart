// apps/admin-portal/lib/screens/catalog_handler.dart
// Propósito: Controlador de estado (`Handler`) para Catálogo y Vitrina con búsqueda
// irrestricta en backend (`/api/productos/admin/filtrados`), debounce y mutaciones optimistas.

import 'dart:async';
import 'package:flutter/foundation.dart' show kDebugMode;
import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';
import 'package:admin_portal/screens/product_form/product_form_handler.dart';
import 'catalog_screen.dart';

/// Controlador de Estado (`Handler`) para la gestión de Catálogo y Vitrina.
///
/// Separa completamente la lógica de negocio de la UI pura ([CatalogScreen]):
/// - Carga el inventario inicial (`GET /api/productos/admin/listado`).
/// - Ejecuta búsqueda irrestricta en backend (`GET /api/productos/admin/filtrados`)
///   con debounce de 380 ms al escribir o seleccionar categoría (`cat_id`).
/// - Aplica actualizaciones optimistas con rollback automático ante fallos de red.
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
  List<Category> _categories = [];
  bool _isLoading = true;

  bool _isSearching = false; //<!> ESTO NO SE VIEN QUE HACE 
  String? _errorMessage;

  String _activeFilter = 'all';
  String _searchQuery = '';
  int? _selectedCategoryId;

  Timer? _searchDebounce;
  // Evita que una respuesta HTTP lenta de una búsqueda vieja pise una más reciente.
  int _requestSerial = 0;

  // ===========================================================================
  // 2. CICLO DE VIDA
  // ===========================================================================

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _fetchProducts();
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    super.dispose();
  }

  // ===========================================================================
  // 3. CARGA DE CATÁLOGO Y BÚSQUEDA IRRESTRICTA EN BACKEND
  // ===========================================================================

  /// Indica si hay texto o categoría activa para consultar `/api/productos/admin/filtrados`.
  bool get _hasServerFilters =>
      _searchQuery.trim().isNotEmpty || _selectedCategoryId != null;

  /// Carga categorías disponibles desde FastAPI con respaldo desde productos cargados.
  Future<void> _loadCategories() async {
    try {
      final cats = await _productRepository.getCategories();
      if (!mounted) return;
      setState(() => _categories = cats);
    } catch (_) {
      // Respaldo silencioso: si falla `/api/categorias`, se infieren de los productos.
    }
  }

  /// Abre el formulario maestro y recarga conservando búsqueda y `cat_id` activos.
  Future<void> _openProductForm({Product? product}) async {
    final saved = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => ProductFormHandler(productToEdit: product),
      ),
    );
    if (saved == true && mounted) {
      await _fetchProducts(isBackgroundSearch: _hasServerFilters);
    }
  }

  /// Consulta el backend según haya filtros activos:
  /// - Con `search` o `cat_id` -> `GET /api/productos/admin/filtrados` (irrestricto).
  /// - Sin filtros de servidor -> `GET /api/productos/admin/listado`.
  Future<void> _fetchProducts({bool isBackgroundSearch = false}) async {
    final currentSerial = ++_requestSerial;

    setState(() {
      if (isBackgroundSearch && _products.isNotEmpty) {
        _isSearching = true;
      } else {
        _isLoading = true;
      }
      _errorMessage = null;
    });

    try {
      final data = _hasServerFilters
          ? await _productRepository.searchAdminProducts(
              search: _searchQuery,
              categoryId: _selectedCategoryId,
            )
          : await _productRepository.getProducts();

      if (!mounted || currentSerial != _requestSerial) return;

      // Respaldo del selector de categorías si `/api/categorias` no estuvo disponible.
      if (_categories.isEmpty) {
        final inferred = <int, Category>{};
        for (final p in data) {
          if (p.category != null) {
            inferred[p.category!.id] = p.category!;
          }
        }
        _categories = inferred.values.toList()
          ..sort((a, b) => a.name.compareTo(b.name));
      }

      if (kDebugMode) {
        final withImages = data.where((p) => p.images.isNotEmpty).length;
        debugPrint(
          '📦 Catálogo recibido: ${data.length} productos | Con foto: $withImages',
        );
      }

      setState(() {
        _products = data;
        _isLoading = false;
        _isSearching = false;
      });
    } catch (e, stack) {
      if (!mounted || currentSerial != _requestSerial) return;
      if (kDebugMode) {
        debugPrint('❌ Error en _fetchProducts: $e\n$stack');
      }
      setState(() {
        _isLoading = false;
        _isSearching = false;
        if (isBackgroundSearch && _products.isNotEmpty) {
          _showErrorSnackBar(_cleanExceptionMessage(e));
        } else {
          _errorMessage = _cleanExceptionMessage(e);
        }
      });
    }
  }

  /// Dispara búsqueda en backend con debounce de 380 ms para evitar ráfagas HTTP.
  void _onSearchChanged(String query) {
    setState(() => _searchQuery = query);
    _searchDebounce?.cancel();

    _searchDebounce = Timer(const Duration(milliseconds: 380), () {
      if (!mounted) return;
      _fetchProducts(isBackgroundSearch: true);
    });
  }

  /// Actualiza el filtro de categoría (`cat_id`) y consulta inmediatamente al backend.
  void _onCategoryChanged(int? categoryId) {
    _searchDebounce?.cancel();
    setState(() => _selectedCategoryId = categoryId);
    _fetchProducts(isBackgroundSearch: true);
  }

  /// Restablece búsqueda, categoría y chip de estado recargando el listado base.
  void _onClearFilters() {
    _searchDebounce?.cancel();
    setState(() {
      _searchQuery = '';
      _selectedCategoryId = null;
      _activeFilter = 'all';
    });
    _fetchProducts(isBackgroundSearch: true);
  }

  // ===========================================================================
  // 4. MUTACIONES OPTIMISTAS (VITRINA, DISPONIBILIDAD Y BAJA LÓGICA)
  // ===========================================================================

  /// Conmuta la visibilidad en vitrina (`PATCH /api/productos/{id}/vitrina`) y
  /// refresca desde el backend manteniendo `search` y `cat_id` activos.
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
      if (mounted) {
        await _fetchProducts(isBackgroundSearch: true);
      }
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
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: colorScheme.primary,
          content: Text('Producto "${product.name}" dado de baja correctamente.'),
        ),
      );
      await _fetchProducts(isBackgroundSearch: true);
    } catch (e) {
      if (!mounted) return;
      messenger.hideCurrentSnackBar();
      _showErrorSnackBar(
        'Error al dar de baja el producto: ${_cleanExceptionMessage(e)}',
      );
    }
  }

  // ===========================================================================
  // 5. SEGMENTACIÓN LOCAL SOBRE RESULTADOS Y HELPERS
  // ===========================================================================

  /// Aplica el chip de estado seleccionado sobre los resultados devueltos por el backend.
  List<Product> _getFilteredProducts() {
    return _products.where((p) {
      return switch (_activeFilter) {
        'with_photo' => p.images.isNotEmpty,
        'showcase' => p.isVisibleInShowcase,
        'critical' => p.isCriticalStock,
        'out_of_stock' => p.totalStock <= 0,
        'hidden' => !p.isVisibleInShowcase,
        'inactive' => !p.isActive,
        _ => true,
      };
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

// <!> The named parameter 'isSearching' isn't defined.
// Try correcting the name to an existing named parameter's name, or defining a named parameter with the name 'isSearching'.

  @override
  Widget build(BuildContext context) {
    return CatalogScreen(
      isLoading: _isLoading,
      isSearching: _isSearching,
      errorMessage: _errorMessage,
      products: _getFilteredProducts(),
      totalCount: _products.length,
      showcaseCount: _products.where((p) => p.isVisibleInShowcase).length,
      criticalCount: _products.where((p) => p.isCriticalStock).length,
      hiddenCount: _products.where((p) => !p.isVisibleInShowcase).length,
      searchQuery: _searchQuery,
      activeFilter: _activeFilter,
      categories: _categories,
      selectedCategoryId: _selectedCategoryId,
      onFilterChanged: (f) => setState(() => _activeFilter = f),
      onSearchChanged: _onSearchChanged,
      onCategoryChanged: _onCategoryChanged,
      onClearFilters: _onClearFilters,
      onRefresh: () => _fetchProducts(isBackgroundSearch: _hasServerFilters),
      onToggleShowcase: _handleToggleShowcase,
      onToggleAvailability: _handleToggleAvailability,
      onEditProduct: (p) => _openProductForm(product: p),
      onCreateProduct: () => _openProductForm(),
      onDeleteProduct: _handleDeleteProduct,
    );
  }
}