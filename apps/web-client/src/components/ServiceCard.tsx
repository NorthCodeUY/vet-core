// apps/web-client/src/components/ServiceCard.tsx

/* =============================================================================
   COMPONENTE: TARJETA DE SERVICIO VETERINARIO (ServiceCard)
   ============================================================================= */

import React, { useState } from 'react';
import { ChevronDown, Tractor, Sparkles } from 'lucide-react';
import PequenosAIcon from '../assets/branding/guella.svg?react';
import EquinoIcon from '../assets/branding/caballo.svg?react';
import { WhatsAppDynamicButton } from './WhatsAppDynamicButton';



/**
 * Registro de iconos visuales para la sección de servicios.
 * Mapea la clave string enviada en el JSON con el componente SVG correspondiente.
 */
const ICON_MAP: Record<string, React.ReactNode> = {
  produccion: <Tractor className="w-8 h-8 text-vete-primary" />,
  pequeñosAnimales: <PequenosAIcon className="w-8 h-8 text-vete-primary" />,
  Equino: <EquinoIcon className="w-8 h-8 text-vete-primary" />,
};

/**
 * Propiedades del componente `ServiceCard`.
 * 
 * @interface ServiceCardProps
 * @property {string} title - Título del servicio ofrecido.
 * @property {string} description - Explicación detallada del servicio.
 * @property {string[]} [items=[]] - Lista de sub-procedimientos o viñetas a mostrar.
 * @property {string} iconKey - Clave para seleccionar el icono en `ICON_MAP`.
 * @property {string} message - Mensaje preconfigurado de WhatsApp.
 * @property {string} phone - Teléfono de administración de la empresa.
 */
export interface ServiceCardProps {
  title: string;
  description: string;
  items?: string[];
  iconKey: string;
  message: string;
  phone: string;
}

/**
 * Tarjeta interactiva de servicio con soporte de acordeón (`ServiceCard`).
 * 
 * Muestra el icono de categoría, título, descripción y una lista de prestaciones.
 * Si el servicio incluye más de 3 prestaciones, habilita un botón de despliegue
 * animado y oscurece el fondo con un backdrop modal.
 *
 * @component
 * @param {ServiceCardProps} props - Propiedades de renderizado.
 * @returns {JSX.Element} Tarjeta con llamada a la acción y vista expandible.
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  items = [],
  iconKey,
  message,
  phone,
}) => {
  /* ---------------------------------------------------------------------------
     ESTADO LOCAL: Control de Expansión
     --------------------------------------------------------------------------- */
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  /* Paginación visual: muestra 3 elementos o la lista completa si se expande */
  const visibleItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  /* Icono seleccionado o fallback por defecto */
  const SelectedIcon = ICON_MAP[iconKey] || <Sparkles className="w-8 h-8 text-vete-primary" />;
  
