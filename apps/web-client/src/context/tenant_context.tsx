// apps/web-client/src/context/tenant_context.tsx

// <!> Por lo que entendi esto lee el archivo le saca los cmentarios que le coloque y lo mete en 
// tenant_types no se bien lo que ase con config mejormae el comentario de paquete esto que agregue para que qede facil de ller 


import React, { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { TenantConfig } from '../types/tenant_types';
import { injectDynamicTheme } from '../config/theme_config';

/**
 * Contrato de datos expuesto por el contexto del Tenant.
 * 
 * @interface TenantContextProps
 * @property {TenantConfig | null} config - Datos de configuración del cliente activo.
 * @property {boolean} isLoading - Indicador de carga inicial del archivo JSON.
 * @property {string | null} error - Mensaje de error en caso de fallo de lectura.
 */
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
 * Permite documentar los archivos JSON de clientes sin romper el parser en runtime.
 * 
 * @param {string} jsonString - Contenido crudo del archivo JSON con comentarios.
 * @returns {string} JSON limpio listo para JSON.parse().
 */
const stripJsonComments = (jsonString: string): string => {
  return jsonString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, group) => {
    return group ? '' : match;
  });
};

/**
 * Proveedor central de identidad y configuración en tiempo de ejecución.
 * 
 * Descarga el archivo `client_info.json`, remueve comentarios en memoria,
 * inyecta la paleta de colores en el DOM y actualiza el título y favicon de la pestaña.
 *
 * @component
 * @param {{ children: ReactNode }} props - Componentes hijos de la aplicación.
 * @returns {JSX.Element} Provider de React con estado de configuración activo.
 */
export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTenantConfiguration = async () => {
      try {
        const response = await fetch('/config/client_info.json', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`HTTP error al cargar configuración: ${response.status}`);
        }

        /* 1. Lectura del archivo como texto plano */
        const rawText = await response.text();

        /* 2. Remoción de comentarios */
        const cleanJson = stripJsonComments(rawText);

        /* 3. Parseo de datos */
        const data: TenantConfig = JSON.parse(cleanJson);

        /* 4. Inyección de tema dinámico en :root */
        injectDynamicTheme(data.theme);

        /* 5. Actualización de Favicon si está definido */
        if (data.branding.favicon_url) {
          const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
          if (favicon) favicon.href = data.branding.favicon_url;
        }

        /* 6. Asignación del título de la pestaña */
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

  /* Vista de carga inicial bloqueante para evitar parpadeos de color */
  if (isLoading) {
    return (
      <div className={`
        /* --- Posición --- */
        flex                         /* Layout flexible */
        items-center                 /* Centrado vertical */
        justify-center               /* Centrado horizontal */

        /* --- Dimensiones --- */
        w-screen                     /* Ancho total de pantalla */
        h-screen                     /* Altura total de pantalla */

        /* --- Colores --- */
        bg-[#121212]                 /* Fondo neutro de arranque */
        text-white                   /* Color de texto */

        /* --- Texto --- */
        text-sm                      /* Tamaño de fuente pequeño */
        font-medium                  /* Grosor medio */

        /* --- Animación --- */
        animate-pulse                /* Animación de pulso suave */
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

/**
 * Hook de consumo de configuración corporativa.
 * 
 * @returns {TenantContextProps} Objeto con la configuración activa, estado de carga y posibles errores.
 * @throws {Error} Si se consume fuera del alcance de `TenantProvider`.
 */
export const useConfig = (): TenantContextProps => {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error('useConfig debe ser utilizado dentro de un TenantProvider');
  }

  return context;
};