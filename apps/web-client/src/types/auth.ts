/* --- app/vet-core/apps/web-client/src/types/auth.ts --- */

// <!DMI> Interfaz para representar el usuario
export interface User {
  id: number;
  nombre: string;
  email: string;
  foto_url?: string;
  direccion?: string;
}

// <!DMI> Interfaz para representar la respuesta de autenticación
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}