// app/vet-core/apps/web-client/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import LandingPage from './pages/landing/LlandingPage';

import { PedidoProvider } from './context/pedido_context.tsx'; // Importa el proveedor


function App() {
  // Mientras construimos la web real, devolvemos solo el cartel
  return (
    // BrowserRouter se encarga de las rutas de la aplicacion
    <BrowserRouter>
      <PedidoProvider>

        <Routes>
          {/* La raíz muestra el cartel de construcción */}
          <Route path="/" element={<MaintenancePage />} />

          {/* URL secreta para que la clienta revise los avances */}
          <Route path="/revision" element={
            <PedidoProvider>
              <LandingPage />
            </PedidoProvider>
          } />
        </Routes>

      </PedidoProvider>
    </BrowserRouter>
  );
}

export default App;
