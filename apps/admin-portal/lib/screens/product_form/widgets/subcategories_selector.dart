// apps/admin-portal/lib/screens/product_form/widgets/subcategories_selector.dart


// <!> bueno esto no muestra nada tiene que comunicarse con el bakend y traer las subcategoria a mostrar para agregar a este producto 

/*




GET
/api/subcategorias
Listar todas las subcategorías


Retorna la lista completa de subcategorías con sus iconos y URLs asociadas.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
[
  {
    "subc_nombre": "string",
    "subc_icono": "string",
    "subc_imagen_url": "string",
    "subc_id": 0
  }
]









*/


import 'package:flutter/material.dart';
import 'package:admin_portal/config/subcategory_icon_registry.dart';
import 'package:admin_portal/models/product/product.dart';

/// Selector dinámico e interactivo de subcategorías vinculadas al backend.
///
/// Orquesta la partición entre subcategorías asignadas y sugeridas, mantiene
/// el estado efímero de filtrado en UI y delega el renderizado en subwidgets
/// atómicos agnósticos al tenant.
class SubcategoriesSelector extends StatefulWidget {
  /// Catálogo maestro de subcategorías obtenidas desde la API del tenant.
  final List<Subcategory> availableSubcategories;

  /// Identificadores de las subcategorías actualmente seleccionadas.
  final List<int> selectedSubcategoryIds;

  /// Callback ejecutado al agregar o quitar una subcategoría mediante su ID.
  final ValueChanged<int> onSubcategoryToggled;

  /// Acción opcional para abrir el modal de alta o gestión de subcategorías.
  final VoidCallback? onManagePressed;

  /// Extractor opcional para sobreescribir la URL de imagen de cada [Subcategory].
  final String? Function(Subcategory subcategory)? imageUrlBuilder;

  /// Crea el selector dinámico de subcategorías.
  const SubcategoriesSelector({
    super.key,
    required this.availableSubcategories,
    required this.selectedSubcategoryIds,
    required this.onSubcategoryToggled,
    this.onManagePressed,
    this.imageUrlBuilder,
  });

  @override
  State<SubcategoriesSelector> createState() => _SubcategoriesSelectorState();
}

class _SubcategoriesSelectorState extends State<SubcategoriesSelector> {
  final TextEditingController _mainSearchController = TextEditingController();
  final TextEditingController _suggestedFilterController =
      TextEditingController();

  // Oculto por defecto para mantener la densidad compacta de la captura;
  // el usuario puede desplegarlo cuando el catálogo crece.
  bool _showMainSearch = false;
  String _mainQuery = '';
  String _suggestedQuery = '';

  @override
  void dispose() {
    _mainSearchController.dispose();
    _suggestedFilterController.dispose();
    super.dispose();
  }

