/* --- apps/web-client/src/components/auth/LoginModal.tsx --- */

// <!> esta no deberia estar en el directorio pages qeu yo hay guarde logind y el menu de web en contruccion es para mi como ventna 
import React, { useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/auth_context';

export const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Llamada real a tu FastAPI
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.access_token);
        onClose();
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`
      /* --- Posición --- */
      fixed inset-0 z-[200]
      flex items-center justify-center
      
      /* --- Colores --- */
      bg-vete-secondary/60 backdrop-blur-sm
    `}`}>
      <div className={`
        /* --- Posición --- */
        relative flex flex-col
        
        /* --- Dimensiones --- */
        w-full max-w-md p-8
        
        /* --- Colores --- */
        bg-white rounded-[2.5rem] shadow-2xl
      `}`}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-vete-secondary">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-vete-secondary italic uppercase">Bienvenido</h2>
          <p className="text-slate-500">Ingresa para gestionar tus pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Tu Email"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-vete-primary rounded-2xl outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`
              /* --- Posición --- */
              flex items-center justify-center gap-2
              mt-4 py-4
              
              /* --- Colores --- */
              bg-vete-primary text-white
              
              /* --- Texto --- */
              font-bold text-lg
              
              /* --- Estilo --- */
              rounded-2xl shadow-lg shadow-vete-primary/30
              hover:bg-vete-primary/90 transition-all
              disabled:opacity-50
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};