// apps/web-client/src/App.tsx

/* =============================================================================
   ENRUTADOR PRINCIPAL Y JERARQUÍA DE CONTEXTOS (App.tsx)
   ============================================================================= */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider, useConfig } from './context/tenant_context';
import { PedidoProvider } from './context/pedido_context';

/* Páginas Principales */
import MaintenancePage from './pages/maintenance/MaintenancePage';
import LandingPage from './pages/landing/LlandingPage';

/* Herramienta de Desarrollo */
import { TenantStudioDrawer } from './components/studio/TenantStudioDrawer';

/**
 * Enrutador interno que evalúa la bandera de mantenimiento en tiempo de ejecución.
 * 
 * @component
 * @returns {JSX.Element} Configuración de rutas activa.
 */
const AppRoutes: React.FC = () => {
  const { config } = useConfig();
  const isDevMode = import.meta.env.DEV;

  /* 
     CONTROL DE PASO A PRODUCCIÓN POR CONFIG.JSON:
     Si no está definido o es false, la web se muestra en la raíz '/'.
     Si es true, la raíz '/' muestra la pantalla de mantenimiento.
  */
  const isMaintenance = config?.features?.is_maintenance ?? false;

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Ruta Raíz: Dinámica según el flag 'is_maintenance' de cada cliente */}
        <Route
          path="/"
          element={isMaintenance ? <MaintenancePage /> : <LandingPage />}
        />

        {/* 2. Ruta de Revisión: Bypass para verificar avances en cualquier momento */}
        <Route path="/revision" element={<LandingPage />} />

        {/* 3. Ruta de Configuración: Solo accesible en entorno de desarrollo local */}
        {isDevMode ? (
          <Route
            path="/configuracion"
            element={
              <>
                <LandingPage />
                <TenantStudioDrawer />
              </>
            }
          />
        ) : (
          <Route path="/configuracion" element={<Navigate to="/" replace />} />
        )}

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/**
 * Componente Raíz de la Aplicación (`App`).
 * 
 * Envuelve el árbol con los proveedores de contexto globales `TenantProvider` y `PedidoProvider`.
 *
 * @component
 * @returns {JSX.Element} Aplicación montada con contextos globales.
 */
export default function App(): React.JSX.Element {
  return (
    <TenantProvider>
      <PedidoProvider>
        <AppRoutes />
      </PedidoProvider>
    </TenantProvider>
  );
}