  void _toggleMainSearch() {
    setState(() {
      _showMainSearch = !_showMainSearch;
      if (!_showMainSearch) {
        _mainSearchController.clear();
        _mainQuery = '';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    // Particiona el catálogo en asignadas y disponibles en un único recorrido.
    final selectedItems = <Subcategory>[];
    final availableItems = <Subcategory>[];

    for (final sub in widget.availableSubcategories) {
      if (widget.selectedSubcategoryIds.contains(sub.id)) {
        selectedItems.add(sub);
      } else {
        availableItems.add(sub);
      }
    }

    final filteredSelected = selectedItems
        .where((s) => s.name.toLowerCase().contains(_mainQuery))
        .toList();

    final filteredSuggested = availableItems.where((s) {
      final name = s.name.toLowerCase();
      return name.contains(_mainQuery) && name.contains(_suggestedQuery);
    }).toList();

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: colorScheme.outlineVariant.withValues(alpha: 0.4),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Cabecera: título, píldora de conteo, lupa opcional y botón "+ Gestionar".
          _SelectorHeader(
            assignedCount: selectedItems.length,
            isSearchOpen: _showMainSearch,
            onToggleSearch: _toggleMainSearch,
            onManagePressed: widget.onManagePressed,
          ),

          // 2. Buscador global desplegable (evita ruido visual si no se necesita).
          if (_showMainSearch) ...[
            const SizedBox(height: 8),
            _MainSearchField(
              controller: _mainSearchController,
              onChanged: (value) =>
                  setState(() => _mainQuery = value.trim().toLowerCase()),
            ),
          ],

          // 3. Bloque de subcategorías asignadas (chips sólidos removibles).
          if (filteredSelected.isNotEmpty) ...[
            const SizedBox(height: 10),
            _SelectedChipsWrap(
              items: filteredSelected,
              imageUrlBuilder: widget.imageUrlBuilder,
              onRemove: widget.onSubcategoryToggled,
            ),
          ],

          const SizedBox(height: 12),

          // 4. Fila de sugerencias con contador y filtro rápido tipo píldora.
          _SuggestedFilterHeader(
            availableCount: filteredSuggested.length,
            controller: _suggestedFilterController,
            onChanged: (value) =>
                setState(() => _suggestedQuery = value.trim().toLowerCase()),
          ),
          const SizedBox(height: 8),

          // 5. Carrusel horizontal de subcategorías disponibles para asignar en 1 toque.
          _SuggestedChipsCarousel(
            items: filteredSuggested,
            hasAnyAvailable: availableItems.isNotEmpty,
            imageUrlBuilder: widget.imageUrlBuilder,
            onAdd: widget.onSubcategoryToggled,
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// SUBWIDGET 1: CABECERA DEL SELECTOR
// =============================================================================

/// Renderiza el título, la píldora de cantidad asignada, el toggle de búsqueda
/// global y el botón elevado `+ Gestionar`.
class _SelectorHeader extends StatelessWidget {
  final int assignedCount;
  final bool isSearchOpen;
  final VoidCallback onToggleSearch;
  final VoidCallback? onManagePressed;

  const _SelectorHeader({
    required this.assignedCount,
    required this.isSearchOpen,
    required this.onToggleSearch,
    required this.onManagePressed,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: Wrap(
            spacing: 6,
            runSpacing: 4,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                'Subcategorías y Etiquetas',
                style: theme.textTheme.labelMedium?.copyWith(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                  color: colorScheme.onSurface,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: colorScheme.secondaryContainer,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '$assignedCount asignadas',
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 10.5,
                    color: colorScheme.onSecondaryContainer,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Botón compacto para mostrar/ocultar el buscador general sin ocupar espacio fijo.
            IconButton(
              onPressed: onToggleSearch,
              tooltip: isSearchOpen ? 'Ocultar buscador' : 'Buscar subcategoría',
              visualDensity: VisualDensity.compact,
              constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
              padding: EdgeInsets.zero,
              icon: Icon(
                isSearchOpen ? Icons.search_off : Icons.search,
                size: 16,
                color: isSearchOpen
                    ? colorScheme.primary
                    : colorScheme.onSurfaceVariant,
              ),
            ),
            if (onManagePressed != null) ...[
              const SizedBox(width: 4),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: colorScheme.shadow.withValues(alpha: 0.06),
                      blurRadius: 3,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: InkWell(
                  onTap: onManagePressed,
                  borderRadius: BorderRadius.circular(8),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 5,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.add, size: 14, color: colorScheme.secondary),
                        const SizedBox(width: 4),
                        Text(
                          'Gestionar',
                          style: theme.textTheme.labelSmall?.copyWith(
                            fontSize: 11,
                            color: colorScheme.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ],
    );
  }
}

// =============================================================================
// SUBWIDGET 2: BUSCADOR GLOBAL DESPLEGABLE
// =============================================================================

/// Campo de búsqueda global para filtrar simultáneamente asignadas y sugeridas.
class _MainSearchField extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  const _MainSearchField({
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return SizedBox(
      height: 34,
      child: TextField(
        controller: controller,
        textAlignVertical: TextAlignVertical.center,
        onChanged: onChanged,
        style: theme.textTheme.bodySmall?.copyWith(fontSize: 12),
        decoration: InputDecoration(
          hintText: 'Buscar subcategoría o etiqueta...',
          hintStyle: theme.textTheme.bodySmall?.copyWith(
            fontSize: 11.5,
            color: colorScheme.onSurfaceVariant.withValues(alpha: 0.55),
          ),
          prefixIcon: Icon(
            Icons.search,
            size: 15,
            color: colorScheme.onSurfaceVariant,
          ),
          prefixIconConstraints: const BoxConstraints(
            minWidth: 32,
            minHeight: 32,
          ),
          isDense: true,
          filled: true,
          fillColor: colorScheme.surfaceContainerLowest,
          contentPadding: const EdgeInsets.only(right: 10),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(
              color: colorScheme.outlineVariant.withValues(alpha: 0.6),
            ),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(
              color: colorScheme.outlineVariant.withValues(alpha: 0.6),
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// SUBWIDGET 3: LISTA DE CHIPS ASIGNADOS
// =============================================================================

/// Agrupa en flujo adaptable (`Wrap`) los chips sólidos de subcategorías activas.
class _SelectedChipsWrap extends StatelessWidget {
  final List<Subcategory> items;
  final String? Function(Subcategory subcategory)? imageUrlBuilder;
  final ValueChanged<int> onRemove;

  const _SelectedChipsWrap({
    required this.items,
    required this.imageUrlBuilder,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: items.map((sub) {
        return _SelectedSubcategoryChip(
          subcategory: sub,
          overrideImageUrl: imageUrlBuilder?.call(sub),
          onRemove: () => onRemove(sub.id),
        );
      }).toList(),
    );
  }
}

/// Chip sólido de subcategoría asignada con icono/SVG resuelto y cierre circular.
class _SelectedSubcategoryChip extends StatelessWidget {
  final Subcategory subcategory;
  final String? overrideImageUrl;
  final VoidCallback onRemove;

  const _SelectedSubcategoryChip({
    required this.subcategory,
    required this.overrideImageUrl,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Container(
      padding: const EdgeInsets.only(left: 10, right: 6, top: 4, bottom: 4),
      decoration: BoxDecoration(
        color: colorScheme.primary,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.08),
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _SubcategoryVisualBadge(
            subcategory: subcategory,
            overrideImageUrl: overrideImageUrl,
            foregroundColor: colorScheme.onPrimary,
          ),
          const SizedBox(width: 6),
          Text(
            subcategory.name,
            style: theme.textTheme.labelSmall?.copyWith(
              fontSize: 11.5,
              color: colorScheme.onPrimary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 4),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onRemove,
              customBorder: const CircleBorder(),
              hoverColor: colorScheme.onPrimary.withValues(alpha: 0.2),
              splashColor: colorScheme.onPrimary.withValues(alpha: 0.3),
              child: Padding(
                padding: const EdgeInsets.all(2),
                child: Icon(
                  Icons.close,
                  size: 12,
                  color: colorScheme.onPrimary,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// SUBWIDGET 4: SUBCABECERA Y FILTRO DE SUGERIDAS
// =============================================================================

/// Muestra el contador de sugerencias disponibles y el mini filtro tipo píldora.
class _SuggestedFilterHeader extends StatelessWidget {
  final int availableCount;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;

  const _SuggestedFilterHeader({
    required this.availableCount,
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Sugeridas:',
                style: theme.textTheme.labelSmall?.copyWith(
                  fontSize: 11,
                  color: colorScheme.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  '($availableCount disponibles)',
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.labelSmall?.copyWith(
                    fontSize: 11,
                    color: colorScheme.secondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        SizedBox(
          width: 155,
          height: 28,
          child: TextField(
            controller: controller,
            textAlignVertical: TextAlignVertical.center,
            onChanged: onChanged,
            style: theme.textTheme.labelSmall?.copyWith(fontSize: 11),
            decoration: InputDecoration(
              hintText: 'Filtrar sugerencias...',
              hintStyle: theme.textTheme.labelSmall?.copyWith(
                fontSize: 11,
                color: colorScheme.onSurfaceVariant.withValues(alpha: 0.55),
              ),
              prefixIcon: Icon(
                Icons.filter_list,
                size: 13,
                color: colorScheme.onSurfaceVariant,
              ),
              prefixIconConstraints: const BoxConstraints(
                minWidth: 26,
                minHeight: 26,
              ),
              isDense: true,
              filled: true,
              fillColor: colorScheme.surfaceContainerLowest,
              contentPadding: const EdgeInsets.only(right: 8),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(999),
                borderSide: BorderSide(
                  color: colorScheme.outlineVariant.withValues(alpha: 0.6),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(999),
                borderSide: BorderSide(
                  color: colorScheme.outlineVariant.withValues(alpha: 0.6),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(999),
                borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// SUBWIDGET 5: CARRUSEL HORIZONTAL DE SUGERIDAS
// =============================================================================

/// Carrusel horizontal de subcategorías sugeridas con estado vacío amigable.
class _SuggestedChipsCarousel extends StatelessWidget {
  final List<Subcategory> items;
  final bool hasAnyAvailable;
  final String? Function(Subcategory subcategory)? imageUrlBuilder;
  final ValueChanged<int> onAdd;

  const _SuggestedChipsCarousel({
    required this.items,
    required this.hasAnyAvailable,
    required this.imageUrlBuilder,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    if (items.isEmpty) {
      return Text(
        hasAnyAvailable
            ? 'Sin coincidencias para el filtro aplicado.'
            : 'Todas las subcategorías disponibles están asignadas.',
        style: theme.textTheme.bodySmall?.copyWith(
          fontSize: 11,
          color: colorScheme.onSurfaceVariant,
        ),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: items.map((sub) {
          return Padding(
            padding: const EdgeInsets.only(right: 5),
            child: _SuggestedSubcategoryChip(
              subcategory: sub,
              overrideImageUrl: imageUrlBuilder?.call(sub),
              onAdd: () => onAdd(sub.id),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// Chip delineado compacto para asignar una subcategoría sugerida con un toque.
class _SuggestedSubcategoryChip extends StatelessWidget {
  final Subcategory subcategory;
  final String? overrideImageUrl;
  final VoidCallback onAdd;

  const _SuggestedSubcategoryChip({
    required this.subcategory,
    required this.overrideImageUrl,
    required this.onAdd,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Material(
      color: colorScheme.surfaceContainerLowest,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        onTap: onAdd,
        borderRadius: BorderRadius.circular(999),
        splashColor: colorScheme.secondaryContainer,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: colorScheme.outlineVariant.withValues(alpha: 0.6),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.add, size: 12, color: colorScheme.secondary),
              const SizedBox(width: 4),
              if (subcategory.isImageActive ||
                  (overrideImageUrl != null &&
                      overrideImageUrl!.isNotEmpty)) ...[
                _SubcategoryVisualBadge(
                  subcategory: subcategory,
                  overrideImageUrl: overrideImageUrl,
                  foregroundColor: colorScheme.secondary,
                ),
                const SizedBox(width: 4),
              ],
              Text(
                subcategory.name,
                style: theme.textTheme.labelSmall?.copyWith(
                  fontSize: 11.5,
                  color: colorScheme.onSurface,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// =============================================================================
// SUBWIDGET 6: RESOLUTOR HÍBRIDO DE ICONO / IMAGEN
// =============================================================================

/// Renderiza la representación visual de la [Subcategory] respetando el
/// discriminador [SubcategoryIconType] (`IMAGEN` vs `ICONO`) con fallback seguro.
class _SubcategoryVisualBadge extends StatelessWidget {
  final Subcategory subcategory;
  final String? overrideImageUrl;
  final Color foregroundColor;

  const _SubcategoryVisualBadge({
    required this.subcategory,
    required this.overrideImageUrl,
    required this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final resolvedUrl = overrideImageUrl ?? subcategory.imageUrl;
    final shouldShowImage =
        subcategory.isImageActive &&
        resolvedUrl != null &&
        resolvedUrl.trim().isNotEmpty;

    final fallbackIcon = SubcategoryIconRegistry.resolve(subcategory.iconName);

    if (!shouldShowImage) {
      return Icon(fallbackIcon, size: 14, color: foregroundColor);
    }

    return ClipOval(
      child: Image.network(
        resolvedUrl,
        width: 15,
        height: 15,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) =>
            Icon(fallbackIcon, size: 14, color: foregroundColor),
      ),
    );
  }
}