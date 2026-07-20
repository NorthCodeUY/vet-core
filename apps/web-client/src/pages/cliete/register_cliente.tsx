/* --- apps/web-client/src/components/auth/RegisterModal.tsx --- */

import React, { useState } from 'react';

import { 
  X, User, Phone, Mail, MapPin, Lock, 
  Eye, EyeOff, Camera, Check, ArrowRight, 
  ShoppingBasket, Navigation 
} from 'lucide-react'; 

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  /* --- Estado de Navegación y Formulario --- */
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    email: '',
    direccion: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  /* --- Handlers de Navegación --- */
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className={`
      /* --- Posición --- */
      fixed                        /* Cubre toda la pantalla */
      inset-0                      /* Top, bottom, left, right = 0 */
      z-[200]                      /* Por encima de todo */
      flex                         /* Contenedor flexible */
      items-center                 /* Centrado vertical */
      justify-center               /* Centrado horizontal */
      p-4                          /* Padding de seguridad */

      /* --- Colores --- */
      bg-slate-950/40              /* Fondo oscuro traslúcido */
      backdrop-blur-md             /* Efecto de desenfoque profesional */
    `}>
      
      {/* Contenedor del Modal */}
      <div className={`
        /* --- Posición --- */
        relative                     /* Para el botón de cerrar */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical */
        
        /* --- Dimensiones --- */
        w-full                       /* Ancho total en móvil */
        max-w-xl                     /* Límite de ancho profesional */
        overflow-hidden              /* Corta el contenido al borde */

        /* --- Colores --- */
        bg-white                     /* Fondo blanco puro */
        shadow-2xl                   /* Sombra profunda */

        /* --- Estilo --- */
        rounded-[3rem]               /* Bordes muy redondeados (Figma style) */
      `}>

        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors z-10"
        >
          <X size={28} />
        </button>

        <div className="p-8 md:p-12">
          
          {/* --- STEPPER (Indicador de Progreso) --- */}
          <div className={`
            /* --- Posición --- */
            flex                         /* Alineación horizontal */
            items-center                 /* Centrado vertical */
            justify-between              /* Espaciado equitativo */
            relative                     /* Para la línea de fondo */
            mb-12                        /* Margen inferior */
            px-4                         /* Padding lateral */
          `}>
            {/* Línea de progreso de fondo */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-10" />
            <div 
              className="absolute top-5 left-0 h-[2px] bg-vete-primary -z-10 transition-all duration-500" 
              style={{ width: `${(step - 1) * 50}%` }}
            />

            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center gap-2">
                <div className={`
                  /* --- Dimensiones --- */
                  w-10 h-10                  /* Tamaño del círculo */
                  flex items-center justify-center
                  
                  /* --- Estilo --- */
                  rounded-full               /* Círculo perfecto */
                  border-2                   /* Borde de 2px */
                  font-bold text-sm          /* Texto interno */
                  transition-all duration-300
                  
                  /* --- Colores Dinámicos --- */
                  ${step >= num ? 'bg-vete-primary border-vete-primary text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-200 text-slate-400'}
                `}>
                  {step > num ? <Check size={18} /> : num}
                </div>
                <span className={`
                  text-[10px] font-black uppercase tracking-widest
                  ${step >= num ? 'text-vete-primary' : 'text-slate-400'}
                `}>
                  {num === 1 ? 'Identidad' : num === 2 ? 'Logística' : 'Seguridad'}
                </span>
              </div>
            ))}
          </div>

          {/* --- CONTENIDO DE LOS PASOS --- */}
          <form className="space-y-8">
            
            {/* PASO 1: Identidad y WhatsApp */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-vete-secondary italic uppercase">¡Únete a la familia!</h2>
                  <p className="text-slate-500 mt-2 text-sm font-medium">Comencemos con tu perfil básico.</p>
                </div>

                {/* Avatar Upload UI */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-emerald-50 bg-slate-100 flex items-center justify-center overflow-hidden">
                      <User size={48} className="text-slate-300" />
                    </div>
                    <button type="button" className="absolute bottom-1 right-1 bg-vete-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Nombre completo"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-slate-400 font-bold text-sm">+598</span>
                      <div className="w-[1px] h-4 bg-slate-200 ml-1" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="WhatsApp"
                      className="w-full pl-28 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={nextStep}
                  className="w-full mt-10 py-5 bg-vete-secondary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                >
                  Continuar <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* PASO 2: Logística */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-vete-secondary italic uppercase">¿A dónde enviamos?</h2>
                  <p className="text-slate-500 mt-2 text-sm font-medium">Necesitamos saber dónde encontrarte.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="email" placeholder="Correo electrónico" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="Dirección de entrega" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all" />
                  </div>
                  <button type="button" className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-50 hover:border-vete-primary hover:text-vete-primary transition-all">
                    <Navigation size={18} className="animate-pulse" />
                    <span className="font-bold text-sm">Usar mi ubicación actual</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button type="button" onClick={prevStep} className="py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">Volver</button>
                  <button type="button" onClick={nextStep} className="py-5 bg-vete-secondary text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">Siguiente</button>
                </div>
              </div>
            )}

            {/* PASO 3: Seguridad */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-vete-secondary italic uppercase">Crea tu acceso</h2>
                  <p className="text-slate-500 mt-2 text-sm font-medium">Asegura tu cuenta con una contraseña fuerte.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type={showPass ? "text" : "password"} placeholder="Contraseña" className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                      {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type={showPass ? "text" : "password"} placeholder="Confirmar contraseña" className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all" />
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    type="submit"
                    className={`
                      /* --- Posición --- */
                      flex flex-col items-center justify-center gap-1
                      /* --- Dimensiones --- */
                      w-full py-6
                      /* --- Colores --- */
                      bg-vete-primary text-white
                      /* --- Texto --- */
                      font-black uppercase tracking-[0.15em] text-sm
                      /* --- Estilo --- */
                      rounded-2xl shadow-xl shadow-emerald-500/20
                      /* --- Animación --- */
                      hover:bg-emerald-600 active:scale-95 transition-all
                    `}
                  >
                    CREAR CUENTA Y EMPEZAR A COMPRAR
                    <ShoppingBasket size={20} className="opacity-80" />
                  </button>
                  <button type="button" onClick={prevStep} className="w-full mt-4 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
                    Revisar datos anteriores
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Decoración Inferior */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-vete-primary" />
      </div>
    </div>
  );
};