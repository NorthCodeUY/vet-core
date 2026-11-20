# apps/admin-portal/run_admin.sh
# Propósito: Orquestador CLI para validar rutas del tenant, compilar JSONC a JSON y ejecutar Flutter acelerado.

#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

TENANT=${1:-veterinaria}
TARGET=${2:-linux} # Opciones recomendadas: 'linux' (más rápido), 'web-server', 'chrome'

# 1. Normalización de nombres de cliente y archivo de entorno
case $TENANT in
  "valeria" | "veterinaria" | "veterinariabeltrameli")
    TENANT_FOLDER="veterinariabeltrameli"
    ENV_FILE="../../api-backend/.env.veterinaria"
    ;;
  "flordeloto")
    TENANT_FOLDER="flordeloto"
    ENV_FILE="../../api-backend/.env.flordeloto"
    ;;
  *)
    TENANT_FOLDER="$TENANT"
    ENV_FILE="../../api-backend/.env.$TENANT"
    ;;
esac

# 2. Resolución resiliente de ruta (soporta tanto 'clients/' como 'clientes/')
if [ -d "../../clients/$TENANT_FOLDER" ]; then
  CLIENT_DIR="../../clients/$TENANT_FOLDER"
elif [ -d "../../clientes/$TENANT_FOLDER" ]; then
  CLIENT_DIR="../../clientes/$TENANT_FOLDER"
else
  echo "❌ Error: Directorio del cliente no encontrado en ../../clients/$TENANT_FOLDER ni ../../clientes/$TENANT_FOLDER"
  exit 1
fi

if [ -f "$CLIENT_DIR/config_admin.json" ]; then
  SOURCE_CONFIG="$CLIENT_DIR/config_admin.json"
elif [ -f "$CLIENT_DIR/config.json" ]; then
  SOURCE_CONFIG="$CLIENT_DIR/config.json"
else
  echo "❌ Error: No se encontró config_admin.json ni config.json en $CLIENT_DIR"
  exit 1
fi

# 3. Extracción automática del puerto desde el .env del backend
if [ -f "$ENV_FILE" ]; then
  PORT=$(grep -E '^APP_PORT=' "$ENV_FILE" | cut -d '=' -f2 | tr -d ' "\r')
fi
PORT=${PORT:-8001}

echo "============================================================"
echo "🚀 [VETCORE SAAS] - INICIANDO PORTAL ADMINISTRATIVO"
echo "🏢 Tenant Activo  : $TENANT"
echo "📄 Config Admin   : $SOURCE_CONFIG"
echo "🌐 Backend Target : http://localhost:$PORT"
echo "🖥️  Target Device  : $TARGET"
echo "============================================================"

# 4. Sincronización inteligente de assets y compilación limpia de JSONC -> JSON estricto
mkdir -p assets/tenant
TMP_CONFIG=$(mktemp)

if ! python3 -c '
import json, re, sys
raw = open(sys.argv[1], "r", encoding="utf-8").read()
no_comments = re.sub(r"(\"(?:\\.|[^\"\\])*\")|(/\*[\s\S]*?\*/|//[^\r\n]*)", lambda m: m.group(1) or "", raw)
valid_json = re.sub(r"(\"(?:\\.|[^\"\\])*\")|,\s*([}\]])", lambda m: m.group(1) or m.group(2), no_comments)
parsed = json.loads(valid_json)
print(json.dumps(parsed, ensure_ascii=False, indent=2))
' "$SOURCE_CONFIG" > "$TMP_CONFIG"; then
  rm -f "$TMP_CONFIG"
  echo "❌ Error de sintaxis JSON en: $SOURCE_CONFIG"
  exit 1
fi

# <!> Fija permisos 0644 aquí (después de crear $TMP_CONFIG) para evitar HTTP 403 en Nginx
chmod 644 "$TMP_CONFIG"

if ! cmp -s "$TMP_CONFIG" assets/tenant/config.json; then
  mv "$TMP_CONFIG" assets/tenant/config.json
  echo "🔄 config.json actualizado."
else
  rm -f "$TMP_CONFIG"
  chmod 644 assets/tenant/config.json 2>/dev/null || true
fi

if [ -f "$CLIENT_DIR/assets/logo.png" ] && ! cmp -s "$CLIENT_DIR/assets/logo.png" assets/tenant/logo.png; then
  cp "$CLIENT_DIR/assets/logo.png" assets/tenant/logo.png
  echo "🔄 logo.png actualizado."
fi

# 5. Ejecución acelerada de Flutter
PUB_FLAG=""
if [ -f ".dart_tool/package_config.json" ] && [ ".dart_tool/package_config.json" -nt "pubspec.yaml" ]; then
  PUB_FLAG="--no-pub"
fi

EXTRA_FLAGS=""
if [ "$TARGET" = "chrome" ] || [ "$TARGET" = "web-server" ]; then
  EXTRA_FLAGS="--web-port=5050"
fi

flutter run -d "$TARGET" \
  $PUB_FLAG \
  $EXTRA_FLAGS \
  --dart-define=API_URL="http://localhost:$PORT" \
  --dart-define=TENANT="$TENANT"