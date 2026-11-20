// apps/admin-portal/lib/widgets/product_form/gallery_picker_section.dart
// Propósito: Sección visual de galería multimedia con selector táctil (cámara y archivos) para Web móvil y nativo.

import 'package:flutter/material.dart';
import 'form_section_card.dart';

/// Sección atómica de presentación pura para gestionar la galería de fotos de un producto.
///
/// Sigue el patrón `Screen + Handler`: no invoca selectores de archivos ni sube
/// imágenes a FastAPI directamente, sino que expone intenciones claras hacia
/// `ProductFormHandler` (cámara, galería/archivos, eliminar y fijar portada).
///
/// En dispositivos móviles (tanto nativos como Web móvil), despliega un
/// `BottomSheet` táctil para que el usuario elija entre **Cámara** o **Archivos/Galería**
/// cuando se proveen [onPickFromCamera] y [onPickFromGallery].
class GalleryPickerSection extends StatelessWidget {
  // --- Estado y Dependencias ---

  /// Lista ordenada de URLs o Data URIs (`https://...`, `blob:...`, `data:image/...`).
  ///
  /// El índice `0` representa la imagen principal mostrada como portada en vitrina.
  final List<String> imageUrls;

  /// Callback de respaldo cuando el handler aún usa un único punto de entrada.
  ///
  /// Se ejecuta automáticamente si [onPickFromCamera] y [onPickFromGallery] son nulos.
  final VoidCallback? onAddImage;

  /// Callback disparado al elegir captura directa desde cámara (móvil / Web móvil).
  final VoidCallback? onPickFromCamera;

  /// Callback disparado al elegir una imagen desde la galería o explorador de archivos.
  final VoidCallback? onPickFromGallery;

  /// Callback disparado al presionar eliminar (`×`) pasando el índice de la miniatura.
  final ValueChanged<int> onRemoveImage;

  /// Callback disparado al tocar una miniatura secundaria para promoverla como portada (`index`).
  final ValueChanged<int> onSetFeatured;

  /// Límite máximo de imágenes permitido por el tenant (`TenantConfig.productSchema.maxImagesPerProduct`).
  final int maxImages;

  // --- Ciclo de Vida / Inicialización ---

  /// Crea la sección [GalleryPickerSection] con los callbacks del formulario padre.
  const GalleryPickerSection({
    super.key,
    required this.imageUrls,
    this.onAddImage,
    this.onPickFromCamera,
    this.onPickFromGallery,
    required this.onRemoveImage,
    required this.onSetFeatured,
    this.maxImages = 5,
  });

  // --- Acciones Públicas ---

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final canAddMore = imageUrls.length < maxImages;

    return FormSectionCard(
      icon: Icons.photo_library_outlined,
      title: 'Galería Multimedia',
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: colorScheme.secondaryContainer,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          '${imageUrls.length}/$maxImages Imágenes',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSecondaryContainer,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (imageUrls.isNotEmpty)
            _buildFeaturedPreview(context, colorScheme)
          else
            _buildEmptyDropZone(context, theme, colorScheme),
          const SizedBox(height: 10),
          SizedBox(
            height: 76,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: canAddMore ? imageUrls.length + 1 : imageUrls.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                if (canAddMore && index == imageUrls.length) {
                  return _buildAddTile(context, colorScheme);
                }
                return _buildThumbnailTile(context, colorScheme, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  // --- Helpers Privados ---

  /// Construye la vista previa panorámica (16:9) de la imagen de portada actual.
  Widget _buildFeaturedPreview(BuildContext context, ColorScheme colorScheme) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: AspectRatio(
            aspectRatio: 16 / 9,
            // Image.network en Web soporta tanto URLs remotas (R2) como blob:/data: locales tras seleccionar archivo.
            child: Image.network(
              imageUrls.first,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.broken_image_outlined,
                  color: colorScheme.outline,
                ),
              ),
            ),
          ),
        ),
        Positioned(
          top: 8,
          left: 8,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: colorScheme.primary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.star, size: 14, color: colorScheme.onPrimary),
                const SizedBox(width: 4),
                Text(
                  'Portada Vitrina',
                  style: TextStyle(
                    color: colorScheme.onPrimary,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  /// Renderiza el área vacía inicial con acceso rápido táctil para móvil y escritorio.
  Widget _buildEmptyDropZone(
    BuildContext context,
    ThemeData theme,
    ColorScheme colorScheme,
  ) {
    return InkWell(
      onTap: () => _handleAddTap(context),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        height: 140,
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outlineVariant),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.add_a_photo_outlined,
              size: 32,
              color: colorScheme.primary,
            ),
            const SizedBox(height: 8),
            Text(
              'Subir foto o tomar con cámara',
              style: theme.textTheme.labelLarge?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'JPG, PNG o WEBP (máx. $maxImages)',
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddTile(BuildContext context, ColorScheme colorScheme) {
    return InkWell(
      onTap: () => _handleAddTap(context),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: 76,
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: colorScheme.outlineVariant),
        ),
        child: Icon(
          Icons.add_photo_alternate_outlined,
          color: colorScheme.primary,
        ),
      ),
    );
  }

  /// Miniatura individual con acción de fijar como portada al tocar y botón de borrado.
  Widget _buildThumbnailTile(
    BuildContext context,
    ColorScheme colorScheme,
    int index,
  ) {
    final isFeatured = index == 0;

    return Stack(
      children: [
        InkWell(
          onTap: isFeatured ? null : () => onSetFeatured(index),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              border: isFeatured
                  ? Border.all(color: colorScheme.primary, width: 2)
                  : null,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(7),
              child: Image.network(
                imageUrls[index],
                width: 74,
                height: 74,
                fit: BoxFit.cover,
                // Previene excepciones sin capturar en Web/Móvil si una URL temporal o remota falla.
                errorBuilder: (_, __, ___) => Container(
                  width: 74,
                  height: 74,
                  color: colorScheme.surfaceContainerHighest,
                  child: Icon(
                    Icons.broken_image_outlined,
                    size: 20,
                    color: colorScheme.outline,
                  ),
                ),
              ),
            ),
          ),
        ),
        Positioned(
          top: 3,
          right: 3,
          child: InkWell(
            onTap: () => onRemoveImage(index),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: colorScheme.inverseSurface.withValues(alpha: 0.8),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.close,
                size: 14,
                color: colorScheme.onInverseSurface,
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// Abre un selector móvil-amigable entre cámara y archivos cuando ambos callbacks están disponibles.
  void _handleAddTap(BuildContext context) {
    if (onPickFromCamera == null && onPickFromGallery == null) {
      onAddImage?.call();
      return;
    }

    final colorScheme = Theme.of(context).colorScheme;

    // BottomSheet nativo con área táctil amplia, ideal para pulgares en navegador móvil.
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (onPickFromCamera != null)
                  ListTile(
                    leading: Icon(Icons.photo_camera_outlined, color: colorScheme.primary),
                    title: const Text('Tomar foto con cámara'),
                    subtitle: const Text('Ideal para fotografiar productos desde el celular'),
                    onTap: () {
                      Navigator.pop(sheetContext);
                      onPickFromCamera?.call();
                    },
                  ),
                if (onPickFromGallery != null)
                  ListTile(
                    leading: Icon(Icons.photo_library_outlined, color: colorScheme.primary),
                    title: const Text('Elegir de galería o archivos'),
                    subtitle: const Text('Seleccionar imagen guardada en el dispositivo'),
                    onTap: () {
                      Navigator.pop(sheetContext);
                      onPickFromGallery?.call();
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}