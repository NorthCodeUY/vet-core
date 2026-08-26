/* --- apps/web-client/src/pages/landing/sessions/ServicioSession.tsx --- */

import React from 'react';
import { ServiceCard } from '../../../components/ServiceCard';
import serviciosData from '../../../data/servicios.json';
import companyInfo from '../../../data/companyInfo.json';

/* =============================================================================
   CONTRATO DE PROPIEDADES (PROPS)
   ============================================================================= */

/**
 * Propiedades del componente `ServicioSession`.
 * 
 * @interface ServicioSessionProps
 * @property {string} bgColor - Clase de color de fondo de Tailwind para alternar secciones con contraste visual.
 */
interface ServicioSessionProps {
  bgColor: string;
}

/* =============================================================================
   COMPONENTE: SECCIÓN DE SERVICIOS VETERINARIOS
   ============================================================================= */

/**
 * Sección de catálogo de servicios veterinarios (`ServicioSession`).
 * 
 * Despliega los pilares de atención de la clínica en Salto:
 * 1. Animales de Producción (Ganadería / DICOSE).
 * 2. Pequeños Animales (Clínica de mascotas y cirugía).
 * 3. Área de Equinos.
 * 
 * Itera los datos desde `servicios.json` e inyecta la información de contacto 
 * telefónico de la empresa para habilitar consultas directas a través de `ServiceCard`.
 *
 * @component
 * @param {ServicioSessionProps} props - Propiedades de configuración visual.
 * @returns {JSX.Element} Sección estructurada con encabezado y grilla responsiva de servicios.
 */
export const ServicioSession: React.FC<ServicioSessionProps> = ({ bgColor }) => {
  return (
    <section 
      id="ServicioSession"
      className={`
        /* --- Posición --- */
        relative                     /* Base para separadores y efectos */
        flex                         /* Contenedor flexible principal */
        flex-col                     /* Disposición vertical */
        items-center                 /* Centrado horizontal del contenido */

        /* --- Dimensiones --- */
        w-full                       /* Ancho completo de pantalla */
        py-20                        /* Padding vertical amplio (5rem) */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral en pantallas medianas */

        /* --- Colores --- */
        ${bgColor}                   /* Fondo dinámico por propiedad */
      `}
    >
      <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible interno */
        flex-col                     /* Organización en columna */
        items-center                 /* Centrado de hijos */
        
        /* --- Dimensiones --- */
        max-w-[1280px]               /* Límite de ancho para diseño */
        w-full                       /* Ocupa el ancho disponible */
        gap-16                       /* Espacio amplio entre título y grilla */
      `}>

        {/* Bloque de Título y Subtítulo */}
        <div className={`
          /* --- Posición --- */
          flex flex-col items-center   /* Alineación centrada */
          /* --- Texto --- */
          text-center                  /* Texto centrado */
        `}>
          <h2 className={`
            /* --- Texto --- */
            text-vete-h2                 /* Tamaño tipográfico corporativo H2 */
            font-black                   /* Peso máximo (900) */
            italic                       /* Estilo cursivo distintivo */
            uppercase                    /* Mayúsculas institucionales */
            tracking-tighter             /* Espaciado de letras compacto */

            /* --- Colores --- */
            text-vete-text-light         /* Color de texto claro */
          `}>
            Servicios con los que <span className="text-vete-primary">contamos</span>
          </h2>
          
          <p className={`
            /* --- Dimensiones --- */
            mt-4                         /* Separación superior */
            max-w-2xl                    /* Límite de ancho para legibilidad */

            /* --- Texto --- */
            text-vete-body               /* Tipografía de cuerpo */
            font-medium                  /* Peso medio */

            /* --- Colores --- */
            text-vete-text-light         /* Color claro */
            opacity-60                   /* Atenuado para jerarquía visual */
          `}>
            Planes diseñados para asegurar la salud preventiva y el rendimiento productivo de sus animales.
          </p>
        </div>

        {/* Grilla Responsiva de Tarjetas de Servicio */}
        <div className={`
          /* --- Posición --- */
          grid                         /* Activa el sistema de grilla */
          grid-cols-1                  /* 1 columna en teléfonos */
          md:grid-cols-2               /* 2 columnas en tablets */
          lg:grid-cols-3               /* 3 columnas en desktop */
          justify-items-center         /* Centrado horizontal de cada tarjeta */

          /* --- Dimensiones --- */
          w-full                       /* Ancho total del contenedor */
          gap-10                       /* Espaciado uniforme entre tarjetas */
        `}>
          {serviciosData.map((servicio, index) => (
            <ServiceCard
              key={index}
              {...servicio}
              phone={companyInfo.contact.adminPhone}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicioSession;