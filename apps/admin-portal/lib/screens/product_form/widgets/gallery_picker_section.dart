// lib/widgets/product_form/gallery_picker_section.dart

import 'package:flutter/material.dart';
import 'package:admin_portal/models/product/product.dart';
import 'form_section_card.dart';

class GalleryPickerSection extends StatelessWidget {
  final List<String> imageUrls;
  final VoidCallback onAddImage;
  final ValueChanged<int> onRemoveImage;
  final ValueChanged<int> onSetFeatured;

  const GalleryPickerSection({
    super.key,
    required this.imageUrls,
    required this.onAddImage,
    required this.onRemoveImage,
    required this.onSetFeatured,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

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
          '${imageUrls.length} Imágenes',
          style: theme.textTheme.labelSmall?.copyWith(
            color: colorScheme.onSecondaryContainer,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      child: Column(
        children: [
          // Imagen Portada Principal
          if (imageUrls.isNotEmpty)
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      imageUrls.first,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: colorScheme.surfaceContainerHighest,
                        child: const Icon(Icons.broken_image_outlined),
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
            )
          else
            Container(
              height: 140,
              decoration: BoxDecoration(
                color: colorScheme.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colorScheme.outlineVariant,
                  style: BorderStyle.solid,
                ),
              ),
              child: Center(
                child: TextButton.icon(
                  onPressed: onAddImage,
                  icon: const Icon(Icons.add_a_photo_outlined),
                  label: const Text('Subir Portada Principal'),
                ),
              ),
            ),
          const SizedBox(height: 10),

          // Miniaturas Secundarias + Botón Agregar
          SizedBox(
            height: 70,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: imageUrls.length + 1,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                if (index == imageUrls.length) {
                  return InkWell(
                    onTap: onAddImage,
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      width: 70,
                      decoration: BoxDecoration(
                        color: colorScheme.surfaceContainerHigh,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: colorScheme.outlineVariant),
                      ),
                      child: Icon(Icons.add_photo_alternate_outlined,
                          color: colorScheme.primary),
                    ),
                  );
                }

                return Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        imageUrls[index],
                        width: 70,
                        height: 70,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 2,
                      right: 2,
                      child: InkWell(
                        onTap: () => onRemoveImage(index),
                        child: Container(
                          decoration: BoxDecoration(
                            color: colorScheme.scrim.withValues(alpha: 0.6),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close, size: 14, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}