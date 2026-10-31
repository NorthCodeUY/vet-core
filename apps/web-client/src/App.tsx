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
  // <!> Extraemos también el estado de carga del contexto
  const { config, isLoading } = useConfig() as any;
  const isDevMode = import.meta.env.DEV;

  /* 
     <!> GUARDIA DE CARGA OBLIGATORIA:
     Mientras el navegador descarga '/config/client_info.json', mostramos
     un fondo neutro para evitar que evalúe 'is_maintenance' prematuramente.
  */
  if (isLoading || !config) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

export default function App(): React.JSX.Element {
  return (
    <TenantProvider>
      <PedidoProvider>
        <AppRoutes />
      </PedidoProvider>
    </TenantProvider>
  );
}