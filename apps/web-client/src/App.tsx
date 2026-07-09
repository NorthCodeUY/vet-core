// app/vet-core/apps/web-client/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MaintenancePage from './pages/maintenance/MaintenancePage';
import LandingPage from './pages/landing/LlandingPage';

function App() {
  // Mientras construimos la web real, devolvemos solo el cartel
  return (
    <BrowserRouter>
      <Routes>
        {/* La raíz muestra el cartel de construcción */}
        <Route path="/" element={<MaintenancePage />} />

        {/* URL secreta para que la clienta revise los avances */}
        <Route path="/revision" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
