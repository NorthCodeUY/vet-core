// apps/admin-portal/lib/screens/catalog_screen.dart

// lib/screens/catalog_screen.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/widgets/metrics_header.dart';
import 'package:admin_portal/widgets/product_card_item.dart';
import 'package:admin_portal/widgets/search_and_filters.dart';

/// Pantalla puramente declarativa de Catálogo y Vitrina.
///
/// No contiene lógica de negocio ni peticiones HTTP. Solo renderiza la información
/// suministrada por [CatalogHandler] a través de subcomponentes pequeños.
class CatalogScreen extends StatelessWidget {
  final bool isLoading;
  final String? errorMessage;
  final List<Product> products;

  // Métricas
  final int totalCount;
  final int showcaseCount;
  final int criticalCount;
  final int hiddenCount;

  // Filtros
  final String activeFilter;
  final ValueChanged<String> onFilterChanged;
  final ValueChanged<String> onSearchChanged;

  // Callbacks
  final Future<void> Function() onRefresh;
  final void Function(Product, bool) onToggleShowcase;
  final void Function(Product) onToggleAvailability;
  final void Function(Product) onEditProduct;
  final void Function(Product) onDeleteProduct;
  final VoidCallback onCreateProduct;

  const CatalogScreen({
    super.key,
    required this.isLoading,
    this.errorMessage,
    required this.products,
    required this.totalCount,
    required this.showcaseCount,
    required this.criticalCount,
    required this.hiddenCount,
    required this.activeFilter,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.onRefresh,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onEditProduct,
    required this.onDeleteProduct,
    required this.onCreateProduct,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: _CatalogAppBar(onCreateProduct: onCreateProduct),
      body: RefreshIndicator(
        onRefresh: onRefresh,
        child: _buildBody(context),
      ),
    );
  }

  /// Alterna entre estado de carga, error o contenido de catálogo.
  Widget _buildBody(BuildContext context) {
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
      activeFilter: activeFilter,
      onFilterChanged: onFilterChanged,
      onSearchChanged: onSearchChanged,
      products: products,
      onToggleShowcase: onToggleShowcase,
      onToggleAvailability: onToggleAvailability,
      onEditProduct: onEditProduct,
      onDeleteProduct: onDeleteProduct,
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 1: APPBAR MODULAR (WIDGET PRIVADO)
// =============================================================================
class _CatalogAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onCreateProduct;

  const _CatalogAppBar({required this.onCreateProduct});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return AppBar(
      title: Text(
        'Gestión de Catálogo',
        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
      ),
      actions: [
        IconButton(
          tooltip: 'Nuevo Producto',
          icon: Icon(Icons.add_circle, color: colorScheme.primary),
          onPressed: onCreateProduct,
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

// =============================================================================
// SUB-COMPONENTE 2: LISTA DE CONTENIDO Y FILTROS (WIDGET PRIVADO)
// =============================================================================
class _CatalogContentList extends StatelessWidget {
  final int totalCount;
  final int showcaseCount;
  final int criticalCount;
  final int hiddenCount;
  final String activeFilter;
  final ValueChanged<String> onFilterChanged;
  final ValueChanged<String> onSearchChanged;
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
    required this.activeFilter,
    required this.onFilterChanged,
    required this.onSearchChanged,
    required this.products,
    required this.onToggleShowcase,
    required this.onToggleAvailability,
    required this.onEditProduct,
    required this.onDeleteProduct,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      children: [
        // 1. Métricas superiores
        MetricsHeader(
          totalCount: totalCount,
          showcaseCount: showcaseCount,
          criticalCount: criticalCount,
          hiddenCount: hiddenCount,
        ),
        const SizedBox(height: 16),

        // 2. Buscador y chips 
        SearchAndFilters(
          selectedFilter: activeFilter,
          onFilterChanged: onFilterChanged,
          onSearch: onSearchChanged,
        ),
        const SizedBox(height: 12),

        // 3. Renderizado de ítems o estado vacío
        if (products.isEmpty)
          const _CatalogEmptyState()
        else
          ...products.map(
            (p) => ProductCardItem(
              key: ValueKey(p.id),
              product: p,
              onToggleShowcase: (val) => onToggleShowcase(p, val),
              onToggleAvailability: () => onToggleAvailability(p),
              onEdit: () => onEditProduct(p),
              onDelete: () => onDeleteProduct(p),
            ),
          ),
      ],
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 3: ESTADO VACÍO (EMPTY STATE)
// =============================================================================
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
            Icon(Icons.inventory_2_outlined, size: 64, color: colorScheme.outlineVariant),
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
              style: theme.textTheme.bodySmall?.copyWith(color: colorScheme.outline),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// SUB-COMPONENTE 4: ESTADOS DE CARGA Y ERROR
// =============================================================================
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

class _CatalogErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _CatalogErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.cloud_off_rounded, size: 64, color: colorScheme.error),
            const SizedBox(height: 16),
            Text(
              'Error de Conexión',
              style: TextStyle(fontWeight: FontWeight.bold, color: colorScheme.error),
            ),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}


