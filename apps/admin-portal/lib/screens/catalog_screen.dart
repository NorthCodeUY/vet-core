// apps/admin-portal/lib/screens/catalog_screen.dart
// Propósito: Vista declarativa pura del módulo de Catálogo y Vitrina con
// renderizado lazy, búsqueda irrestricta conectada al backend y acciones rápidas por tarjeta.

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/widgets/metrics_header.dart';
import 'package:admin_portal/widgets/product_card_item.dart';
import 'package:admin_portal/widgets/search_and_filters.dart';

/// Pantalla puramente declarativa de Catálogo y Vitrina.
///
/// Sigue el patrón `Screen + Handler`: no administra estado mutable ni ejecuta
/// peticiones HTTP directamente. Renderiza el inventario y métricas provistas
/// por `CatalogHandler`, delegando cada intención del usuario mediante callbacks.
class CatalogScreen extends StatelessWidget {
  // ===========================================================================
  // 1. ESTADO DE VISTA Y COLECCIÓN DE PRODUCTOS
  // ===========================================================================

  /// Indica si se está ejecutando la carga inicial del módulo.
  final bool isLoading;

  /// Indica si hay una búsqueda en segundo plano contra `/api/productos/admin/filtrados`.
  final bool isSearching;

  /// Mensaje de error normalizado cuando falla la comunicación con FastAPI.
  final String? errorMessage;

  /// Listado filtrado de productos a renderizar en la vista actual.
  final List<Product> products;

  // ===========================================================================
  // 2. MÉTRICAS Y FILTROS DE BÚSQUEDA
  // ===========================================================================

  /// Cantidad total de productos devueltos por la consulta actual.
  final int totalCount;

  /// Cantidad de productos visibles actualmente en la vitrina pública.
  final int showcaseCount;

  /// Cantidad de productos en condición de stock crítico.
  final int criticalCount;

  /// Cantidad de productos ocultos temporalmente de la tienda pública.
  final int hiddenCount;

  /// Texto de búsqueda activo actualmente en el servidor.
  final String searchQuery;

  /// Identificador del filtro de segmentación activo (`all`, `showcase`, `inactive`, etc.).
  final String activeFilter;

  /// Catálogo dinámico de categorías disponibles para filtrar (`cat_id`).
  final List<Category> categories;

  /// Categoría seleccionada actualmente (`null` = Todas).
  final int? selectedCategoryId;

  /// Callback al cambiar el chip de segmentación por estado.
  final ValueChanged<String> onFilterChanged;

  /// Callback al modificar el texto de búsqueda.
  final ValueChanged<String> onSearchChanged;

  /// Callback al seleccionar o limpiar una categoría.
  final ValueChanged<int?> onCategoryChanged;

  /// Callback para restablecer texto, categoría y filtro activo.
  final VoidCallback onClearFilters;

  // ===========================================================================
  // 3. ACCIONES SOBRE PRODUCTOS
  // ===========================================================================

  /// Callback ejecutado al hacer *pull-to-refresh* o pulsar Reintentar.
  final Future<void> Function() onRefresh;

  /// Alterna la visibilidad pública en vitrina (`prod_visible`).
  final void Function(Product product, bool isVisible) onToggleShowcase;

  /// Alterna la disponibilidad comercial inmediata (`prod_disponible`).
  final void Function(Product product) onToggleAvailability;

  /// Alterna la venta sin stock / por encargo (`prod_per_sin_stock`).
  final void Function(Product product, bool allowBackorder) onToggleBackorder;

  /// Dispara la captura o selección rápida de foto principal desde la tarjeta.
  final void Function(Product product, ImageSource source) onQuickPickImage;

  /// Abre la vista previa interactiva imitando `ProductCardV2.tsx` de la tienda pública.
  final void Function(Product product) onPreviewProduct;

  /// Abre el modal generador de código QR para vitrina o código interno.
  final void Function(Product product) onGenerateQr;

  /// Abre el formulario maestro en modo edición completa.
  final void Function(Product product) onEditProduct;

  /// Solicita confirmación y ejecuta la baja lógica del producto.
  final void Function(Product product) onDeleteProduct;

  /// Abre el formulario maestro en modo alta para registrar un nuevo producto.
  final VoidCallback onCreateProduct;

  // ===========================================================================
  // 4. CONSTRUCTOR
  // ===========================================================================

 

