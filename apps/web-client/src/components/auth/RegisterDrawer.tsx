/* --- apps/web-client/src/components/auth/RegisterDrawer.tsx --- */
// <!> este por lo que se es el menu para dar de alta el cliete 
import React, { useState } from 'react';
import { X, User, Phone, MapPin, Mail, Lock, Loader2, UserPlus } from 'lucide-react';

interface RegisterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterDrawer = ({ isOpen, onClose }: RegisterDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay (Fondo oscuro) */}
      <div 
        onClick={onClose}
        className={`
          /* --- Posición --- */
          fixed inset-0 z-[150]
          /* --- Colores --- */
          bg-vete-secondary/40 backdrop-blur-sm
          /* --- Animación --- */
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      {/* Panel Lateral (Drawer) */}
      <div className={`
        /* --- Posición --- */
        fixed top-0 right-0 z-[160]
        flex flex-col
        
        /* --- Dimensiones --- */
        h-full w-full max-w-md
        p-8
        
        /* --- Colores --- */
        bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)]
        
        /* --- Animación --- */
        transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}`}>
        
        {/* Header del Drawer */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-vete-primary/10 text-vete-primary rounded-2xl">
              <UserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black text-vete-secondary italic uppercase">Crear Cuenta</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Formulario de Registro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto pr-2">
          
          {/* Campo: Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
          </div>

          {/* Campo: Teléfono */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Teléfono / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
              <input 
                type="tel" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                placeholder="099 123 456"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </div>

          {/* Campo: Dirección */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Dirección de Entrega</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
              <input 
                type="text" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                placeholder="Calle y número (Salto)"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              />
            </div>
          </div>

          {/* Campo: Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                placeholder="usuario@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Campo: Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-primary" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Botón de Acción */}
          <button 
            type="submit"
            disabled={loading}
            className={`
              /* --- Posición --- */
              flex items-center justify-center gap-3
              mt-6 py-5
              
              /* --- Colores --- */
              bg-vete-primary text-white
              
              /* --- Texto --- */
              font-black uppercase tracking-widest
              
              /* --- Estilo --- */
              rounded-2xl shadow-xl shadow-vete-primary/20
              hover:bg-vete-primary/90 active:scale-95
              transition-all disabled:opacity-50
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Registrarme Ahora"}
          </button>
        </form>

        {/* Footer del Drawer */}
        <div className="mt-auto pt-6 text-center">
          <p className="text-sm text-slate-400">
            ¿Ya tienes cuenta? <br />
            <button className="text-vete-primary font-bold hover:underline">Inicia sesión aquí</button>
          </p>
        </div>
      </div>
    </>
  );
};