#!/bin/sh

# apps/web-client/inject-seo.sh

# =============================================================================
# INYECTOR DINÁMICO DE SEO Y METADATOS MULTI-TENANT (inject-seo.sh)
# =============================================================================

CONFIG_FILE="/usr/share/nginx/html/config/client_info.json"
HTML_FILE="/usr/share/nginx/html/index.html"

if [ -f "$CONFIG_FILE" ] && [ -f "$HTML_FILE" ]; then
    echo "[*] Inyectando metadatos dinámicos para WhatsApp y Google..."

    # 1. Extraer Título (Si tiene bloque seo.title lo usa; si no, combina Nombre + Slogan)
    TITLE=$(jq -r '.seo.title // (.business_name + " - " + .slogan.highlight)' "$CONFIG_FILE")

    # 2. Extraer Descripción
    DESC=$(jq -r '.seo.description // .hero.description' "$CONFIG_FILE")

    # 3. Extraer Color Primario para la barra de navegación móvil (theme-color)
    COLOR=$(jq -r '.theme.primary // "#000000"' "$CONFIG_FILE")

    # 4. Construir URL Absoluta de Imagen para WhatsApp (Crítico para que WhatsApp dibuje la foto)
    # Si definiste DOMAIN_NAME en docker-compose, arma la URL completa https://dominio/tenant/hero.png
    if [ -n "$DOMAIN_NAME" ]; then
        CANONICAL_URL="https://$DOMAIN_NAME"
        IMAGE_URL="https://$DOMAIN_NAME/tenant/hero.png"
    else
        CANONICAL_URL="/"
        IMAGE_URL="/tenant/hero.png"
    fi

    # 5. Reemplazar los comodines en index.html usando separadores | para no romper las URLs
    sed -i "s|__META_TITLE__|$TITLE|g" "$HTML_FILE"
    sed -i "s|__META_DESCRIPTION__|$DESC|g" "$HTML_FILE"
    sed -i "s|__THEME_COLOR__|$COLOR|g" "$HTML_FILE"
    sed -i "s|__CANONICAL_URL__|$CANONICAL_URL|g" "$HTML_FILE"
    sed -i "s|__OG_IMAGE__|$IMAGE_URL|g" "$HTML_FILE"

    echo "[✓] Metadatos inyectados con éxito para: [$TITLE]"
fi