// apps/admin-portal/lib/screens/product_form/widgets/subcategory_form_dialog.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/config/subcategory_icon_registry.dart';
import 'package:admin_portal/models/product/subcategory_model.dart';

/// Firma del callback de persistencia ejecutado al confirmar [SubcategoryFormDialog].
typedef SubcategorySubmitCallback = Future<Subcategory> Function({
  required String name,
  required SubcategoryIconType iconType,
  String? iconName,
  String? imageUrl,
});

/// Diálogo modal para crear o editar una [Subcategory] con selector híbrido de iconografía.
///
/// Permite conmutar explícitamente mediante [SubcategoryIconType] entre:
/// - `ICONO`: grilla cuadrada buscable de iconos Lucide estándar (`subc_icono`).
/// - `IMAGEN`: URL absoluta a un SVG o PNG propio en Cloudflare R2 (`subc_imagen_url`).
class SubcategoryFormDialog extends StatefulWidget {
  /// Subcategoría existente a editar; `null` abre el modal en modo creación.
  final Subcategory? initialSubcategory;

  /// Callback asíncrono invocado al confirmar el formulario. Debe retornar la
  /// subcategoría persistida o lanzar una excepción ante errores de validación.
  final SubcategorySubmitCallback onSubmit;

  /// Crea el modal de alta/edición de subcategoría.
  const SubcategoryFormDialog({
    super.key,
    this.initialSubcategory,
    required this.onSubmit,
  });

  /// Abre el modal de forma declarativa y retorna la [Subcategory] guardada o `null`.
  static Future<Subcategory?> show(
    BuildContext context, {
    Subcategory? initialSubcategory,
    required SubcategorySubmitCallback onSubmit,
  }) {
    return showDialog<Subcategory>(
      context: context,
      barrierDismissible: false,
      builder: (_) => SubcategoryFormDialog(
        initialSubcategory: initialSubcategory,
        onSubmit: onSubmit,
      ),
    );
  }

  @override
  State<SubcategoryFormDialog> createState() => _SubcategoryFormDialogState();
}

