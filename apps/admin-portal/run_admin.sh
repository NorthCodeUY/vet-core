# apps/admin-portal/run_admin.sh





#!/bin/bash
# ==============================================================================
# ORQUESTADOR VETCORE SAAS - PORTAL ADMINISTRATIVO
# ==============================================================================

TENANT=${1:-veterinaria}
TARGET=${2:-chrome} # Opciones: 'chrome' o 'linux'

# 1. Normalización de rutas y nombres de cliente
case $TENANT in
  "valeria" | "veterinaria" | "veterinariabeltrameli")
    CLIENT_DIR="../../clients/veterinariabeltrameli"
    ENV_FILE="../../api-backend/.env.veterinaria"
    ;;
  "flordeloto")
    CLIENT_DIR="../../clients/flordeloto"
    ENV_FILE="../../api-backend/.env.flordeloto"
    ;;
  *)
    CLIENT_DIR="../../clients/$TENANT"
    ENV_FILE="../../api-backend/.env.$TENANT"
    ;;
esac

# 2. Validación de existencia del cliente
if [ ! -d "$CLIENT_DIR" ]; then
  echo "❌ Error: Directorio del cliente no encontrado: $CLIENT_DIR"
  exit 1
fi

# 3. Extracción automática del puerto desde el .env del backend
if [ -f "$ENV_FILE" ]; then
  PORT=$(grep -E '^APP_PORT=' "$ENV_FILE" | cut -d '=' -f2 | tr -d ' "')
fi
PORT=${PORT:-8001}

echo "============================================================"
echo "🚀 [VETCORE SAAS] - INICIANDO PORTAL ADMINISTRATIVO"
echo "🏢 Tenant Activo  : $TENANT"
echo "📄 Config Admin   : $CLIENT_DIR/config_admin.json"
echo "🌐 Backend Target : http://localhost:$PORT"
echo "🖥️  Target Device  : $TARGET"
echo "============================================================"

# 4. Sincronización en caliente de assets locales
mkdir -p assets/tenant
cp "$CLIENT_DIR/config_admin.json" assets/tenant/config.json 2>/dev/null || cp "$CLIENT_DIR/config.json" assets/tenant/config.json
cp "$CLIENT_DIR/assets/logo.png" assets/tenant/logo.png 2>/dev/null || true

# 5. Ejecución de Flutter
flutter run -d "$TARGET" \
  --dart-define=API_URL="http://localhost:$PORT" \
  --dart-define=TENANT="$TENANT"