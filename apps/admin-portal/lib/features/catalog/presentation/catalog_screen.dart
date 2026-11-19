// apps/admin-portal/lib/features/catalog/presentation/catalog_screen.dart

import 'package:flutter/material.dart';
import '../domain/product_model.dart';
import 'widgets/metrics_header.dart';
import 'widgets/search_and_filters.dart';
import 'widgets/product_card_item.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String _activeFilter = 'all';
  String _searchQuery = '';

  // Lista simulada inicial (se conectará a FastAPI en el siguiente paso)
  List<Product> _products = [
    const Product(
      id: 1,
      title: 'Alimento Royal Canin Renal Support',
      category: 'Nutrición Clínica',
      sku: 'VET-REN-09',
      salePrice: 24000,
      costPrice: 11500,
      stock: 35,
      isVisibleInShowcase: true,
      imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150',
    ),
    const Product(
      id: 2,
      title: 'Shampoo Hipoalergénico Dermocare 250ml',
      category: 'Dermatología',
      sku: 'DERM-SH-250',
      salePrice: 8900,
      costPrice: 4900,
      stock: 3, // Crítico
      isVisibleInShowcase: true,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    // Cálculo reactivo de métricas
    final totalCount = _products.length;
    final showcaseCount = _products.where((p) => p.isVisibleInShowcase).length;
    final criticalCount = _products.where((p) => p.isCriticalStock).length;
    final hiddenCount = _products.where((p) => !p.isVisibleInShowcase).length;

    // Filtrado local
    final filteredProducts = _products.where((p) {
      if (_activeFilter == 'showcase') return p.isVisibleInShowcase;
      if (_activeFilter == 'critical') return p.isCriticalStock;
      if (_activeFilter == 'hidden') return !p.isVisibleInShowcase;
      return true;
    }).where((p) {
      if (_searchQuery.isEmpty) return true;
      return p.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Catálogo'),
        actions: [
          IconButton(
            tooltip: 'Nuevo Producto',
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () {
              // Navegará al formulario de alta
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(vertical: 16),
        children: [
          MetricsHeader(
            totalCount: totalCount,
            showcaseCount: showcaseCount,
            criticalCount: criticalCount,
            hiddenCount: hiddenCount,
          ),
          const SizedBox(height: 16),
          SearchAndFilters(
            selectedFilter: _activeFilter,
            onFilterChanged: (filter) => setState(() => _activeFilter = filter),
            onSearch: (query) => setState(() => _searchQuery = query),
          ),
          const SizedBox(height: 12),
          ...filteredProducts.map(
            (product) => ProductCardItem(
              product: product,
              onToggleShowcase: (value) {
                setState(() {
                  final index = _products.indexWhere((p) => p.id == product.id);
                  if (index != -1) {
                    _products[index] = product.copyWith(isVisibleInShowcase: value);
                  }
                });
              },
              onEdit: () {},
            ),
          ),
        ],
      ),
    );
  }
}