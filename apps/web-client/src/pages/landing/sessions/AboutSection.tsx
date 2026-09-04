// app/vet-core/src/pages/landing/sessions/AboutSection.tsx

import React from 'react';
import { useConfig } from '../../../hooks/useConfig';
import { InfoSection } from '../../../components/InfoSection';

/**
 * Sección institucional modular (`AboutSection`).
 * 
 * Lee dinámicamente las secciones de Misión, Visión y Valores desde la configuración
 * del cliente activo, renderizando cada bloque con su imagen y textos enriquecidos.
 *
 * @component
 * @returns {JSX.Element} Contenedor con todas las secciones institucionales.
 */
export const AboutSection: React.FC = () => {
  const { config } = useConfig();
  const sections = config?.institutional?.sections ?? [];

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className={`
      /* --- Posición --- */
      flex                         /* Layout flexible */
      flex-col                     /* Organización en columna */

      /* --- Dimensiones --- */
      w-full                       /* Ancho completo */
      py-12                        /* Padding vertical amplio */

      /* --- Colores --- */
      bg-vete-surface              /* Fondo institucional claro */

      /* --- Texto --- */

      /* --- Animación --- */
    `}>
      {sections.map((section) => (
        <InfoSection
          key={section.id}
          title={section.title}
          image={section.image_url}
          reversed={section.reversed}
          contentHtml={section.content_html}
        />
      ))}
    </section>
  );
};


// <!> croe que me gustaria tratarlo como un componente interno 
/**
 * Propiedades del bloque informativo `InfoSection`.
 * 
 * @interface InfoSectionProps
 * @property {string} title - Título del bloque.
 * @property {string} image - Ruta de la imagen ilustrativa.
 * @property {boolean} [reversed] - Determina si la imagen va a la izquierda o derecha.
 * @property {string} contentHtml - Texto estructurado en formato HTML.
 */
interface InfoSectionProps {
  title: string;
  image: string;
  reversed?: boolean;
  contentHtml: string;
}

/**
 * Componente modular para desplegar bloques de información con imagen lateral (`InfoSection`).
 * 
 * @component
 * @param {InfoSectionProps} props - Propiedades de renderizado.
 * @returns {JSX.Element} Bloque adaptable con soporte responsive.
 */
export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  image,
  reversed = false,
  contentHtml,
}) => {
  return (
    <article className={`
      /* --- Posición --- */
      flex                         /* Layout flexible */
      flex-col                     /* Columna por defecto en móvil */
      ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} /* Alterna orientación */
      items-center                 /* Centrado vertical */
      justify-between              /* Espaciado distribuido */

      /* --- Dimensiones --- */
      w-full                       /* Ancho completo */
      max-w-6xl                    /* Contenedor centralizado */
      mx-auto                      /* Centrado horizontal automático */
      py-10                        /* Padding vertical */
      px-6                         /* Padding horizontal */
      gap-8                        /* Separación entre texto e imagen */

      /* --- Colores --- */

      /* --- Texto --- */

      /* --- Animación --- */
    `}>
      {/* Columna de Texto */}
      <div className={`
        /* --- Posición --- */
        flex                       /* Layout flexible */
        flex-col                   /* Disposición en columna */

        /* --- Dimensiones --- */
        w-full                     /* Ancho total móvil */
        lg:w-1/2                   /* 50% en escritorio */

        /* --- Colores --- */

        /* --- Texto --- */

        /* --- Animación --- */
      `}>
        <h2 className={`
          /* --- Posición --- */

          /* --- Dimensiones --- */
          mb-4                     /* Margen inferior */

          /* --- Colores --- */
          text-vete-primary        /* Color institucional */

          /* --- Texto --- */
          text-3xl                 /* Tamaño base */
          md:text-4xl              /* Tamaño en pantallas medianas */
          font-extrabold           /* Grosor 800 */
          tracking-tight           /* Espaciado de letras ajustado */

          /* --- Animación --- */
        `}>
          {title}
        </h2>

        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */

            /* --- Colores --- */
            text-vete-text-base    /* Color tipográfico de lectura */

            /* --- Texto --- */
            text-base              /* Tamaño estándar */
            md:text-lg             /* Tamaño cómodo en desktop */
            leading-relaxed        /* Altura de línea cómoda */
            font-normal            /* Grosor regular */

            /* --- Animación --- */
          `}
        />
      </div>

      {/* Columna de Imagen */}
      <div className={`
        /* --- Posición --- */
        flex                       /* Layout flexible */
        items-center               /* Centrado */
        justify-center             /* Centrado */

        /* --- Dimensiones --- */
        w-full                     /* Ancho total móvil */
        lg:w-5/12                  /* Proporción balanceada */

        /* --- Colores --- */

        /* --- Texto --- */

        /* --- Animación --- */
      `}>
        <img
          src={image}
          alt={title}
          className={`
            /* --- Posición --- */

            /* --- Dimensiones --- */
            w-full                 /* Ocupa el ancho asignado */
            max-w-md               /* Límite de ancho */
            h-auto                 /* Mantiene proporción */
            object-contain         /* Ajuste sin deformar */

            /* --- Colores --- */

            /* --- Texto --- */

            /* --- Animación --- */
            transition-transform   /* Transición suave */
            duration-300           /* Velocidad 300ms */
            hover:scale-105        /* Efecto sutil al pasar el cursor */
          `}
        />
      </div>
    </article>
  );
};