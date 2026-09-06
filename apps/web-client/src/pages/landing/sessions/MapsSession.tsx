/* --- apps/web-client/src/pages/landing/sessions/MapsSession.tsx --- */

import React from 'react';
import { MapPin, Clock, Stethoscope } from 'lucide-react';
import companyInfo from '../../../data/companyInfo.json';

export const MapsSession = ({ bgColor }: { bgColor: string }) => {
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
            <h3 className={`
              /* --- Texto --- */
              text-4xl                     /* Tamaño grande */
              font-black                   /* Peso máximo */
              italic                       /* Estilo cursivo */
              leading-tight                /* Altura de línea compacta */

              /* --- Colores --- */
              text-vete-primary            /* Verde marca */
            `}>
              ¿<span className='text-vete-text-light'> Dónde estamos</span>?
            </h3>
            <p className="text-lg opacity-90 leading-relaxed text-vete-secondary">
              Te esperamos en Salto con una <span className="font-bold text-xl">instalación de primera</span>, 
              equipada con sala de cirugía de vanguardia y atención especializada.
            </p>
          </div>

          {/* Bloques de Información */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Ubicación */}
            <div className="flex items-start gap-4">
              <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-vete-secondary text-lg">Salto, Uruguay</p>
                <p className="text-vete-secondary/70">{companyInfo.location.address}</p>
              </div>
            </div>

            {/* Horarios */}
            <div className="flex items-start gap-4">
              <div className="bg-white/60 p-3 rounded-2xl shadow-sm text-vete-primary shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <p className="font-bold text-vete-secondary text-xl">Horarios de Atención</p>
                <p className="text-vete-secondary/70 text-base">{companyInfo.location.schedule.weekdays}</p>
              </div>
            </div>

            {/* Emergencias 24h */}
            <div className={`
              /* --- Posición --- */
              flex items-center gap-4
              /* --- Dimensiones --- */
              p-4
              /* --- Colores --- */
              bg-red-500/5                 /* Fondo rojo muy tenue */
              border                       /* Borde habilitado */
              border-red-500/20            /* Color de borde sutil */
              /* --- Estilo --- */
              rounded-3xl
            `}>
              <div className="bg-red-500 p-3 rounded-2xl shadow-sm text-white shrink-0 animate-pulse">
                <Stethoscope size={24} />
              </div>
              <div>
                <p className="font-bold text-red-600 text-lg uppercase tracking-tight">Emergencias 24 Horas</p>
                <p className="text-vete-secondary/70 text-sm">Disponibles en todo momento para tu mascota</p>
              </div>
            </div>
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
            <span className="font-bold whitespace-nowrap">Salto, Uruguay</span>
          </div>

          <iframe
            title="Ubicación Veterinaria Beltramelli"
            className={`
              /* --- Dimensiones --- */
              w-full h-full
              /* --- Estilo --- */
              rounded-[2.5rem] shadow-inner
              grayscale-[20%]              /* Efecto estético de mapa */
              hover:grayscale-0            /* Color total al pasar el mouse */
              transition-all duration-700
            `}
            src={companyInfo.location.googleMapsUrl}
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