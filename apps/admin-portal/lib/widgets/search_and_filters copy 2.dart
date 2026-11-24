// apps/admin-portal/lib/widgets/search_and_filters.dart
// Propósito: Barra de búsqueda compacta con acceso a menú/panel de filtros en el
// botón derecho (`Icons.tune`), chips activos removibles y sincronización con el backend.

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/category_model.dart';

/// Controles de búsqueda y segmentación para el catálogo administrativo.
///
/// Sigue el patrón `Screen + Handler`: mantiene únicamente el controlador local
/// del campo de texto y delega todas las intenciones de filtrado hacia `CatalogHandler`.
///
/// Para maximizar el espacio útil en móviles, la categoría (`cat_id`) y los
/// filtros de estado se abren desde el botón derecho (`Icons.tune`) en un panel
/// modal táctil, mostrando debajo únicamente los filtros activos cuando aplica.
class SearchAndFilters extends StatefulWidget {
  // ===========================================================================
  // 1. ESTADO Y CALLBACKS DELEGADOS POR EL HANDLER
  // ===========================================================================

  /// Texto de búsqueda activo actualmente en el estado padre.
  final String searchQuery;

  /// Filtro de estado activo (`all`, `with_photo`, `showcase`, `critical`, `out_of_stock`, `hidden`, `inactive`).
  final String selectedFilter;

  /// Listado dinámico de categorías disponibles para filtrar en backend (`cat_id`).
  final List<Category> categories;

  /// Identificador de la categoría seleccionada (`null` = Todas).
  final int? selectedCategoryId;

  /// Callback al escribir en el campo de búsqueda (gestionado con debounce en el handler).
  final ValueChanged<String> onSearch;

  /// Callback al seleccionar un filtro de segmentación.
  final ValueChanged<String> onFilterChanged;

  /// Callback al elegir o limpiar la categoría (`cat_id`).
  final ValueChanged<int?> onCategoryChanged;

  /// Callback para restablecer búsqueda, categoría y estado a su valor inicial.
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
  // ===========================================================================
  // 2. CONTROLADOR LOCAL Y METADATOS DE FILTRO
  // ===========================================================================

  late final TextEditingController _searchController;

  static const Map<String, String> _filterLabels = {
    'all': 'Todos',
    'with_photo': 'Con Foto',
    'showcase': 'En Vitrina',
    'critical': 'Stock Crítico',
    'out_of_stock': 'Sin Stock',
    'hidden': 'Ocultos',
    'inactive': 'Inactivos',
  };

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

  /// Cantidad de filtros secundarios activos (categoría y/o estado).
  int get _activeAdvancedFiltersCount {
    var count = 0;
    if (widget.selectedCategoryId != null) count++;
    if (widget.selectedFilter != 'all') count++;
    return count;
  }

  /// Resuelve el nombre legible de la categoría actualmente seleccionada.
  String? get _selectedCategoryName {
    if (widget.selectedCategoryId == null) return null;
    for (final cat in widget.categories) {
      if (cat.id == widget.selectedCategoryId) return cat.name;
    }
    return null;
  }

  // ===========================================================================
  // 3. PANEL MODAL DE FILTROS (BOTÓN DERECHO)
  // ===========================================================================

  /// Despliega el menú táctil con categoría (`cat_id`) y segmentación por estado.
  void _openFiltersSheet() {
    showModalBottomSheet<void>(
      context: context,
      useRootNavigator: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (_) => _FiltersSheetContent(
        categories: widget.categories,
        initialCategoryId: widget.selectedCategoryId,
        initialFilter: widget.selectedFilter,
        filterLabels: _filterLabels,
        onCategoryChanged: widget.onCategoryChanged,
        onFilterChanged: widget.onFilterChanged,
        onClearAll: () {
          _searchController.clear();
          setState(() {});
          widget.onClearFilters();
        },
      ),
    );
  }