class _SubcategoryFormDialogState extends State<SubcategoryFormDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _imageUrlController;
  final TextEditingController _iconSearchController = TextEditingController();

  late SubcategoryIconType _iconType;
  String? _selectedIconKey;
  String _iconQuery = '';
  bool _isSaving = false;
  String? _serverError;

  @override
  void initState() {
    super.initState();
    final initial = widget.initialSubcategory;
    _nameController = TextEditingController(text: initial?.name ?? '');
    _imageUrlController = TextEditingController(text: initial?.imageUrl ?? '');
    _iconType = initial?.iconType ?? SubcategoryIconType.icono;
    _selectedIconKey =
        initial?.iconName ?? SubcategoryIconRegistry.options.first.lucideKey;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _imageUrlController.dispose();
    _iconSearchController.dispose();
    super.dispose();
  }

  /// Verifica localmente si la URL ingresada apunta a un recurso `.svg`.
  bool _isSvgUrl(String rawUrl) {
    final trimmed = rawUrl.trim();
    if (trimmed.isEmpty) return false;
    final cleanPath =
        Uri.tryParse(trimmed)?.path.toLowerCase() ?? trimmed.toLowerCase();
    return cleanPath.endsWith('.svg');
  }

  Future<void> _handleSave() async {
    if (_isSaving || !_formKey.currentState!.validate()) return;

    setState(() {
      _isSaving = true;
      _serverError = null;
    });

    try {
      // Envía el discriminador activo y limpia el campo inactivo para mantener consistencia en BD.
      final isStandardIcon = _iconType == SubcategoryIconType.icono;
      final saved = await widget.onSubmit(
        name: _nameController.text.trim(),
        iconType: _iconType,
        iconName: isStandardIcon ? _selectedIconKey : null,
        imageUrl: isStandardIcon ? null : _imageUrlController.text.trim(),
      );
      if (!mounted) return;
      Navigator.of(context).pop(saved);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _serverError = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final isEditing = widget.initialSubcategory != null;
    final isStandardIcon = _iconType == SubcategoryIconType.icono;

    // Filtra la grilla cuadrada de iconos por etiqueta en español o clave Lucide.
    final filteredIcons = SubcategoryIconRegistry.options.where((opt) {
      if (_iconQuery.isEmpty) return true;
      return opt.label.toLowerCase().contains(_iconQuery) ||
          opt.lucideKey.toLowerCase().contains(_iconQuery);
    }).toList();

    return AlertDialog(
      backgroundColor: colorScheme.surfaceContainerLowest,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      titlePadding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
      contentPadding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
      actionsPadding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isStandardIcon
                  ? SubcategoryIconRegistry.resolve(_selectedIconKey)
                  : (_isSvgUrl(_imageUrlController.text)
                      ? Icons.polyline_outlined
                      : Icons.image_outlined),
              size: 20,
              color: colorScheme.onPrimaryContainer,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              isEditing ? 'Editar Subcategoría' : 'Nueva Subcategoría',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: 440,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Mensaje inline si FastAPI devuelve 422 o conflicto de nombre duplicado.
                if (_serverError != null) ...[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: colorScheme.errorContainer,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      _serverError!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.onErrorContainer,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],

                // 1. Nombre único de subcategoría (subc_nombre).
                TextFormField(
                  controller: _nameController,
                  maxLength: 100,
                  decoration: const InputDecoration(
                    labelText: 'Nombre de la Subcategoría *',
                    hintText: 'Ej: Dietas Medicadas',
                    border: OutlineInputBorder(),
                    isDense: true,
                    counterText: '',
                  ),
                  validator: (v) => v == null || v.trim().isEmpty
                      ? 'El nombre es obligatorio'
                      : null,
                ),
                const SizedBox(height: 14),

                // 2. Selector explícito de discriminador (subc_tipo_icono: ICONO | IMAGEN).
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Representación Visual',
                      style: theme.textTheme.labelMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.secondaryContainer,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Text(
                        isStandardIcon
                            ? 'ICONO: ${_selectedIconKey ?? '-'}'
                            : 'IMAGEN / SVG',
                        style: theme.textTheme.labelSmall?.copyWith(
                          color: colorScheme.onSecondaryContainer,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                SizedBox(
                  width: double.infinity,
                  child: SegmentedButton<SubcategoryIconType>(
                    segments: const [
                      ButtonSegment<SubcategoryIconType>(
                        value: SubcategoryIconType.icono,
                        icon: Icon(Icons.grid_view_rounded, size: 16),
                        label: Text('Icono Estándar'),
                      ),
                      ButtonSegment<SubcategoryIconType>(
                        value: SubcategoryIconType.imagen,
                        icon: Icon(Icons.polyline_outlined, size: 16),
                        label: Text('SVG / Imagen'),
                      ),
                    ],
                    selected: {_iconType},
                    onSelectionChanged: (selection) {
                      setState(() => _iconType = selection.first);
                    },
                  ),
                ),
                const SizedBox(height: 12),

                // 3. Panel condicional según el discriminador activo.
                if (isStandardIcon) ...[
                  SizedBox(
                    height: 36,
                    child: TextField(
                      controller: _iconSearchController,
                      textAlignVertical: TextAlignVertical.center,
                      onChanged: (v) =>
                          setState(() => _iconQuery = v.trim().toLowerCase()),
                      style: theme.textTheme.bodySmall,
                      decoration: InputDecoration(
                        hintText: 'Buscar icono (ej. Peluquería, Scissors)...',
                        prefixIcon: const Icon(Icons.search, size: 16),
                        isDense: true,
                        filled: true,
                        fillColor: colorScheme.surfaceContainerLow,
                        contentPadding: const EdgeInsets.only(right: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(
                            color: colorScheme.outlineVariant
                                .withValues(alpha: 0.5),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Grilla cuadrada scrollable de iconos Lucide.
                  Container(
                    height: 200,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: colorScheme.outlineVariant.withValues(alpha: 0.4),
                      ),
                    ),
                    child: filteredIcons.isEmpty
                        ? Center(
                            child: Text(
                              'Sin iconos coincidentes',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          )
                        : GridView.builder(
                            itemCount: filteredIcons.length,
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 4,
                              mainAxisSpacing: 8,
                              crossAxisSpacing: 8,
                              childAspectRatio: 1,
                            ),
                            itemBuilder: (_, index) {
                              final option = filteredIcons[index];
                              final isSelected =
                                  option.lucideKey == _selectedIconKey;

                              return InkWell(
                                onTap: () => setState(
                                  () => _selectedIconKey = option.lucideKey,
                                ),
                                borderRadius: BorderRadius.circular(12),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 140),
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? colorScheme.primary
                                        : colorScheme.surfaceContainerLowest,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isSelected
                                          ? colorScheme.primary
                                          : colorScheme.outlineVariant
                                              .withValues(alpha: 0.5),
                                      width: isSelected ? 1.5 : 1,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        option.materialIcon,
                                        size: 22,
                                        color: isSelected
                                            ? colorScheme.onPrimary
                                            : colorScheme.onSurface,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        option.label,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        textAlign: TextAlign.center,
                                        style:
                                            theme.textTheme.labelSmall?.copyWith(
                                          fontSize: 10,
                                          color: isSelected
                                              ? colorScheme.onPrimary
                                              : colorScheme.onSurfaceVariant,
                                          fontWeight: isSelected
                                              ? FontWeight.w600
                                              : FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                ] else ...[
                  TextFormField(
                    controller: _imageUrlController,
                    maxLength: 255,
                    onChanged: (_) => setState(() {}),
                    decoration: const InputDecoration(
                      labelText: 'URL de SVG / Imagen Específica *',
                      hintText: 'https://cdn.../subcategoria.svg',
                      prefixIcon: Icon(Icons.link),
                      border: OutlineInputBorder(),
                      isDense: true,
                      counterText: '',
                    ),
                    validator: (v) {
                      if (_iconType != SubcategoryIconType.imagen) return null;
                      if (v == null || v.trim().isEmpty) {
                        return 'Ingresa la URL del SVG o cambia a Icono Estándar';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: colorScheme.outlineVariant.withValues(alpha: 0.4),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          _isSvgUrl(_imageUrlController.text)
                              ? Icons.polyline_outlined
                              : Icons.image_outlined,
                          size: 20,
                          color: colorScheme.primary,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _imageUrlController.text.trim().isEmpty
                                ? 'Pega la URL de tu asset SVG/PNG en Cloudflare R2.'
                                : _isSvgUrl(_imageUrlController.text)
                                    ? 'Asset SVG detectado: se guardará como tipo IMAGEN.'
                                    : 'Imagen detectada: se guardará como tipo IMAGEN.',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSaving ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        FilledButton.icon(
          onPressed: _isSaving ? null : _handleSave,
          icon: _isSaving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.check),
          label: Text(isEditing ? 'Guardar Cambios' : 'Crear Subcategoría'),
        ),
      ],
    );
  }
}