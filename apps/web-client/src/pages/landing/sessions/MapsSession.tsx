/* --- apps/web-client/src/pages/landing/sessions/MapsSession.tsx --- */

import React from 'react';
import { MapPin, Clock, Stethoscope } from 'lucide-react';
import { useConfig } from '../../../context/tenant_context';



/**
 * Propiedades del componente `MapsSession`.
 * 
 * @interface MapsSessionProps
 * @property {string} [bgColor] - Clase opcional de Tailwind para el color de fondo exterior.
 */
export interface MapsSessionProps {
  bgColor?: string;
}

/**
 * Sección interactiva de ubicación geográfica y horarios de atención (`MapsSession`).
 * 
 * Renderiza la dirección física del local, los horarios de apertura estructurados,
 * el módulo condicional de urgencias 24h (activado mediante feature flag) y un mapa
 * embebido de Google Maps con badge flotante institucional.
 * 
 * Consume toda la información de forma dinámica desde el contexto `TenantContext`.
 *
 * @component
 * @param {MapsSessionProps} props - Propiedades de estilo y configuración visual.
 * @returns {JSX.Element | null} Sección de mapa interactiva o `null` si no hay URL configurada.
 */
export const MapsSession: React.FC<MapsSessionProps> = ({ bgColor = 'bg-transparent' }) => {
  /* 1. Consumo del contexto multi-tenant */
  const { config } = useConfig();

  const contact = config?.contact;
  const locationInfo = config?.location_section;

  /* 2. Flag condicional para urgencias 24h */
  const hasEmergency = config?.features?.has_emergency_button && Boolean(contact?.emergency_phone);

  /* 3. Retorno seguro si no hay mapa configurado */
  if (!contact?.google_maps_url) {
    return null;
  } else

    return (
      <section className={`
      /* --- Posición --- */
      relative                     /* Contexto para elementos internos */
      
      /* --- Dimensiones --- */
      w-full                       /* Ancho total */
      px-6                         /* Padding lateral móvil */
      md:px-16                     /* Padding lateral desktop */
      py-20                        /* Espaciado vertical */

      /* --- Colores --- */
      ${bgColor}                   /* Fondo dinámico */
    `}>

        <div className={`
        /* --- Posición --- */
        flex                         /* Contenedor flexible */
        flex-col                     /* Columna en móvil */
        lg:flex-row                  /* Fila en pantallas grandes */
        items-center                 /* Centrado vertical */
        mx-auto                      /* Centrado horizontal */
        
        /* --- Dimensiones --- */
        max-w-7xl                    /* Límite de ancho de contenido */
        p-8                          /* Padding interno móvil */
        md:p-16                      /* Padding interno desktop */
        gap-12                       /* Espacio entre info y mapa */

        /* --- Colores --- */
        bg-vete-soft                 /* Fondo crema suave de la marca */
        
        /* --- Estilo --- */
        rounded-[3rem]               /* Bordes muy redondeados Figma */
      `}>

          {/* LADO IZQUIERDO: Información */}
          <div className={`
          /* --- Posición --- */
          flex                         /* Contenedor flexible */
          flex-col                     /* Dirección vertical */
          
          /* --- Dimensiones --- */
          w-full                       /* Ancho total móvil */
          lg:w-1/2                     /* Mitad del ancho en desktop */
          gap-8                        /* Espacio entre bloques */
        `}>

            <div className="space-y-4">
              {/* Título Dinámico con Soporte HTML */}
              <h3
                dangerouslySetInnerHTML={{
                  __html: locationInfo?.title_html || '¿<span class="text-vete-text-base"> Dónde estamos</span>?',
                }}
                className={`
                /* --- Colores --- */
                text-vete-primary            /* Color de marca principal */

                /* --- Texto --- */
                text-4xl                     /* Tamaño destacado */
                font-black                   /* Grosor 900 */
                italic                       /* Estilo cursivo */
                leading-tight                /* Altura de línea compacta */
              `}
              />

              {/* Bajada Descriptiva Dinámica */}
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    locationInfo?.description_html ||
                    'Te esperamos con instalaciones de primera, equipadas con atención especializada.',
                }}
                className={`
                /* --- Colores --- */
                text-vete-text-base          /* Color tipográfico de lectura */
                opacity-90                   /* Suavizado leve */

                /* --- Texto --- */
                text-lg                      /* Tamaño de lectura */
                leading-relaxed              /* Altura de línea cómoda */
              `}
              />
            </div>





            {/* Bloques de Información */}
            <div className="grid grid-cols-1 gap-6">

              {/* Ubicación */}
              <div className="flex items-start gap-4">
                <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-vete-secondary text-lg">{config?.business_name}</p>{/* <!> Esto no se si esta bien revisar  */}
                  <p className="text-vete-secondary/70">{contact.address}</p>
                </div>
              </div>

              {/* Horarios */}
              <div className="flex items-start gap-4">
                <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="font-bold text-vete-secondary text-xl">Horarios de Atención</p>
                  <p className="text-vete-text-muted text-base">{contact.schedule?.weekdays}</p>
                  {contact.schedule?.saturdays && (
                    <p className="text-vete-text-muted text-sm">{contact.schedule?.saturdays}</p>
                  )}
                </div>
              </div>


              {/* Bloque Condicional de Urgencias 24h */}
              {hasEmergency && (
                <div className={`
                /* --- Posición --- */
                flex                         /* Layout flexible */
                items-center                 /* Centrado vertical */
                gap-4                        /* Espacio icono-texto */

                /* --- Dimensiones --- */
                p-4                          /* Padding interno */

                /* --- Colores --- */
                bg-vete-error/10             /* Fondo translúcido de error */
                border                       /* Borde habilitado */
                border-vete-error/30         /* Borde con color de alerta */

                /* --- Estilo --- */
                rounded-3xl                  /* Bordes redondeados */
              `}>

                  <div className="bg-vete-error p-3 rounded-2xl shadow-sm text-white shrink-0 animate-pulse">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-vete-error text-lg uppercase tracking-tight">
                      Emergencias 24 Horas
                    </p>
                    <p className="text-vete-text-muted text-sm">
                      Tel: {contact.emergency_phone} — Disponibles en todo momento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LADO DERECHO: Mapa */}
          <div className={`
          /* --- Posición --- */
          relative                     /* Para el badge flotante */
          
          /* --- Dimensiones --- */
          w-full                       /* Ancho total móvil */
          lg:w-1/2                     /* Mitad del ancho desktop */
          h-[450px]                    /* Altura fija */
        `}>

            {/* Badge Flotante sobre el mapa */}
            <div className={`
            /* --- Posición --- */
            absolute                     /* Flota sobre el iframe */
            top-1/2 left-1/2             /* Centrado absoluto */
            -translate-x-1/2             /* Ajuste de centrado */
            -translate-y-1/2             /* Ajuste de centrado */
            z-10                         /* Por encima del mapa */
            
            /* --- Dimensiones --- */
            px-6 py-3                    /* Padding interno */
            flex items-center gap-3      /* Alineación interna */

            /* --- Colores --- */
            bg-vete-secondary/90         /* Azul oscuro con opacidad */
            backdrop-blur-md             /* Efecto de desenfoque */
            text-white                   /* Texto blanco */
            
            /* --- Estilo --- */
            rounded-2xl shadow-2xl border border-white/10
          `}>
              <div className="bg-vete-primary p-2 rounded-lg">
                <MapPin size={20} />
              </div>
              <span className="font-bold whitespace-nowrap">{config?.business_name}</span>
            </div>

            <iframe
              title={`Ubicación ${config?.business_name}`}
              className={`
              /* --- Dimensiones --- */
              w-full h-full
              /* --- Estilo --- */
              rounded-[2.5rem] shadow-inner
              grayscale-[20%]              /* Efecto estético de mapa */
              hover:grayscale-0            /* Color total al pasar el mouse */
              transition-all duration-700
            `}
              src={contact.google_maps_url}
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </section>
    );
};

export default MapsSession;