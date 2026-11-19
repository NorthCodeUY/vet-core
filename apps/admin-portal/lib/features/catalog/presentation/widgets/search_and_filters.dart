//apps/admin-portal/lib/features/catalog/presentation/widgets/search_and_filters.dart

import 'package:flutter/material.dart';

class SearchAndFilters extends StatelessWidget {
  final String selectedFilter;
  final ValueChanged<String> onFilterChanged;
  final ValueChanged<String> onSearch;

  const SearchAndFilters({
    super.key,
    required this.selectedFilter,
    required this.onFilterChanged,
    required this.onSearch,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      children: [
        // Barra de Búsqueda
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: TextField(
            onChanged: onSearch,
            decoration: InputDecoration(
              hintText: 'Buscar por Nombre, SKU, EAN...',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: IconButton(
                icon: const Icon(Icons.tune),
                onPressed: () {},
              ),
              filled: true,
              fillColor: colorScheme.surfaceContainerLowest,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
            ),
          ),
        ),
        const SizedBox(height: 10),

        // Filtros en Barra Horizontal Desplazable
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              _FilterChip(
                label: 'Todos',
                isSelected: selectedFilter == 'all',
                onTap: () => onFilterChanged('all'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'En Vitrina',
                isSelected: selectedFilter == 'showcase',
                onTap: () => onFilterChanged('showcase'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Stock Crítico',
                isSelected: selectedFilter == 'critical',
                onTap: () => onFilterChanged('critical'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Ocultos',
                isSelected: selectedFilter == 'hidden',
                onTap: () => onFilterChanged('hidden'),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => onTap(),
      selectedColor: colorScheme.primary,
      labelStyle: TextStyle(
        color: isSelected ? colorScheme.onPrimary : colorScheme.onSurfaceVariant,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      backgroundColor: colorScheme.surfaceContainerLowest,
      side: BorderSide.none,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
}