  //  Constructor organizado por bloques lógicos para facilitar su lectura y mantenimiento.
  /// Construye la vista declarativa [CatalogScreen].
  ///
  /// Agrupa los parámetros en 4 bloques:
  /// 1. **Estado de carga/datos:** [isLoading], [isSearching], [errorMessage], [products].
  /// 2. **Métricas del encabezado:** [totalCount], [showcaseCount], [criticalCount], [hiddenCount].
  /// 3. **Búsqueda y filtros:** [searchQuery], [activeFilter], [categories], [selectedCategoryId] y sus callbacks.
  /// 4. **Acciones de catálogo y tarjeta:** toggles (`vitrina`, `disponible`, `encargo`), foto rápida, vista previa, QR y CRUD.
  const CatalogScreen({
    super.key,
    // 1. Estado de carga y datos
    required this.isLoading,
    this.isSearching = false,
    this.errorMessage,
    required this.products,
    // 2. Métricas superiores
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
    // 3. Búsqueda y filtros
    required this.searchQuery,
    required this.activeFilter,
    required this.categories,
    required this.selectedCategoryId,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.onCategoryChanged,
    required this.onClearFilters,
    // 4. Acciones del catálogo y de cada tarjeta
    required this.onRefresh,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onToggleBackorder,
    required this.onQuickPickImage,
    required this.onPreviewProduct,
    required this.onGenerateQr,
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

  /// Resuelve el estado visual correspondiente (`loading`, `error` o `data`).
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
      isSearching: isSearching,
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
      onToggleBackorder: onToggleBackorder,
      onQuickPickImage: onQuickPickImage,
      onPreviewProduct: onPreviewProduct,
      onGenerateQr: onGenerateQr,
      onEditProduct: onEditProduct,
      onDeleteProduct: onDeleteProduct,
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 1: LISTADO LAZY DE MÉTRICAS, BÚSQUEDA Y TARJETAS
// =============================================================================

/// Renderiza bajo demanda métricas, barra de búsqueda y tarjetas [ProductCardItem].
class _CatalogContentList extends StatelessWidget {
  final bool isSearching;
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
  final void Function(Product, bool) onToggleBackorder;
  final void Function(Product, ImageSource) onQuickPickImage;
  final void Function(Product) onPreviewProduct;
  final void Function(Product) onGenerateQr;
  final void Function(Product) onEditProduct;
  final void Function(Product) onDeleteProduct;

  const _CatalogContentList({
    required this.isSearching,
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
    required this.onToggleBackorder,
    required this.onQuickPickImage,
    required this.onPreviewProduct,
    required this.onGenerateQr,
    required this.onEditProduct,
    required this.onDeleteProduct,
  });

  @override
  Widget build(BuildContext context) {
    // Índice 0 = Cabecera; índice 1+ = tarjetas de producto o estado vacío.
    final totalItems = products.isEmpty ? 2 : products.length + 1;

    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      // Reserva margen inferior para que el FAB no cubra la última tarjeta.
      padding: const EdgeInsets.fromLTRB(0, 16, 0, 88),
      itemCount: totalItems,
      itemBuilder: (context, index) {
        if (index == 0) {
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
                onFilterChanged: onFilterChanged,
                onSearch: onSearchChanged,
                onCategoryChanged: onCategoryChanged,
                onClearFilters: onClearFilters,
              ),
              if (isSearching)
                const Padding(
                  padding: EdgeInsets.fromLTRB(16, 8, 16, 0),
                  child: LinearProgressIndicator(minHeight: 2),
                ),
              const SizedBox(height: 12),
            ],
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
          onToggleBackorder: (val) => onToggleBackorder(product, val),
          onQuickPickImage: (src) => onQuickPickImage(product, src),
          onPreview: () => onPreviewProduct(product),
          onGenerateQr: () => onGenerateQr(product),
          onEdit: () => onEditProduct(product),
          onDelete: () => onDeleteProduct(product),
        );
      },
    );
  }
}

// =============================================================================
// SUBCOMPONENTE 2: ESTADOS VACÍO, CARGA Y ERROR
// =============================================================================

/// Vista informativa cuando la búsqueda o los filtros activos no tienen coincidencias.
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
              'Prueba con otros términos, cambia de categoría o crea un nuevo ítem.',
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

/// Indicador centrado mostrado durante la descarga inicial del catálogo.
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

/// Estado de error resiliente compatible con *pull-to-refresh* y sin overflow.
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