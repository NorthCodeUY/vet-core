/* =============================================================================
   ENRUTADOR PRINCIPAL Y JERARQUÍA DE CONTEXTOS (App.tsx)
   ============================================================================= */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantProvider } from './context/tenant_context';
import { PedidoProvider } from './context/pedido_context';

/* Páginas Principales */
import MaintenancePage from './pages/maintenance/MaintenancePage';
import LandingPage from './pages/landing/LlandingPage';

/* Herramienta de Desarrollo */
import { TenantStudioDrawer } from './components/studio/TenantStudioDrawer';

/**
 * Componente Raíz de la Aplicación (`App`).
 * 
 * Orquesta la arquitectura de providers globales y la separación de rutas:
 * 1. `/`: Pantalla pública de mantenimiento / sitio en construcción.
 * 2. `/revision`: Vista limpia para clientes e inspectores sin botones de desarrollo.
 * 3. `/configuracion`: Estudio de diseño en caliente exclusivo para desarrollo local.
 *
 * @component
 * @returns {JSX.Element} Árbol de componentes con providers y ruteo seguro.
 */
function App(): React.JSX.Element {
  /*
     SEGURIDAD EN PRODUCCIÓN:
     `import.meta.env.DEV` vale true solo en desarrollo local (npm run dev).
     En producción (npm run build), la ruta /configuracion queda deshabilitada.
  */
  const isDevMode = import.meta.env.DEV;

  return (
    <TenantProvider>
      <PedidoProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Ruta Raíz: Cartel de Mantenimiento / Próximamente */}
            <Route path="/" element={<MaintenancePage />} />

            {/* 2. Ruta de Revisión: Landing Page limpia para clientes (SIN botón de Studio) */}
            <Route path="/revision" element={<LandingPage />} />

            {/* 3. Ruta de Configuración: Landing Page + Tenant Studio activo (Solo en Desarrollo) */}
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
              /* En producción, redirige al inicio para evitar accesos no autorizados */
              <Route path="/configuracion" element={<Navigate to="/" replace />} />
            )}

            {/* Redirección de rutas desconocidas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PedidoProvider>
    </TenantProvider>
  );
}

export default App;