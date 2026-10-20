// apps/web-client/src/pages/landing/sessions/MapsSession.tsx

/* =============================================================================
   COMPONENTE: SECCIÓN DE UBICACIÓN, HORARIOS Y MAPA (MapsSession)
   ============================================================================= */

import React from 'react';
import { MapPin, Clock, Stethoscope } from 'lucide-react';
import { useConfig } from '../../../context/tenant_context';

/**
 * Propiedades del componente `MapsSession`.
 * 
 * @interface MapsSessionProps
 * @property {string} [bgColor='bg-transparent'] - Clase opcional de Tailwind para el color de fondo exterior.
 */
export interface MapsSessionProps {
  bgColor?: string;
}

/**
 * Sección interactiva de geolocalización, horarios de atención y mapa (`MapsSession`).
 * 
 * Renderiza la dirección del local, los horarios de apertura, el bloque condicional
 * de urgencias 24h (controlado por feature flag) y el mapa embebido de Google Maps
 * contenido dentro de una tarjeta panorámica con bordes redondeados.
 *
 * @component
 * @param {MapsSessionProps} props - Propiedades de configuración visual.
 * @returns {JSX.Element | null} Sección de mapa interactiva o `null` si no hay URL configurada.
 */
export const MapsSession: React.FC<MapsSessionProps> = ({ bgColor = 'bg-transparent' }) => {
  /* ---------------------------------------------------------------------------
     1. CONSUMO DEL CONTEXTO MULTI-TENANT
     --------------------------------------------------------------------------- */
  const { config } = useConfig();

  const contact = config?.contact;
  const locationInfo = config?.location_section;

  /* ---------------------------------------------------------------------------
     2. EVALUACIÓN DE FLAGS CONDICIONALES
     --------------------------------------------------------------------------- */
  const hasEmergency = Boolean(
    config?.features?.has_emergency_button && contact?.emergency_phone
  );

  /* ---------------------------------------------------------------------------
     3. RETORNO TEMPRANO / GUARD CLAUSE
     --------------------------------------------------------------------------- */
  if (!contact?.google_maps_url) {
    return null;
  }

  return (
    <section className={`
      /* --- Posición --- */
      relative                     /* Contexto de posicionamiento */
      
      /* --- Dimensiones --- */
      w-full                       /* Ocupa el 100% del ancho */
      px-6                         /* Padding lateral móvil */
      md:px-16                     /* Padding lateral escritorio */
      py-20                        /* Espaciado vertical amplio */

      /* --- Colores --- */
      ${bgColor}                   /* Fondo exterior dinámico */


    `}>
      {/* CONTENEDOR PRINCIPAL: Tarjeta Panorámica que contiene Ambas Columnas */}
      <div className={`

        /* --- Posición --- */
        relative                     /*  Contexto de elevación */
        z-20                         /*  Por encima de la animación z-10 */
        
        flex                         /* Layout flexible */
        flex-col                     /* Columna en móvil */
        lg:flex-row                  /* Fila en pantallas grandes */
        items-center                 /* Centrado vertical */
        mx-auto                      /* Centrado horizontal automático */
        
        /* --- Dimensiones --- */
        max-w-7xl                    /* Límite de ancho de contenido */
        p-8                          /* Padding interno móvil */
        md:p-16                      /* Padding interno escritorio */
        gap-12                       /* Separación uniforme entre información y mapa */

        /* --- Colores --- */
        bg-vete-secondary            /* Fondo institucional suave */
        
        /* --- Estilo --- */
        rounded-[3rem]               /* Bordes redondeados pronunciados */

      `}>

        {/* ===================================================================
           LADO IZQUIERDO: Información, Horarios y Urgencias
           =================================================================== */}
        <div className={`
          /* --- Posición --- */
          flex                       /* Layout flexible */
          flex-col                   /* Disposición en columna */
          
          /* --- Dimensiones --- */
          w-full                     /* Ancho completo en móvil */
          lg:w-1/2                   /* 50% de ancho en escritorio */
          gap-8                      /* Separación vertical entre bloques */

        `}>
          {/* Encabezado Dinámico con Soporte HTML */}
          <div className="space-y-4">
            <h3
              dangerouslySetInnerHTML={{
                __html: locationInfo?.title_html || '¿<span class="text-vete-text-base"> Dónde estamos</span>?',
              }}
              className={`

                /* --- Colores --- */
                text-vete-primary          /* Color de marca principal */

                /* --- Texto --- */
                text-4xl                   /* Tamaño destacado */
                font-black                 /* Grosor 900 */
                italic                     /* Estilo cursivo editorial */
                leading-tight              /* Altura de línea compacta */

              `}
            />

            <p
              dangerouslySetInnerHTML={{
                __html:
                  locationInfo?.description_html ||
                  'Te esperamos con instalaciones de primera, equipadas con atención especializada.',
              }}
              className={`

                /* --- Colores --- */
                text-vete-text-base        /* Color tipográfico principal */
                opacity-90                 /* Suavizado leve */

                /* --- Texto --- */
                text-lg                    /* Tamaño de lectura */
                leading-relaxed            /* Altura de línea cómoda */

              `}
            />
          </div>

          {/* Bloque: Ubicación Física y Horarios */}
          <div className={`
            /* --- Posición --- */
            grid                       /* Layout en grilla */
            grid-cols-1                /* 1 columna vertical */

            /* --- Dimensiones --- */
            gap-6                      /* Separación entre bloques */
          `}>
            {/* 1. Bloque de Ubicación Física */}
            <div className={`
              /* --- Posición --- */
              flex                     /* Layout flexible */
              items-start              /* Alineación al inicio */
              gap-4                    /* Espacio icono-texto */
            `}>
              {/* Icono de Ubicación */}
              <div className={`
                /* --- Posición --- */
                flex                   /* Centrado */
                items-center           /* Centrado vertical */
                justify-center         /* Centrado horizontal */
                shrink-0               /* Evita compresión del icono */

                /* --- Dimensiones --- */
                p-3                    /* Padding interno */

                /* --- Colores --- */
                bg-vete-surface        /* Fondo blanco/tarjeta */
                text-vete-primary      /* Icono con color de marca */
                shadow-sm              /* Sombra suave */

                /* --- Estilo --- */
                rounded-2xl            /* Bordes redondeados */
              `}>
                <MapPin size={24} />
              </div>
              {/* Contenedor de texto */}
              <div className="flex flex-col">
                {/* Nombre de la clínica */}
                <p className={`

                  /* --- Colores --- */
                  text-vete-text-base  /* Color de lectura */

                  /* --- Texto --- */
                  text-lg              /* Tamaño destacado */
                  font-bold            /* Grosor 700 */
                `}>
                  {config?.business_name}
                </p>
                {/* Dirección de la clínica */}
                <p className={`
                  /* --- Colores --- */
                  text-vete-text-muted /* Color secundario */

                  /* --- Texto --- */
                  text-sm              /* Tamaño estándar */
                `}>
                  {contact.address}
                </p>
              </div>
            </div>

            {/* 2. Bloque de Horarios de Atención */}
            {contact.schedule && (
              <div className={`
                /* --- Posición --- */
                flex                   /* Layout flexible */
                items-start            /* Alineación al inicio */
                gap-4                  /* Espacio icono-texto */
              `}>
                {/* Icono de Horarios */}
                <div className={`
                  /* --- Posición --- */
                  flex                 /* Centrado */
                  items-center         /* Centrado vertical */
                  justify-center       /* Centrado horizontal */
                  shrink-0             /* Evita compresión */

                  /* --- Dimensiones --- */
                  p-3                  /* Padding interno */

                  /* --- Colores --- */
                  bg-vete-surface      /* Fondo de tarjeta claro */
                  text-vete-primary    /* Icono primario */
                  shadow-sm            /* Sombra suave */

                  /* --- Estilo --- */
                  rounded-2xl          /* Bordes redondeados */
                `}>
                  <Clock size={24} />
                </div>
                {/* Contenedor de texto */}
                <div className="flex flex-col">
                  <p className={`
                    /* --- Colores --- */
                    text-vete-text-base /* Color de lectura */
                    /* --- Texto --- */
                    text-lg            /* Tamaño destacado */
                    font-bold          /* Grosor 700 */

                    /* --- Animación --- */
                  `}>
                    Horarios de Atención
                  </p>
                  {/* Horarios de apertura */}
                  <p className={`
                    /* --- Colores --- */
                    text-vete-text-muted /* Color secundario */

                    /* --- Texto --- */
                    text-sm            /* Tamaño estándar */
                  `}>
                    {contact.schedule.weekdays}
                  </p>

                  {contact.schedule.saturdays && (
                    <p className={`¡
                      /* --- Colores --- */
                      text-vete-text-muted /* Color secundario */

                      /* --- Texto --- */
                      text-xs          /* Tamaño micro */
                    `}>
                      {contact.schedule.saturdays}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Bloque Condicional de Urgencias 24h */}
          {hasEmergency && (
            <div className={`
              /* --- Posición --- */
              flex                     /* Layout flexible */
              items-center             /* Centrado vertical */
              gap-4                    /* Espacio icono-texto */

              /* --- Dimensiones --- */
              p-4                      /* Padding interno */

              /* --- Colores --- */
              bg-vete-error/10         /* Fondo translúcido de error */
              border                   /* Borde habilitado */
              border-vete-error/30     /* Borde con color de alerta */

              /* --- Estilo --- */
              rounded-3xl              /* Bordes redondeados */


            `}>
              <div className={`
                /* --- Posición --- */
                flex                   /* Centrado */
                items-center           /* Centrado vertical */
                justify-center         /* Centrado horizontal */
                shrink-0               /* No deforma */

                /* --- Dimensiones --- */
                p-3                    /* Padding interno */

                /* --- Colores --- */
                bg-vete-error          /* Fondo sólido de error */
                text-white             /* Icono blanco */
                shadow-sm              /* Sombra */

                /* --- Estilo --- */
                rounded-2xl            /* Bordes redondeados */

                /* --- Animación --- */
                animate-pulse          /* Pulso de atención */
              `}>
                <Stethoscope size={24} />
              </div>
              <div>
                <p className={`
                  /* --- Colores --- */
                  text-vete-error      /* Color de alerta */

                  /* --- Texto --- */
                  text-lg              /* Tamaño destacado */
                  font-black           /* Grosor 900 */
                  uppercase            /* Mayúsculas */
                  tracking-tight       /* Letras compactas */

                  /* --- Animación --- */
                `}>
                  Emergencias 24 Horas
                </p>
                <p className={`

                  /* --- Colores --- */
                  text-vete-text-muted /* Color secundario */

                  /* --- Texto --- */
                  text-sm              /* Tamaño estándar */
                `}>
                  Tel: {contact.emergency_phone} — Disponibles en todo momento
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
           LADO DERECHO: Mapa Embebido con Badge Flotante
           =================================================================== */}
        <div className={`
          /* --- Posición --- */
          relative                     /* Contexto para el badge flotante */
          overflow-hidden              /* Contiene los bordes del iframe */
          
          /* --- Dimensiones --- */
          w-full                       /* Ancho completo en móvil */
          lg:w-1/2                     /* 50% de ancho en escritorio */
          h-[450px]                    /* Altura fija */

          /* --- Colores --- */

          /* --- Estilo --- */
          rounded-[2.5rem]             /* Bordes redondeados del contenedor */
          shadow-xl                    /* Sombra de profundidad */

          /* --- Animación --- */
        `}>
          {/* Badge Flotante sobre el mapa */}
          <div className={`
            /* --- Posición --- */
            absolute                   /* Flota sobre el iframe */
            top-1/2 left-1/2           /* Centrado absoluto */
            -translate-x-1/2           /* Ajuste en eje X */
            -translate-y-1/2           /* Ajuste en eje Y */
            z-10                       /* Por encima del iframe */
            flex                       /* Layout flexible */
            items-center               /* Centrado vertical */
            gap-3                      /* Espacio icono-texto */
            
            /* --- Dimensiones --- */
            px-6 py-3                  /* Padding interno */

            /* --- Colores --- */
            bg-vete-dark/90            /* Fondo oscuro institucional */
            backdrop-blur-md           /* Efecto de desenfoque */
            text-white                 /* Texto blanco */
            border                     /* Borde habilitado */
            border-white/10            /* Borde translúcido */
            shadow-2xl                 /* Sombra profunda */
            
            /* --- Estilo --- */
            rounded-2xl                /* Bordes redondeados */

          `}>
            <div className="bg-vete-primary p-2 rounded-lg text-white">
              <MapPin size={20} />
            </div>
            <span className="font-bold whitespace-nowrap">
              {config?.business_name}
            </span>
          </div>

          {/* Iframe Embebido de Google Maps */}
          <iframe
            title={`Ubicación ${config?.business_name}`}
            className={`

              /* --- Dimensiones --- */
              w-full                   /* Ocupa el 100% del contenedor */
              h-full                   /* Altura completa */

              /* --- Estilo --- */
              border-0                 /* Sin borde */
              grayscale-[20%]          /* Efecto estético */

              /* --- Animación --- */
              hover:grayscale-0        /* Color total en hover */
              transition-all           /* Transición fluida */
              duration-700             /* 700ms */
            `}
            src={contact.google_maps_url}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
};

export default MapsSession;