  // ===========================================================================
  // 4. CONSTRUCCIÓN DE INTERFAZ
  // ===========================================================================

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final activeCount = _activeAdvancedFiltersCount;
    final categoryName = _selectedCategoryName;
    final hasAnyActive =
        activeCount > 0 || widget.searchQuery.trim().isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Barra compacta de búsqueda + botón limpiar texto + botón menú de filtros
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
              suffixIcon: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_searchController.text.isNotEmpty)
                    IconButton(
                      tooltip: 'Limpiar búsqueda',
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                        widget.onSearch('');
                      },
                    ),
                  IconButton(
                    tooltip: 'Filtrar por categoría y estado',
                    onPressed: _openFiltersSheet,
                    icon: Badge.count(
                      count: activeCount,
                      isLabelVisible: activeCount > 0,
                      backgroundColor: colorScheme.primary,
                      textColor: colorScheme.onPrimary,
                      child: Icon(
                        Icons.tune,
                        color: activeCount > 0
                            ? colorScheme.primary
                            : colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ],
              ),
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

        // Resumen compacto visible únicamente cuando hay filtros aplicados
        if (hasAnyActive && (categoryName != null || widget.selectedFilter != 'all'))
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: Wrap(
              spacing: 8,
              runSpacing: 6,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                if (categoryName != null)
                  InputChip(
                    label: Text('Cat: $categoryName'),
                    avatar: const Icon(Icons.category_outlined, size: 16),
                    onDeleted: () => widget.onCategoryChanged(null),
                    visualDensity: VisualDensity.compact,
                  ),
                if (widget.selectedFilter != 'all')
                  InputChip(
                    label: Text(
                      _filterLabels[widget.selectedFilter] ?? widget.selectedFilter,
                    ),
                    avatar: const Icon(Icons.filter_list, size: 16),
                    onDeleted: () => widget.onFilterChanged('all'),
                    visualDensity: VisualDensity.compact,
                  ),
                TextButton(
                  onPressed: () {
                    _searchController.clear();
                    setState(() {});
                    widget.onClearFilters();
                  },
                  style: TextButton.styleFrom(
                    visualDensity: VisualDensity.compact,
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                  ),
                  child: const Text('Limpiar todo'),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

// =============================================================================
// SUBCOMPONENTE PRIVADO: PANEL MODAL DE FILTROS (CATEGORÍA + ESTADO)
// =============================================================================

/// Contenido interactivo del panel de filtros desplegado desde el botón `Icons.tune`.
class _FiltersSheetContent extends StatefulWidget {
  final List<Category> categories;
  final int? initialCategoryId;
  final String initialFilter;
  final Map<String, String> filterLabels;
  final ValueChanged<int?> onCategoryChanged;
  final ValueChanged<String> onFilterChanged;
  final VoidCallback onClearAll;

  const _FiltersSheetContent({
    required this.categories,
    required this.initialCategoryId,
    required this.initialFilter,
    required this.filterLabels,
    required this.onCategoryChanged,
    required this.onFilterChanged,
    required this.onClearAll,
  });

  @override
  State<_FiltersSheetContent> createState() => _FiltersSheetContentState();
}

class _FiltersSheetContentState extends State<_FiltersSheetContent> {
  late int? _categoryId;
  late String _filter;

  @override
  void initState() {
    super.initState();
    _categoryId = widget.initialCategoryId;
    _filter = widget.initialFilter;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Cabecera del menú de filtros
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Filtros de Catálogo',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _categoryId = null;
                      _filter = 'all';
                    });
                    widget.onClearAll();
                  },
                  icon: const Icon(Icons.filter_alt_off_outlined, size: 18),
                  label: const Text('Limpiar'),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 1. Selector de categoría (consulta en backend vía `cat_id`)
            DropdownButtonFormField<int?>(
              initialValue:
                  widget.categories.any((c) => c.id == _categoryId)
                      ? _categoryId
                      : null,
              isExpanded: true,
              decoration: InputDecoration(
                labelText: 'Categoría',
                prefixIcon: const Icon(Icons.category_outlined, size: 20),
                filled: true,
                fillColor: colorScheme.surfaceContainerLow,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
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
              onChanged: (nextId) {
                setState(() => _categoryId = nextId);
                widget.onCategoryChanged(nextId);
              },
            ),
            const SizedBox(height: 16),

            // 2. Chips de segmentación operativa (incluye inactivos y sin stock)
            Text(
              'Estado del producto',
              style: theme.textTheme.labelLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: widget.filterLabels.entries.map((entry) {
                final isSelected = _filter == entry.key;
                return ChoiceChip(
                  label: Text(entry.value),
                  selected: isSelected,
                  selectedColor: colorScheme.primary,
                  labelStyle: TextStyle(
                    color: isSelected
                        ? colorScheme.onPrimary
                        : colorScheme.onSurfaceVariant,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                  backgroundColor: colorScheme.surfaceContainerLow,
                  side: BorderSide.none,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  onSelected: (_) {
                    setState(() => _filter = entry.key);
                    widget.onFilterChanged(entry.key);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 20),

            FilledButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Aplicar y cerrar'),
            ),
          ],
        ),
      ),
    );
  }
}