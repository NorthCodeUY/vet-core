// apps/admin-portal/lib/screens/catalog_screen.dart
// Propósito: Vista declarativa pura del módulo de Catálogo y Vitrina con
// renderizado lazy, pull-to-refresh y manejo explícito de estados (carga, error, vacío).

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/widgets/metrics_header.dart';
import 'package:admin_portal/widgets/product_card_item.dart';
import 'package:admin_portal/widgets/search_and_filters.dart';

/// Pantalla puramente declarativa de Catálogo y Vitrina.
///
/// Sigue el patrón `Screen + Handler`: no mantiene estado mutable ni ejecuta
/// peticiones HTTP directamente. Renderiza la información y métricas provistas
/// por `CatalogHandler` delegando todas las acciones del usuario mediante callbacks.
class CatalogScreen extends StatelessWidget {
  // ===========================================================================
  // 1. ESTADO DE VISTA Y COLECCIÓN DE DATOS
  // ===========================================================================

  /// Indica si se está ejecutando la carga inicial o recarga del catálogo.
  final bool isLoading;

  /// Mensaje de error normalizado cuando falla la comunicación con FastAPI.
  final String? errorMessage;

  /// Lista ya filtrada de productos que deben renderizarse en el listado.
  final List<Product> products;

  // ===========================================================================
  // 2. MÉTRICAS Y SEGMENTACIÓN
  // ===========================================================================

  /// Total de productos activos registrados en el catálogo del tenant.
  final int totalCount;

  /// Cantidad de productos publicados actualmente en vitrina web.
  final int showcaseCount;

  /// Cantidad de productos por debajo del umbral de stock crítico.
  final int criticalCount;

  /// Cantidad de productos ocultos temporalmente de la tienda pública.
  final int hiddenCount;

  /// Texto actual ingresado en la barra de búsqueda del catálogo.
  final String searchQuery;

  /// Identificador del chip de filtro activo (`all`, `showcase`, `critical`, etc.).
  final String activeFilter;

  /// Listado de categorías disponibles para el selector de filtrado.
  /// Nota: ajustar el genérico (`dynamic`) al tipo exacto declarado en [SearchAndFilters].
  final List<Category> categories;

  /// ID de la categoría seleccionada (`null` cuando no hay filtro por categoría).
  final int? selectedCategoryId;

  /// Callback disparado al seleccionar otro chip de filtro.
  final ValueChanged<String> onFilterChanged;

  /// Callback disparado al escribir en el campo de búsqueda.
  final ValueChanged<String> onSearchChanged;

  /// Callback disparado al seleccionar o limpiar la categoría en el filtro.
  final ValueChanged<int?> onCategoryChanged;

  /// Callback disparado al restablecer todos los filtros y búsqueda activos.
  final VoidCallback onClearFilters;

  // ===========================================================================
  // 3. ACCIONES SOBRE EL CATÁLOGO
  // ===========================================================================

  /// Callback disparado al hacer *pull-to-refresh* o pulsar Reintentar.
  final Future<void> Function() onRefresh;

  /// Alterna la visibilidad en vitrina pública para un producto.
  final void Function(Product product, bool isVisible) onToggleShowcase;

  /// Alterna la disponibilidad operativa inmediata de un producto.
  final void Function(Product product) onToggleAvailability;

  /// Abre el formulario maestro en modo edición para el producto seleccionado.
  final void Function(Product product) onEditProduct;

  /// Solicita confirmación y ejecuta la baja lógica de un producto.
  final void Function(Product product) onDeleteProduct;

  /// Abre el formulario maestro en modo alta para crear un nuevo producto.
  final VoidCallback onCreateProduct;

  // ===========================================================================
  // 4. CONSTRUCTOR
  // ===========================================================================

  /// Crea la vista declarativa [CatalogScreen].
  const CatalogScreen({
    super.key,
    required this.isLoading,
    this.errorMessage,
    required this.products,
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
    required this.searchQuery,
    required this.activeFilter,
    required this.categories,
    required this.selectedCategoryId,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.onCategoryChanged,
    required this.onClearFilters,
    required this.onRefresh,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onEditProduct,
    required this.onDeleteProduct,
    required this.onCreateProduct,
  });

