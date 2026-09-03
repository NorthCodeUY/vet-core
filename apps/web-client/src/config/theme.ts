// apps/web-client/src/config/theme.ts

// <!> Inyectado por la ia para poder injectar los colores almenos fue lo que entendi 


import { type ThemeColors } from '../types/tenant';

/**
 * Convierte un código Hexadecimal (#RRGGBB o #RGB) a formato 'R G B' numérico.
 * Este formato permite que Tailwind aplique opacidades dinámicas (/10, /40).
 * 
 * @param {string} hex - Código hexadecimal a convertir.
 * @returns {string} Canales RGB separados por espacio (ej: '5 150 105').
 */
const hexToRgbChannels = (hex: string): string => {
  let cleanHex = hex.replace('#', '').trim();

  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((char) => char + char).join('');
  }

  const numericValue = parseInt(cleanHex, 16);
  const red = (numericValue >> 16) & 255;
  const green = (numericValue >> 8) & 255;
  const blue = numericValue & 255;

  return `${red} ${green} ${blue}`;
};

/**
 * Inyecta los colores del JSON del cliente en las variables CSS nativas de `:root`.
 * 
 * @param {ThemeColors} theme - Objeto con los tokens de color del cliente.
 * @returns {void}
 */
export const injectDynamicTheme = (theme: ThemeColors): void => {
  const root = document.documentElement;

  /* Mapeo de tokens a variables CSS consumidas por tailwind.config.js */
  root.style.setProperty('--vete-primary', hexToRgbChannels(theme.primary));
  root.style.setProperty('--vete-primary-hover', hexToRgbChannels(theme.primary_hover));
  root.style.setProperty('--vete-secondary', hexToRgbChannels(theme.secondary));
  root.style.setProperty('--vete-tertiary', hexToRgbChannels(theme.tertiary));
  root.style.setProperty('--vete-dark', hexToRgbChannels(theme.dark));
  root.style.setProperty('--vete-surface', hexToRgbChannels(theme.surface));
  root.style.setProperty('--vete-soft', hexToRgbChannels(theme.soft));
  root.style.setProperty('--vete-overlay', hexToRgbChannels(theme.overlay));
  root.style.setProperty('--vete-text-base', hexToRgbChannels(theme.text_base));
  root.style.setProperty('--vete-text-muted', hexToRgbChannels(theme.text_muted));
  root.style.setProperty('--vete-border-subtle', hexToRgbChannels(theme.border_subtle));
  root.style.setProperty('--vete-error', hexToRgbChannels(theme.error));
};