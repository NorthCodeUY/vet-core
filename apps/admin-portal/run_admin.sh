#!/bin/bash
# =============================================================================
# ORQUESTADOR DE DESARROLLO FLUTTER MULTI-TENANT (run_admin.sh)
# =============================================================================

TENANT=$1
DEVICE=${2:-chrome} # Por defecto corre en Chrome, pero puedes pasar 'linux'

# 1. Validación de parámetros
if [ -z "$TENANT" ]; then
  echo "❌ Error: Debes especificar un tenant."
  echo "👉 Uso: ./run_admin.sh [valeria | flordeloto] [chrome | linux]"
  exit 1
fi

CLIENT_DIR="../../clients/$TENANT"

if [ ! -d "$CLIENT_DIR" ]; then
  echo "❌ Error: No existe el directorio de cliente: $CLIENT_DIR"
  exit 1
fi

# 2. Mapeo de puertos de desarrollo (Igual que en run_desarrollo.py)
case $TENANT in
  "valeria" | "veterinaria")
    PORT=8000
    ;;
  "flordeloto")
    PORT=8001
    ;;
  *)
    PORT=8000
    ;;
esac

echo "============================================================"
echo "🚀 [VETCORE SAAS] - INICIANDO PORTAL ADMINISTRATIVO"
echo "🏢 Tenant Activo : $TENANT"
echo "🌐 Conectando a  : http://localhost:$PORT"
echo "📱 Dispositivo   : $DEVICE"
echo "============================================================"

# 3. Preparación de Assets en apps/admin-portal/assets/tenant/
mkdir -p assets/tenant

# Enlace simbólico o copia del config.json y assets del cliente
cp "$CLIENT_DIR/config.json" assets/tenant/config.json

if [ -d "$CLIENT_DIR/assets" ]; then
  cp -r "$CLIENT_DIR/assets/"* assets/tenant/ 2>/dev/null || true
fi

# 4. Ejecución de Flutter inyectando la URL del silo FastAPI
flutter run -d "$DEVICE" \
  --dart-define=API_URL="http://localhost:$PORT" \
  --dart-define=TENANT="$TENANT" \
  --dart-define=ENV="development"