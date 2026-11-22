// apps/admin-portal/lib/screens/product_form/widgets/subcategories_selector.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';

/// Selector dinámico e interactivo de subcategorías vinculadas al backend.
///
/// Separa las subcategorías asignadas (chips sólidos removibles) de las
/// sugerencias disponibles (carrusel horizontal compacto y filtrable),
/// soportando miniaturas remotas del backend con fallback a icono Material.
class SubcategoriesSelector extends StatefulWidget {
  /// Catálogo maestro de subcategorías obtenidas desde la API del tenant.
  final List<Subcategory> availableSubcategories;

  /// Identificadores de las subcategorías actualmente seleccionadas.
  final List<int> selectedSubcategoryIds;

  /// Callback ejecutado al agregar o quitar una subcategoría mediante su ID.
  final ValueChanged<int> onSubcategoryToggled;

  /// Acción opcional para abrir la gestión rápida de subcategorías.
  final VoidCallback? onManagePressed;

  /// Resuelve la URL de imagen de cada [Subcategory] sin acoplar el widget
  /// a un nombre de propiedad específico si el modelo evoluciona.
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
  // Estado efímero estrictamente visual para filtrado local en tiempo real.
  final TextEditingController _mainSearchController = TextEditingController();
  final TextEditingController _suggestedFilterController =
      TextEditingController();

  String _mainQuery = '';
  String _suggestedQuery = '';

  @override
  void dispose() {
    _mainSearchController.dispose();
    _suggestedFilterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Resuelve paleta y tipografía desde el tema activo del tenant (Zero Hardcoding).
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

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

    // Aplica el buscador general y refina la fila de sugerencias con el mini filtro.
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
          // Cabecera: título, contador tipo píldora y botón "+ Gestionar" con sombra suave.
          Row(
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
                        fontWeight: FontWeight.w600,
                        color: colorScheme.onSurface,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 7,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.secondaryContainer,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        '${selectedItems.length} asignadas',
                        style: theme.textTheme.labelSmall?.copyWith(
                          fontSize: 11,
                          color: colorScheme.onSecondaryContainer,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              if (widget.onManagePressed != null)
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
                    onTap: widget.onManagePressed,
                    borderRadius: BorderRadius.circular(8),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 5,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.add,
                            size: 14,
                            color: colorScheme.secondary,
                          ),
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
          ),
          const SizedBox(height: 8),

          // Buscador global compacto (36px) con centrado vertical exacto en Web y Mobile.
          SizedBox(
            height: 36,
            child: TextField(
              controller: _mainSearchController,
              textAlignVertical: TextAlignVertical.center,
              onChanged: (value) =>
                  setState(() => _mainQuery = value.trim().toLowerCase()),
              style: theme.textTheme.bodySmall?.copyWith(fontSize: 12),
              decoration: InputDecoration(
                hintText: 'Buscar subcategoría o etiqueta...',
                hintStyle: theme.textTheme.bodySmall?.copyWith(
                  fontSize: 12,
                  color: colorScheme.onSurfaceVariant.withValues(alpha: 0.55),
                ),
                prefixIcon: Icon(
                  Icons.search,
                  size: 16,
                  color: colorScheme.onSurfaceVariant,
                ),
                prefixIconConstraints: const BoxConstraints(
                  minWidth: 34,
                  minHeight: 34,
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
          ),

          // Chips sólidos de subcategorías asignadas (idénticos al bloque superior de la captura).
          if (filteredSelected.isNotEmpty) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: filteredSelected.map((sub) {
                return _SelectedSubcategoryChip(
                  subcategory: sub,
                  imageUrl: widget.imageUrlBuilder?.call(sub),
                  onRemove: () => widget.onSubcategoryToggled(sub.id),
                );
              }).toList(),
            ),
          ],

          const SizedBox(height: 10),

          // Subcabecera de sugerencias + filtro tipo píldora alineado a la derecha.
          Row(
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
                        '(${filteredSuggested.length} disponibles)',
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
              // Mini filtro tipo píldora (28px de alto) alineado exactamente como en la captura.
              SizedBox(
                width: 155,
                height: 28,
                child: TextField(
                  controller: _suggestedFilterController,
                  textAlignVertical: TextAlignVertical.center,
                  onChanged: (value) => setState(
                    () => _suggestedQuery = value.trim().toLowerCase(),
                  ),
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
                      borderSide: BorderSide(
                        color: colorScheme.primary,
                        width: 1.5,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Carrusel horizontal de chips delineados compactos (+ Nombre).
          if (filteredSuggested.isEmpty)
            Text(
              availableItems.isEmpty
                  ? 'Todas las subcategorías disponibles están asignadas.'
                  : 'Sin coincidencias para el filtro aplicado.',
              style: theme.textTheme.bodySmall?.copyWith(
                fontSize: 11,
                color: colorScheme.onSurfaceVariant,
              ),
            )
          else
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: filteredSuggested.map((sub) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 5),
                    child: _SuggestedSubcategoryChip(
                      subcategory: sub,
                      imageUrl: widget.imageUrlBuilder?.call(sub),
                      onAdd: () => widget.onSubcategoryToggled(sub.id),
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }
}

/// Chip sólido de subcategoría asignada con sombra ligera, imagen del backend y cierre limpio.
class _SelectedSubcategoryChip extends StatelessWidget {
  final Subcategory subcategory;
  final String? imageUrl;
  final VoidCallback onRemove;

  const _SelectedSubcategoryChip({
    required this.subcategory,
    required this.imageUrl,
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
          _SubcategoryAvatar(
            imageUrl: imageUrl,
            fallbackIcon: Icons.sell_outlined,
            iconColor: colorScheme.onPrimary,
          ),
          const SizedBox(width: 5),
          Text(
            subcategory.name,
            style: theme.textTheme.labelSmall?.copyWith(
              fontSize: 11.5,
              color: colorScheme.onPrimary,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 4),
          // Botón circular para remover sin recuadro de hover cuadrado.
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

/// Chip delineado compacto para agregar una subcategoría sugerida al producto.
class _SuggestedSubcategoryChip extends StatelessWidget {
  final Subcategory subcategory;
  final String? imageUrl;
  final VoidCallback onAdd;

  const _SuggestedSubcategoryChip({
    required this.subcategory,
    required this.imageUrl,
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
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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
              if (imageUrl != null && imageUrl!.isNotEmpty) ...[
                _SubcategoryAvatar(
                  imageUrl: imageUrl,
                  fallbackIcon: Icons.label_outline,
                  iconColor: colorScheme.secondary,
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

/// Renderiza la imagen de subcategoría enviada por el backend con degradación
/// elegante a un icono Material si la URL es nula o falla la descarga.
class _SubcategoryAvatar extends StatelessWidget {
  final String? imageUrl;
  final IconData fallbackIcon;
  final Color iconColor;

  const _SubcategoryAvatar({
    required this.imageUrl,
    required this.fallbackIcon,
    required this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return Icon(fallbackIcon, size: 14, color: iconColor);
    }

    return ClipOval(
      child: Image.network(
        imageUrl!,
        width: 15,
        height: 15,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) =>
            Icon(fallbackIcon, size: 14, color: iconColor),
      ),
    );
  }
}