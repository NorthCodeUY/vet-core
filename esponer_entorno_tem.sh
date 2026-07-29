#!/bin/bash

#./exponer_entorno_tem.sh

echo "=============================================================================="
echo "Script para exponer temporalmente el entorno de desarrollo (VetCore)"
echo "=============================================================================="

# 1. Verificar si cloudflared está instalado
if ! command -v cloudflared &> /dev/null; then
    echo "Instalando cloudflared..."
    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
    sudo dpkg -i cloudflared.deb
    rm cloudflared.deb
    echo "¡Instalación de cloudflared completada!"
fi

echo "Iniciando túneles de Cloudflare..."

# Archivos temporales para los logs de las URLs asignadas
LOG_BACKEND=$(mktemp)
LOG_FRONTEND=$(mktemp)

# Puertos configurados para desarroll

# --- Función para leer variables de archivos .env ---
get_env_var() {
    local var_name=$1 # Recibe el nombre de la variable a buscar
    local file_path=$2 # Recibe la ruta del archivo .env
    if [ -f "$file_path" ]; then
        # 1. Busca la línea que empieza con la variable
        # 2. Corta por el '=' 
        # 3. Usa sed para eliminar todo lo que esté después de un '#'
        # 4. Usa xargs para eliminar espacios en blanco sobrantes
        grep "^$var_name=" "$file_path" | cut -d'=' -f2 | sed 's/#.*//' | xargs
    else
        echo ""
    fi
}

# --- Cargar puertos desde los .env ---
PORT_BACKEND=$(get_env_var  VITE_BACKEND_PORT apps/web-client/.env)
PORT_FRONTEND=$(get_env_var VITE_FRONTEN_PORT apps/web-client/.env)




# 2. Iniciar túnel para el Backend en segundo plano
cloudflared tunnel --url http://localhost:$PORT_BACKEND > /dev/null 2> "$LOG_BACKEND" &
PID_BACKEND=$!

# 3. Iniciar túnel para el Frontend (React/Vite) en segundo plano
cloudflared tunnel --url http://localhost:$PORT_FRONTEND > /dev/null 2> "$LOG_FRONTEND" &
PID_FRONTEND=$!

# Esperar unos segundos a que Cloudflare nos asigne las URLs
echo -n "Obteniendo enlaces públicos de prueba"
for i in {1..6}; do
    echo -n "."
    sleep 1
done
echo ""

# 4. Extraer las URLs públicas usando expresiones regulares
URL_BACKEND=$(grep -oE "https://[a-zA-Z0-9.-]+\.trycloudflare\.com" "$LOG_BACKEND" | head -n 1)
URL_FRONTEND=$(grep -oE "https://[a-zA-Z0-9.-]+\.trycloudflare\.com" "$LOG_FRONTEND" | head -n 1)

# 5. Mostrar los enlaces obtenidos
echo "=================================================="
echo "⚡ TÚNELES ACTIVOS (Entorno Temporal) ⚡"
echo "=================================================="
echo "🔗 Frontend (Vite) URL: $URL_FRONTEND"
echo "🔗 Backend (FastAPI) URL:  $URL_BACKEND"
echo "Puerto interno Frontend: $PORT_FRONTEND"
echo "Puerto interno Backend: $PORT_BACKEND"
echo "=================================================="
echo "Nota: Recuerda configurar estas URLs en tus archivos .env si es necesario."
echo "Presiona Ctrl+C para detener los túneles y limpiar el entorno..."

# Función de limpieza al finalizar
cleanup() {
    echo -e "\nDeteniendo túneles..."
    kill $PID_BACKEND $PID_FRONTEND &> /dev/null
    rm -f "$LOG_BACKEND" "$LOG_FRONTEND"
    echo "¡Entorno temporal cerrado con éxito!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Mantener el script en ejecución activa
wait