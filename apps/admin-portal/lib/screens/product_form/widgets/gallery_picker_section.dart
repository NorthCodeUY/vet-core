// apps/admin-portal/lib/screens/product_form/widgets/gallery_picker_section.dart
// Propósito: Sección visual de galería multimedia para gestionar portada, miniaturas
// y selección de imágenes locales o remotas en Web, Desktop y Mobile.

import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'form_section_card.dart';

/// Sección atómica de presentación pura para gestionar la galería de fotos de un producto.
///
/// Sigue el patrón `Screen + Handler`: no invoca selectores de archivos ni ejecuta
/// peticiones HTTP directamente, sino que delega todas las intenciones del usuario
/// hacia `ProductFormHandler` (cámara, galería/archivos, eliminar y fijar portada).
///
/// Soporta de forma unificada:
/// - **URLs remotas** provenientes de Cloudflare R2 (`https://...`).
/// - **Data URIs locales** generados tras seleccionar una imagen (`data:image/...;base64,...`).
class GalleryPickerSection extends StatelessWidget {
  // ===========================================================================
  // 1. ESTADO Y CALLBACKS (INMUTABLES DESDE EL HANDLER)
  // ===========================================================================

  /// Lista ordenada de fuentes de imagen (`https://...` o `data:image/...;base64,...`).
  ///
  /// Por contrato con el backend FastAPI, el índice `0` representa la imagen
  /// principal (`img_principal = true`) mostrada como portada en vitrina.
  final List<String> imageUrls;

  /// Callback de respaldo cuando el handler expone un único punto de entrada.
  ///
  /// Se utiliza únicamente si [onPickFromCamera] y [onPickFromGallery] son nulos.
  final VoidCallback? onAddImage;

  /// Callback disparado al elegir captura directa desde cámara (Android / iOS).
  final VoidCallback? onPickFromCamera;

  /// Callback disparado al elegir una imagen desde galería o explorador de archivos.
  final VoidCallback? onPickFromGallery;

  /// Callback disparado al presionar el botón eliminar (`×`) de una miniatura.
  final ValueChanged<int> onRemoveImage;

  /// Callback disparado al tocar una miniatura secundaria para promoverla al índice `0`.
  final ValueChanged<int> onSetFeatured;

  /// Cantidad máxima de imágenes permitidas por producto (`TenantConfig`).
  final int maxImages;

  // ===========================================================================
  // 2. CONSTRUCTOR
  // ===========================================================================

  /// Crea la sección [GalleryPickerSection] con los callbacks provistos por el handler.
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

  // ===========================================================================
  // 3. CONSTRUCCIÓN DE INTERFAZ PRINCIPAL
  // ===========================================================================

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
            _buildFeaturedPreview(colorScheme)
          else
            _buildEmptyDropZone(context, theme, colorScheme),
          const SizedBox(height: 10),
          // Tira horizontal con miniaturas ordenadas y botón de carga al final.
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
                return _buildThumbnailTile(colorScheme, index);
              },
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // 4. SUBWIDGETS DE PRESENTACIÓN
  // ===========================================================================

  /// Construye la vista previa panorámica (16:9) de la imagen principal (`index == 0`).
  Widget _buildFeaturedPreview(ColorScheme colorScheme) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: AspectRatio(
            aspectRatio: 16 / 9,
            child: _buildImageContent(imageUrls.first, colorScheme),
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

  /// Renderiza el área vacía inicial con acceso rápido táctil para cargar la primera foto.
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
              'JPG, PNG o WEBP · Máx. 5 MB ($maxImages fotos)',
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Renderiza el recuadro final de la tira horizontal para añadir una imagen adicional.
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

  /// Construye cada miniatura con acción de fijar como portada y botón de borrado (`×`).
  Widget _buildThumbnailTile(ColorScheme colorScheme, int index) {
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
                  : Border.all(color: colorScheme.outlineVariant),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: SizedBox(
                width: 74,
                height: 74,
                child: _buildImageContent(imageUrls[index], colorScheme),
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
                color: colorScheme.inverseSurface.withValues(alpha: 0.85),
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

  /// Renderiza de forma segura un Data URI local (`Image.memory`) o URL remota (`Image.network`).
  Widget _buildImageContent(String source, ColorScheme colorScheme) {
    if (source.startsWith('data:image/')) {
      final commaIndex = source.indexOf(',');
      if (commaIndex != -1) {
        try {
          final bytes = base64Decode(source.substring(commaIndex + 1));
          return Image.memory(
            bytes,
            fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => _buildBrokenImageFallback(colorScheme),
          );
        } catch (_) {
          // Captura Data URIs corruptos evitando que caiga el árbol de widgets.
          return _buildBrokenImageFallback(colorScheme);
        }
      }
    }

    return Image.network(
      source,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => _buildBrokenImageFallback(colorScheme),
    );
  }

  /// Placeholder visual cuando una imagen remota o local no logra decodificarse.
  Widget _buildBrokenImageFallback(ColorScheme colorScheme) {
    return Container(
      color: colorScheme.surfaceContainerHighest,
      child: Icon(
        Icons.broken_image_outlined,
        size: 22,
        color: colorScheme.outline,
      ),
    );
  }

  // ===========================================================================
  // 5. INTERACCIÓN DE SELECCIÓN (WEB VS NATIVO)
  // ===========================================================================

  /// Resuelve el flujo óptimo según plataforma para seleccionar o capturar una foto.
  ///
  /// En **Flutter Web** (`kIsWeb`), invoca directamente el selector nativo del
  /// navegador para preservar el *user-gesture* requerido por Chrome/Safari (que
  /// en dispositivos móviles ya ofrece cámara y galería en el mismo diálogo).
  /// En **Android/iOS**, despliega un `BottomSheet` explícito entre cámara y galería.
  void _handleAddTap(BuildContext context) {
    if (kIsWeb) {
      (onPickFromGallery ?? onAddImage)?.call();
      return;
    }

    if (onPickFromCamera == null && onPickFromGallery == null) {
      onAddImage?.call();
      return;
    }

    final colorScheme = Theme.of(context).colorScheme;

    showModalBottomSheet<void>(
      context: context,
      useRootNavigator: true,
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
                    leading: Icon(
                      Icons.photo_camera_outlined,
                      color: colorScheme.primary,
                    ),
                    title: const Text('Tomar foto con cámara'),
                    subtitle: const Text(
                      'Ideal para fotografiar productos desde el celular',
                    ),
                    onTap: () {
                      Navigator.of(sheetContext).pop();
                      onPickFromCamera?.call();
                    },
                  ),
                if (onPickFromGallery != null)
                  ListTile(
                    leading: Icon(
                      Icons.photo_library_outlined,
                      color: colorScheme.primary,
                    ),
                    title: const Text('Elegir de galería o archivos'),
                    subtitle: const Text(
                      'Seleccionar imagen guardada en el dispositivo',
                    ),
                    onTap: () {
                      Navigator.of(sheetContext).pop();
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