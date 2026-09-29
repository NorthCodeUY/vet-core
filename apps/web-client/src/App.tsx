// app/vet-core/apps/web-client/src/App.tsx

/* =============================================================================
   ENRUTADOR PRINCIPAL Y JERARQUÍA DE CONTEXTOS (App.tsx)
   ============================================================================= */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/tenant_context';
import { PedidoProvider } from './context/pedido_context';

/* Páginas y Vistas Principales */
import MaintenancePage from './pages/maintenance/MaintenancePage';
import LandingPage from './pages/landing/LlandingPage';

/**
 * Componente Raíz de la Aplicación (`App`).
 * 
 * Orquesta la arquitectura de providers globales y el enrutador de React Router:
 * 1. `TenantProvider`: Descarga la identidad del cliente, inyecta colores y bloquea la UI hasta estar listo.
 * 2. `PedidoProvider`: Administra el estado global del carrito de compras y persistencia.
 * 3. `BrowserRouter`: Maneja las rutas públicas y de desarrollo.
 *
 * @component
 * @returns {JSX.Element} Árbol de componentes con providers y ruteo activo.
 */
function App(): React.JSX.Element {
  return (
    /* -------------------------------------------------------------------------
       1. PROVEEDOR MULTI-TENANT (Nivel Superior Obligatorio)
       Garantiza que toda la aplicación tenga acceso a 'useConfig()' y al tema.
       ------------------------------------------------------------------------- */
    <TenantProvider>
      {/* -----------------------------------------------------------------------
         2. PROVEEDOR DE PEDIDOS / CARRITO
         Maneja la lista de productos agregados, cantidades y totales.
         ----------------------------------------------------------------------- */}
      <PedidoProvider>
        {/* ---------------------------------------------------------------------
           3. ENRUTADOR PRINCIPAL (React Router)
           --------------------------------------------------------------------- */}
        <BrowserRouter>
          <Routes>
            {/* Ruta Raíz: Cartel de Mantenimiento / Próximamente */}
            <Route path="/" element={<MaintenancePage />} />

            {/* Ruta de Previsualización: Landing Page activa con catálogo */}
            <Route path="/revision" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </PedidoProvider>
    </TenantProvider>
  );
}

export default App;



















// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import MaintenancePage from './pages/maintenance/MaintenancePage';
// import LandingPage from './pages/landing/LlandingPage';

// import { PedidoProvider } from './context/pedido_context.tsx'; // Importa el proveedor


// function App() {
//   // Mientras construimos la web real, devolvemos solo el cartel
//   return (
//     // BrowserRouter se encarga de las rutas de la aplicacion
//     <BrowserRouter>
//       <PedidoProvider>

//         <Routes>
//           {/* La raíz muestra el cartel de construcción */}
//           <Route path="/" element={<MaintenancePage />} />

//           {/* URL secreta para que la clienta revise los avances */}
//           <Route path="/revision" element={
//             <PedidoProvider>
//               <LandingPage />
//             </PedidoProvider>
//           } />
//         </Routes>

//       </PedidoProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
