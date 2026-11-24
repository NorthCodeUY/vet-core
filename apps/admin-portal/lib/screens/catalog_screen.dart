// apps/admin-portal/lib/screens/catalog_screen.dart
// Propósito: Vista declarativa pura del módulo de Catálogo y Vitrina con
// renderizado lazy, búsqueda irrestricta conectada al backend y pull-to-refresh.

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/widgets/metrics_header.dart';
import 'package:admin_portal/widgets/product_card_item.dart';
import 'package:admin_portal/widgets/search_and_filters.dart';

/// Pantalla puramente declarativa de Catálogo y Vitrina.
class CatalogScreen extends StatelessWidget {
  final bool isLoading;
  final bool isSearching;
  final String? errorMessage;
  final List<Product> products;

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

  final Future<void> Function() onRefresh;
  final void Function(Product product, bool isVisible) onToggleShowcase;
  final void Function(Product product) onToggleAvailability;
  final void Function(Product product) onEditProduct;
  final void Function(Product product) onDeleteProduct;
  final VoidCallback onCreateProduct;

  const CatalogScreen({
    super.key,
    required this.isLoading,
    this.isSearching = false,
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
      onEditProduct: onEditProduct,
      onDeleteProduct: onDeleteProduct,
    );
  }
}

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
    required this.onEditProduct,
    required this.onDeleteProduct,
  });

  @override
  Widget build(BuildContext context) {
    final totalItems = products.isEmpty ? 2 : products.length + 1;

    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
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
          onEdit: () => onEditProduct(product),
          onDelete: () => onDeleteProduct(product),
        );
      },
    );
  }
}

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