  // ===========================================================================
  // 5. CONSTRUCCIÓN DE INTERFAZ
  // ===========================================================================

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: onCreateProduct,
        icon: const Icon(Icons.add),
        label: const Text('Nuevo Producto'),
        tooltip: 'Registrar un nuevo producto en el catálogo',
      ),
      body: RefreshIndicator(
        onRefresh: onRefresh,
        child: _buildBody(),
      ),
    );
  }

  /// Selecciona la subvista correspondiente al ciclo de vida actual (`loading`, `error`, `data`).
  Widget _buildBody() {
    if (isLoading) {
      return const _CatalogLoadingState();
    }

    if (errorMessage != null) {
      return _CatalogErrorState(
        message: errorMessage!,
        onRetry: onRefresh,
      );
    }

    return _CatalogContentList(
      totalCount: totalCount,
      showcaseCount: showcaseCount,
      criticalCount: criticalCount,
      hiddenCount: hiddenCount,
      searchQuery: searchQuery,
      activeFilter: activeFilter,
      categories: categories,
      selectedCategoryId: selectedCategoryId,
      onFilterChanged: onFilterChanged,
      onSearchChanged: onSearchChanged,
      onCategoryChanged: onCategoryChanged,
      onClearFilters: onClearFilters,
      products: products,
      onToggleShowcase: onToggleShowcase,
      onToggleAvailability: onToggleAvailability,
      onEditProduct: onEditProduct,
      onDeleteProduct: onDeleteProduct,
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 1: LISTADO LAZY DE MÉTRICAS, FILTROS Y PRODUCTOS
// =============================================================================

/// Renderiza cabecera de métricas, barra de búsqueda y tarjetas de productos bajo
/// demanda mediante `ListView.builder` para mantener fluidez en catálogos extensos.
class _CatalogContentList extends StatelessWidget {
  final int totalCount;
  final int showcaseCount;
  final int criticalCount;
  final int hiddenCount;
  final String searchQuery;
  final String activeFilter;
  final List<Category> categories;
  final int? selectedCategoryId;
  final ValueChanged<String> onFilterChanged;
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<int?> onCategoryChanged;
  final VoidCallback onClearFilters;
  final List<Product> products;
  final void Function(Product, bool) onToggleShowcase;
  final void Function(Product) onToggleAvailability;
  final void Function(Product) onEditProduct;
  final void Function(Product) onDeleteProduct;

  const _CatalogContentList({
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
    required this.searchQuery,
    required this.activeFilter,
    required this.categories,
    required this.selectedCategoryId,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.onCategoryChanged,
    required this.onClearFilters,
    required this.products,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onEditProduct,
    required this.onDeleteProduct,
  });

  @override
  Widget build(BuildContext context) {
    // Índice 0 = Cabecera (métricas + búsqueda/filtros); índice 1+ = productos o estado vacío.
    final totalItems = products.isEmpty ? 2 : products.length + 1;

    return ListView.builder(
      // AlwaysScrollableScrollPhysics habilita pull-to-refresh incluso con pocos ítems.
      physics: const AlwaysScrollableScrollPhysics(),
      // Margen inferior amplio (88 px) para que el FAB no cubra la última tarjeta.
      padding: const EdgeInsets.fromLTRB(0, 16, 0, 88),
      itemCount: totalItems,
      itemBuilder: (context, index) {
        if (index == 0) {
          return _CatalogHeaderSection(
            totalCount: totalCount,
            showcaseCount: showcaseCount,
            criticalCount: criticalCount,
            hiddenCount: hiddenCount,
            searchQuery: searchQuery,
            activeFilter: activeFilter,
            categories: categories,
            selectedCategoryId: selectedCategoryId,
            onFilterChanged: onFilterChanged,
            onSearchChanged: onSearchChanged,
            onCategoryChanged: onCategoryChanged,
            onClearFilters: onClearFilters,
          );
        }

        if (products.isEmpty) {
          return const _CatalogEmptyState();
        }

        final product = products[index - 1];
        return ProductCardItem(
          key: ValueKey(product.id),
          product: product,
          onToggleShowcase: (val) => onToggleShowcase(product, val),
          onToggleAvailability: () => onToggleAvailability(product),
          onEdit: () => onEditProduct(product),
          onDelete: () => onDeleteProduct(product),
        );
      },
    );
  }
}

/// Agrupa métricas superiores y controles de filtrado como primer elemento del scroll.
class _CatalogHeaderSection extends StatelessWidget {
  final int totalCount;
  final int showcaseCount;
  final int criticalCount;
  final int hiddenCount;
  final String searchQuery;
  final String activeFilter;
  final List<Category> categories;
  final int? selectedCategoryId;
  final ValueChanged<String> onFilterChanged;
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<int?> onCategoryChanged;
  final VoidCallback onClearFilters;

  const _CatalogHeaderSection({
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
    required this.searchQuery,
    required this.activeFilter,
    required this.categories,
    required this.selectedCategoryId,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.onCategoryChanged,
    required this.onClearFilters,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        MetricsHeader(
          totalCount: totalCount,
          showcaseCount: showcaseCount,
          criticalCount: criticalCount,
          hiddenCount: hiddenCount,
        ),
        const SizedBox(height: 16),
        SearchAndFilters(
          searchQuery: searchQuery,
          selectedFilter: activeFilter,
          categories: categories,
          selectedCategoryId: selectedCategoryId,
          onSearch: onSearchChanged,
          onFilterChanged: onFilterChanged,
          onCategoryChanged: onCategoryChanged,
          onClearFilters: onClearFilters,
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 2: ESTADO VACÍO (EMPTY STATE)
// =============================================================================

/// Muestra una vista amigable cuando la búsqueda o el filtro activo no arrojan resultados.
class _CatalogEmptyState extends StatelessWidget {
  const _CatalogEmptyState();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 64.0, horizontal: 24.0),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.inventory_2_outlined,
              size: 64,
              color: colorScheme.outlineVariant,
            ),
            const SizedBox(height: 16),
            Text(
              'No se encontraron productos',
              style: theme.textTheme.titleSmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Prueba con otros términos o crea un nuevo ítem.',
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.outline,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 3: ESTADOS DE CARGA Y ERROR
// =============================================================================

/// Indicador centrado mostrado mientras se descarga el catálogo desde FastAPI.
class _CatalogLoadingState extends StatelessWidget {
  const _CatalogLoadingState();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Cargando catálogo desde el servidor...'),
        ],
      ),
    );
  }
}

/// Estado de error resiliente ante caídas de red o servidor, compatible con
/// *pull-to-refresh* y protegido contra overflow en pantallas pequeñas.
class _CatalogErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _CatalogErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return LayoutBuilder(
      builder: (context, constraints) {
        return SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: BoxConstraints(minHeight: constraints.maxHeight - 48),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.cloud_off_rounded,
                    size: 64,
                    color: colorScheme.error,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error de Conexión',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: colorScheme.error,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    message,
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: onRetry,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Reintentar'),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}