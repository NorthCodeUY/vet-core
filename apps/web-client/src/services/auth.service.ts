/* --- apps/web-client/src/services/auth.service.ts --- */

const API_URL = "/api"; // Usando el proxy de Vite que configuramos

export const authService = {
  // Guarda el token y datos del usuario
  setSession: (token: string, user: any) => {
    localStorage.setItem('vete_token', token);
    localStorage.setItem('vete_user', JSON.stringify(user));
  },

  // Borra la sesión
  logout: () => {
    localStorage.removeItem('vete_token');
    localStorage.removeItem('vete_user');
  },

  // Obtiene el usuario guardado
  getUser: () => {
    const user = localStorage.getItem('vete_user');
    return user ? JSON.parse(user) : null;
  },

  // Obtiene el token para las peticiones
  getToken: () => localStorage.getItem('vete_token')
};