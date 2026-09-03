// apps/web-client/src/context/TenantContext.tsx

// <!> Paquete que uso para limpiar el jesoy para poder usar comentarios o eso es lo que entendi hay que probarlo 

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { TenantConfig } from '../types/tenant';
import { type injectDynamicTheme } from '../config/theme';

export interface TenantContextProps {
  config: TenantConfig | null;
  isLoading: boolean;
  error: string | null;
}

export const TenantContext = createContext<TenantContextProps>({
  config: null,
  isLoading: true,
  error: null,
});

/**
 * Elimina comentarios simples (//) y multilínea (/* *\/) de un string de texto.
 * Permite documentar archivos JSON en desarrollo sin romper el parser.
 * 
 * @param {string} jsonString - Contenido crudo del archivo JSON con comentarios.
 * @returns {string} JSON limpio listo para JSON.parse().
 */
const stripJsonComments = (jsonString: string): string => {
  return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, group) => {
    return group ? "" : match;
  });
};

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenantConfiguration = async () => {
      try {
        const response = await fetch('/config/client_info.json', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        /* 1. Leemos el archivo como texto plano */
        const rawText = await response.text();

        /* 2. Removemos los comentarios automáticamente */
        const cleanJson = stripJsonComments(rawText);

        /* 3. Parseamos el JSON limpio */
        const data: TenantConfig = JSON.parse(cleanJson);

        /* 4. Inyección de tema y configuración */
        injectDynamicTheme(data.theme);

        if (data.branding.favicon_url) {
          const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
          if (favicon) favicon.href = data.branding.favicon_url;
        }

        document.title = data.business_name;
        setConfig(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar configuración';
        console.error('CRITICAL: Fallo en TenantProvider:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenantConfiguration();
  }, []);

  if (isLoading) {
    return (
      <div className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */

        /* --- Dimensiones --- */
        w-screen                     /* Ancho total */
        h-screen                     /* Alto total */

        /* --- Colores --- */
        bg-[#121212]                 /* Fondo oscuro */
        text-white                   /* Texto blanco */

        /* --- Texto --- */
        text-sm                      /* Tamaño de texto */
        font-medium                  /* Grosor medio */

        /* --- Animación --- */
        animate-pulse                /* Pulso de carga */
      `}>
        <span>Cargando configuración...</span>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ config, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
};