// app/vet-core/apps/web-client/src/sessions/maintenance/MaintenancePage.tsx

// import { default as Lottie } from "lottie-react";
// import Lottie from "lottie-react";
import LottieComponent from "lottie-react";
import maintenanceAnimation from "../../assets/animations/maintenance.json";


// Este es el "fix" para el error de objeto en Vite/React 19
const Lottie = (LottieComponent as any).default || LottieComponent;

// <!> Documentarlo todo Creo que es la clase para el cartel de web en construccion 
export default function MaintenancePage() {
  
  // Comando para ver el funcioanmeito del converson de la animacion 
  console.log("¿Es Lottie una función?", typeof Lottie); //<!> Eliminar 



  
  return (
    // 1. Contenedor principal: Ocupa toda la pantalla (h-screen) y centra todo.
    // Usamos un fondo oscuro para que la animación resalte.
    <main className="flex h-screen w-full flex-col items-center justify-center bg-[#1a1a1a] p-6">
      
      {/* 
         2. Contenedor de la animación: 
         Aquí es donde controlamos el tamaño. 
         - max-w-md: Limita el ancho a unos 448px (ideal para ilustraciones).
         - drop-shadow: Le da profundidad para que no parezca pegada.
      */}
      <div className="w-full max-w-md transition-all duration-500 ease-in-out">
        {typeof Lottie === 'function' ? (
          <Lottie 
            animationData={maintenanceAnimation}
            loop={true}
            autoplay={true} 
            className="h-auto w-full"
          />
        ) : (
          <div className="animate-pulse text-gray-400">Cargando experiencia...</div>
        )}
      </div>

      {/* 
         3. Pie de página minimalista: 
         Puesto con absolute para que no empuje a la animación y se mantenga al fondo.
      */}
      <footer className="absolute bottom-8 text-center">
        <p className="text-[10px] font-medium tracking-[0.4em] text-white/20 uppercase">
          Infraestructura por NorthCode
        </p>
      </footer>
    </main>
  ); 

}