/* --- Lógica de Envío de Consulta por WhatsApp --- */
  const handleServiceRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const rawDigits = phone.replace(/\D/g, '');
    const cleanDigits = rawDigits.startsWith('0') ? rawDigits.slice(1) : rawDigits;
    const finalPhone = `598${cleanDigits}`;

    const defaultMsg = `¡Hola! Me gustaría realizar una consulta sobre el servicio de *${title}*.`;
    const targetUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message || defaultMsg)}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };
  return (
    <>
      {/* Backdrop oscuro al expandir la tarjeta */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className={`
            /* --- Posición --- */
            fixed                        /* Fijo sobre toda la ventana */
            inset-0                      /* Ocupa el 100% de la pantalla */
            z-40                         /* Por debajo de la tarjeta expandida */

            /* --- Colores --- */
            bg-vete-overlay/60           /* Fondo oscurecido con opacidad */

            /* --- Animación --- */
            transition-opacity           /* Transición de entrada */
            duration-300                 /* Tiempo de 300ms */
          `}
        />
      )}

      {/* Contenedor Principal de la Tarjeta */}
      <article className={`
        /* --- Posición --- */
        relative                         /* Contenedor relativo */
        flex                             /* Layout flexible */
        flex-col                         /* Disposición en columna */
        justify-between                  /* Distribución vertical */
        ${isExpanded ? 'z-50' : 'z-10'}  /* Capa superior al expandir */

        /* --- Dimensiones --- */
        w-full                           /* Ancho completo adaptativo */
        max-w-[350px]                    /* Ancho máximo uniforme */
        p-8                              /* Padding interno generoso */

        /* --- Colores --- */
        bg-vete-surface                  /* Fondo claro configurado en el tema */
        ${isExpanded ? 'shadow-2xl' : 'shadow-sm hover:shadow-md'} /* Sombra dinámica */

        /* --- Estilo --- */
        rounded-[20px]                   /* Bordes redondeados de diseño */

        /* --- Animación --- */
        transition-all                   /* Transición fluida */
        duration-300                     /* Tiempo de 300ms */
        ${isExpanded ? 'scale-105' : 'scale-100'} /* Aumento de escala al expandir */
      `}>
        
        {/* ===================================================================
           BLOQUE SUPERIOR: Icono y Textos
           =================================================================== */}
        <div>
          {/* Contenedor del Icono */}
          <div className={`
            /* --- Posición --- */
            flex                         /* Centrado flexbox */
            items-center                 /* Centrado vertical */
            justify-center               /* Centrado horizontal */
            self-center                  /* Centrado en el eje transversal */
            mx-auto                      /* Centrado horizontal automático */

            /* --- Dimensiones --- */
            w-14                         /* Ancho fijo de 3.5rem */
            h-14                         /* Alto fijo de 3.5rem */
            mb-6                         /* Margen inferior */

            /* --- Colores --- */
            bg-vete-secondary            /* Color secundario institucional */

            /* --- Estilo --- */
            rounded-[10px]               /* Bordes redondeados sutiles */

          `}>
            {SelectedIcon}
          </div>

          {/* Título del Servicio */}
          <h3 className={`
            /* --- Dimensiones --- */
            mb-3                         /* Margen inferior */

            /* --- Colores --- */
            text-vete-primary            /* Color principal de marca */

            /* --- Texto --- */
            text-2xl                     /* Tamaño destacado */
            font-bold                    /* Grosor 700 */
            text-center                  /* Texto centrado */

          `}>
            {title}
          </h3>

          {/* Descripción del Servicio */}
          <p className={`
            /* --- Dimensiones --- */
            mb-6                         /* Margen inferior */

            /* --- Colores --- */
            text-vete-text-muted         /* Color atenuado */

            /* --- Texto --- */
            text-base                    /* Tamaño estándar */
            leading-relaxed              /* Altura de línea cómoda */
            text-center                  /* Texto centrado */

          `}>
            {description}
          </p>

          {/* Lista de Prestaciones / Viñetas */}
          <ul className={`
            /* --- Posición --- */
            flex                         /* Layout flexible */
            flex-col                     /* Columna */

            /* --- Dimensiones --- */
            space-y-4                    /* Espaciado vertical entre ítems */
            mb-8                         /* Margen inferior */

          `}>
            {visibleItems.map((item, idx) => (
              <li
                key={idx}
                className={`
                  /* --- Posición --- */
                  flex                   /* Layout flexible */
                  items-center           /* Centrado vertical */
                  gap-3                  /* Espacio punto-texto */

                  /* --- Colores --- */
                  text-vete-text-base    /* Color de texto de lectura */

                  /* --- Texto --- */
                  font-medium            /* Grosor medio (500) */

                  /* --- Animación --- */
                  animate-in             /* Entrada animada */
                  fade-in                /* Desvanecimiento suave */
                `}
              >
                {/* Viñeta Circular */}
                <div className={`
                  /* --- Posición --- */
                  shrink-0               /* No se comprime */

                  /* --- Dimensiones --- */
                  w-1.5                  /* Diámetro de 6px */
                  h-1.5                  /* Diámetro de 6px */

                  /* --- Colores --- */
                  bg-vete-muted          /* Color de punto secundario */

                  /* --- Estilo --- */
                  rounded-full           /* Círculo */

                `} />
                <span className="text-lg leading-none">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===================================================================
           BLOQUE INFERIOR: Botón de WhatsApp y Gatillo de Acordeón
           =================================================================== */}
        <div className={`
          /* --- Posición --- */
          flex                           /* Layout flexible */
          flex-col                       /* Disposición vertical */
          gap-4                          /* Espacio botón-flecha */

          /* --- Dimensiones --- */
          w-full                         /* Ancho completo */
        `}>
          <WhatsAppDynamicButton
            label="Realizar Consulta"
            hoverLabel="Enviar Mensaje"
            onClick={handleServiceRequest}
            colorToken="vete-primary"
          />

          {/* Flecha para Expandir/Colapsar prestaciones */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Ver menos prestaciones' : 'Ver todas las prestaciones'}
              aria-label={isExpanded ? 'Ver menos prestaciones' : 'Ver todas las prestaciones'}
              className={`
                /* --- Posición --- */
                flex                     /* Centrado */
                items-center             /* Centrado vertical */
                justify-center           /* Centrado horizontal */
                mx-auto                  /* Centrado en bloque */

                /* --- Dimensiones --- */
                p-1                      /* Padding táctil */

                /* --- Colores --- */
                text-vete-primary        /* Color principal */

                /* --- Animación --- */
                hover:scale-110          /* Aumento sutil al pasar el cursor */
                transition-transform     /* Transición fluida */
              `}
            >
              <ChevronDown
                size={20}
                className={`
                  /* --- Animación --- */
                  transition-transform   /* Rotación fluida */
                  duration-500           /* Velocidad de 500ms */
                  ${isExpanded ? 'rotate-180' : 'rotate-0'}
                `}
              />
            </button>
          )}
        </div>
      </article>
    </>
  );
};