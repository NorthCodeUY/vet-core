// apps/admin-portal/lib/widgets/search_and_filters.dart
// Propósito: Barra de búsqueda con botón de limpieza, selector dinámico de categoría
// (`cat_id`) y chips de segmentación para el catálogo administrativo.

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/category_model.dart';

/// Controles de búsqueda y segmentación para el catálogo administrativo.
///<!> aca me gustaria que estubieran los filtros en el boton de la derecha 
// haora tengo un menu abajo que valla al menu por ejemplo 
/// Sigue el patrón `Screen + Handler`: mantiene únicamente el controlador local
/// del campo de texto sincronizado con [searchQuery] y delega todas las
/// intenciones de filtrado hacia `CatalogHandler`.
class SearchAndFilters extends StatefulWidget {
  /// Texto de búsqueda activo actualmente en el estado padre.
  final String searchQuery;

  /// Chip de estado seleccionado (`all`, `with_photo`, `showcase`, `critical`, `out_of_stock`, `hidden`, `inactive`).
  final String selectedFilter;

  /// Listado de categorías disponibles para filtrar en backend (`cat_id`).
  final List<Category> categories;

  /// Identificador de la categoría seleccionada (`null` = Todas).
  final int? selectedCategoryId;

  /// Callback al cambiar el texto de búsqueda (gestionado con debounce en el handler).
  final ValueChanged<String> onSearch;

  /// Callback al seleccionar un chip de segmentación.
  final ValueChanged<String> onFilterChanged;

  /// Callback al elegir o limpiar la categoría (`cat_id`).
  final ValueChanged<int?> onCategoryChanged;

  /// Callback para restablecer texto, categoría y chip a su estado inicial.
  final VoidCallback onClearFilters;

  /// Crea los controles de búsqueda y filtrado [SearchAndFilters].
  const SearchAndFilters({
    super.key,
    required this.searchQuery,
    required this.selectedFilter,
    required this.categories,
    required this.selectedCategoryId,
    required this.onSearch,
    required this.onFilterChanged,
    required this.onCategoryChanged,
    required this.onClearFilters,
  });

  @override
  State<SearchAndFilters> createState() => _SearchAndFiltersState();
}

class _SearchAndFiltersState extends State<SearchAndFilters> {
  late final TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.searchQuery);
  }

  @override
  void didUpdateWidget(covariant SearchAndFilters oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Sincroniza el TextField cuando el handler limpia los filtros externamente.
    if (widget.searchQuery != _searchController.text &&
        widget.searchQuery.isEmpty) {
      _searchController.clear();
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool get _hasActiveFilters =>
      widget.searchQuery.trim().isNotEmpty ||
      widget.selectedCategoryId != null ||
      widget.selectedFilter != 'all';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 1. Campo de búsqueda libre (nombre, ID, EAN, variante, categoría, color)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: TextField(
            controller: _searchController,
            onChanged: (value) {
              setState(() {});
              widget.onSearch(value);
            },
            textInputAction: TextInputAction.search,
            decoration: InputDecoration(
              hintText: 'Buscar por Nombre, ID, EAN, SKU o Categoría...',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      tooltip: 'Limpiar búsqueda',
                      icon: const Icon(Icons.close),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                        widget.onSearch('');
                      },
                    )
                  : null,
              filled: true,
              fillColor: colorScheme.surfaceContainerLowest,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
        const SizedBox(height: 10),

        // 2. Selector de categoría (cat_id) + botón rápido de limpiar todo
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<int?>(
                  initialValue: widget.categories
                          .any((c) => c.id == widget.selectedCategoryId)
                      ? widget.selectedCategoryId
                      : null,
                  isExpanded: true,
                  decoration: InputDecoration(
                    labelText: 'Categoría',
                    prefixIcon: const Icon(Icons.category_outlined, size: 18),
                    filled: true,
                    fillColor: colorScheme.surfaceContainerLowest,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  items: [
                    const DropdownMenuItem<int?>(
                      value: null,
                      child: Text('Todas las categorías'),
                    ),
                    ...widget.categories.map(
                      (cat) => DropdownMenuItem<int?>(
                        value: cat.id,
                        child: Text(cat.name, overflow: TextOverflow.ellipsis),
                      ),
                    ),
                  ],
                  onChanged: widget.onCategoryChanged,
                ),
              ),
              if (_hasActiveFilters) ...[
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    _searchController.clear();
                    setState(() {});
                    widget.onClearFilters();
                  },
                  icon: const Icon(Icons.filter_alt_off_outlined, size: 18),
                  label: const Text('Limpiar'),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 10),

        // 3. Chips de segmentación operativa (incluye inactivos y sin stock del endpoint irrestricto)
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              _FilterChip(
                label: 'Todos',
                isSelected: widget.selectedFilter == 'all',
                onTap: () => widget.onFilterChanged('all'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Con Foto',
                isSelected: widget.selectedFilter == 'with_photo',
                onTap: () => widget.onFilterChanged('with_photo'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'En Vitrina',
                isSelected: widget.selectedFilter == 'showcase',
                onTap: () => widget.onFilterChanged('showcase'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Stock Crítico',
                isSelected: widget.selectedFilter == 'critical',
                onTap: () => widget.onFilterChanged('critical'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Sin Stock',
                isSelected: widget.selectedFilter == 'out_of_stock',
                onTap: () => widget.onFilterChanged('out_of_stock'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Ocultos',
                isSelected: widget.selectedFilter == 'hidden',
                onTap: () => widget.onFilterChanged('hidden'),
              ),
              const SizedBox(width: 8),
              _FilterChip(
                label: 'Inactivos',
                isSelected: widget.selectedFilter == 'inactive',
                onTap: () => widget.onFilterChanged('inactive'),
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