// apps/admin-portal/lib/widgets/product_qr_dialog.dart
// Propósito: Diálogo modal para generar, alternar entre enlace de vitrina y código
// interno (EAN/SKU), copiar y previsualizar el código QR de un producto.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:admin_portal/models/product/product.dart';
import 'package:admin_portal/repositories/product_repository.dart';

/// Diálogo modal encargado de renderizar el código QR de un [Product].
///
/// Soporta dos modos de codificación intercambiables en vivo:
/// - **Vitrina:** URL pública en la tienda web resuelta por el backend
///   (`GET /api/productos/{id}/qr`), ideal para carteles o compartir.
/// - **Cód. Interno:** Código de barras EAN/UPC o identificador `PROD-{id}`,
///   útil para etiquetado físico en estanterías y lectura rápida en caja.
class ProductQrDialog extends StatefulWidget {
  // ===========================================================================
  // 1. DEPENDENCIAS Y PARÁMETROS
  // ===========================================================================

  /// Producto del cual se generará y etiquetará el código QR.
  final Product product;

  /// Repositorio utilizado para consultar el payload canónico desde FastAPI.
  final ProductRepository repository;

  /// Crea el diálogo modal [ProductQrDialog].
  const ProductQrDialog({
    super.key,
    required this.product,
    required this.repository,
  });

  /// Método utilitario para desplegar el modal QR sobre cualquier [BuildContext].
  static Future<void> show(
    BuildContext context, {
    required Product product,
    required ProductRepository repository,
  }) {
    return showDialog<void>(
      context: context,
      builder: (_) => ProductQrDialog(product: product, repository: repository),
    );
  }

  @override
  State<ProductQrDialog> createState() => _ProductQrDialogState();
}

/// Estado reactivo de [ProductQrDialog] que coordina la carga remota con respaldo local.
class _ProductQrDialogState extends State<ProductQrDialog> {
  // ===========================================================================
  // 1. ESTADO REACTIVO DEL MODAL
  // ===========================================================================

  /// Indica si se está resolviendo el payload QR contra el endpoint de FastAPI.
  bool _isLoading = true;

  /// Alterna entre enlace público de vitrina (`false`) y código interno (`true`).
  bool _useInternalCode = false;

  /// Payload resuelto para vitrina pública (o código de respaldo si el endpoint no existe).
  late String _qrPayload;

  /// Código interno del producto (EAN/UPC si existe, o `PROD-{id}`).
  late String _internalCode;

  /// Dato final actualmente codificado dentro de la matriz [QrImageView].
  String get _activeData => _useInternalCode ? _internalCode : _qrPayload;

  // ===========================================================================
  // 2. CICLO DE VIDA Y RESOLUCIÓN DE PAYLOAD
  // ===========================================================================

  @override
  void initState() {
    super.initState();
    // Inicializa con código local inmediato para garantizar respaldo ante errores de red.
    _internalCode = (widget.product.barcode?.trim().isNotEmpty ?? false)
        ? widget.product.barcode!.trim()
        : 'PROD-${widget.product.id}';
    _qrPayload = _internalCode;
    _loadQr();
  }

  /// Consulta `GET /api/productos/{id}/qr` mediante [ProductRepository].
  ///
  /// Si el backend aún no expone el endpoint, el repositorio retorna un respaldo
  /// determinístico basado en EAN/ID para mantener operativo el modal.
  Future<void> _loadQr() async {
    final result = await widget.repository.getProductQrData(widget.product);
    if (!mounted) return;
    setState(() {
      _qrPayload = result.payload;
      _internalCode = result.internalCode;
      _isLoading = false;
    });
  }

  // ===========================================================================
  // 3. CONSTRUCCIÓN DE INTERFAZ
  // ===========================================================================

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return AlertDialog(
      icon: Icon(Icons.qr_code_2, color: colorScheme.primary, size: 32),
      title: Text(
        widget.product.name,
        maxLines: 2,
        overflow: TextOverflow.ellipsis,
        textAlign: TextAlign.center,
      ),
      content: SizedBox(
        width: 300,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Resumen comercial para identificar rápidamente el producto etiquetado.
            Text(
              '\$${widget.product.salePrice.toStringAsFixed(0)} · ID #${widget.product.id}',
              style: theme.textTheme.labelLarge?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),

            // Selector entre enlace público de tienda y código interno de depósito.
            SegmentedButton<bool>(
              segments: const [
                ButtonSegment<bool>(value: false, label: Text('Vitrina')),
                ButtonSegment<bool>(value: true, label: Text('Cód. Interno')),
              ],
              selected: {_useInternalCode},
              onSelectionChanged: (selection) =>
                  setState(() => _useInternalCode = selection.first),
            ),
            const SizedBox(height: 16),

            // Contenedor con alto contraste (surface/onSurface del tenant) para lectura óptica.
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colorScheme.outlineVariant),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 180,
                      height: 180,
                      child: Center(child: CircularProgressIndicator()),
                    )
                  : QrImageView(
                      data: _activeData,
                      version: QrVersions.auto,
                      size: 180,
                      eyeStyle: QrEyeStyle(
                        eyeShape: QrEyeShape.square,
                        color: colorScheme.onSurface,
                      ),
                      dataModuleStyle: QrDataModuleStyle(
                        dataModuleShape: QrDataModuleShape.square,
                        color: colorScheme.onSurface,
                      ),
                    ),
            ),
            const SizedBox(height: 10),

            // Muestra el texto plano codificado permitiendo seleccionarlo manualmente.
            SelectableText(
              _activeData,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton.icon(
          onPressed: () {
            Clipboard.setData(ClipboardData(text: _activeData));
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Código QR copiado al portapapeles'),
              ),
            );
          },
          icon: const Icon(Icons.copy_outlined, size: 18),
          label: const Text('Copiar'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cerrar'),
        ),
      ],
    );
  }
}