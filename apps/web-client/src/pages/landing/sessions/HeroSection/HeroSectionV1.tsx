/* --- apps/web-client/src/pages/landing/sessions/HeroSession.tsx --- */



/**
 * Sección Principal (Hero) de la web.
 * Optimizada para llenar mejor el espacio en resoluciones grandes y 
 * mantener la legibilidad extrema mediante el formato multilínea.
 */
export const HeroSessionV1 = ({ bgColor }: { bgColor: string }) => {
  return (
    <section className={`
      /* --- Posición --- */
      relative                     /* Base para elementos decorativos absolutos */
      
      /* --- Dimensiones --- */
      w-full                       /* Ocupa todo el ancho disponible */
      min-h-[80vh]                 /* Altura mínima para impacto visual */
      flex                         /* Contenedor flexible */
      items-center                 /* Centrado vertical del contenido */

      /* --- Colores --- */
      ${bgColor}                   /* Fondo dinámico recibido por props */
      overflow-hidden              /* Evita que sombras o imágenes desborden */
    `}>
      
      <div className={`
        /* --- Posición --- */
        relative                     /* Contexto para el z-index */
        z-10                         /* Por encima de posibles fondos */
        flex                         /* Contenedor flexible */
        flex-col                     /* Dirección vertical en móviles */
        
        /*Responsive a desktop-vete*/ 
        desktop-vete:flex-row        /* Dirección horizontal en pantallas grandes */
        items-center                 /* Centrado de los bloques */
        mx-auto                      /* Centrado horizontal del contenedor */

        /* --- Dimensiones --- */
        max-w-[1400px]               /* Aumentado de 1200 a 1400 para llenar el desktop */
        w-full                       /* Ocupa el ancho disponible */
        px-6                         /* Padding lateral móvil */
        md:px-16                     /* Padding lateral desktop */
        py-20                        /* Espaciado vertical generoso */
        gap-12                       /* Espacio entre texto e imagen */
      `}>

        {/* Bloque de Texto */}
        <div className={`
          /* --- Posición --- */
          flex                         /* Contenedor flexible */
          flex-col                     /* Alineación vertical */
          items-center                 /* Centrado en móvil */
          desktop-vete:items-start     /* Alineado a la izquierda en desktop */
          
          /* --- Dimensiones --- */
          w-full                       /* Ancho total en móvil */
          desktop-vete:w-1/2           /* Mitad del ancho en desktop */

          /* --- Texto --- */
          text-center                  /* Texto centrado en móvil */
          desktop-vete:text-left       /* Texto a la izquierda en desktop */
        `}>
          
          <h1 className={`
            /* --- Texto --- */
            text-6xl                     /* Tamaño masivo en móvil */
            md:text-8xl                  /* Tamaño gigante en desktop para evitar vacío */
            font-black                   /* Peso máximo de fuente */
            leading-[0.95]               /* Altura de línea muy compacta y moderna */
            tracking-tighter             /* Letras apretadas para estilo editorial */
            
            /* --- Dimensiones --- */
            mb-8                         /* Margen inferior */

            /* --- Colores --- */
            text-vete-primary            /* Color verde principal */
          `}>
            <span className="whitespace-nowrap">
              Cuidamos <span className="text-vete-text-light">a</span>
            </span> <br />
            <span className="text-vete-text-light">quienes</span> amas
          </h1>

          <p className={`
            /* --- Texto --- */
            text-xl                      /* Tamaño de fuente legible */
            md:text-2xl                  /* Más grande en desktop para llenar espacio */
            leading-relaxed              /* Altura de línea cómoda para lectura */
            font-medium                  /* Peso medio */
            
            /* --- Dimensiones --- */
            max-w-xl                     /* Límite de ancho para no cansar la vista */

            /* --- Colores --- */
            text-vete-text-light         /* Color claro de la paleta */
            opacity-90                   /* Suavizado leve */
          `}>
            Tu mascota merece la mejor atención médica en un ambiente cálido y
            profesional. Contamos con especialistas comprometidos con el bienestar
            integral de tus compañeros.
          </p>

          {/* Botones de Acción (Opcional, para mejorar el CTA) <!> Esto me gusta pero tendria que agregarle una accion y mejorar el boton */}
          <div className="flex gap-4 mt-10">
             <button className={`
                /* --- Dimensiones --- */
                px-8 py-4
                /* --- Colores --- */
                bg-vete-primary text-white
                /* --- Estilo --- */
                rounded-2xl font-bold shadow-xl
                /* --- Animación --- */
                hover:scale-105 transition-transform
             `}>
                Agendar Cita
             </button>
          </div>
        </div>

        {/* Bloque de Imagen */}
        <div className={`
          /* --- Posición --- */
          hidden                       /* Oculto en móviles */
          desktop-vete:flex            /* Visible solo en desktop */
          justify-end                  /* Alineado al extremo derecho */
          relative                     /* Para efectos decorativos */

          /* --- Dimensiones --- */
          w-full                       /* Ancho total */
          desktop-vete:w-1/2           /* Mitad del ancho */
        `}>
          <img
            src="/images/branding/HeroSection.png"
            alt="Mascotas Beltramelli"
            className={`
              /* --- Dimensiones --- */
              w-full                   /* Ocupa el ancho del contenedor */
              max-w-[650px]            /* Límite para que no sea gigante */
              h-auto                   /* Mantiene proporción */
              max-h-[800px]            /* Límite de altura */

              /* --- Estilo --- */
              rounded-[4rem]           /* Bordes muy redondeados (Figma style) */
              shadow-2xl               /* Sombra profunda para dar relieve */
              object-cover             /* Asegura que la imagen llene el espacio */
              border-[12px]            /* Marco grueso */
              border-white/10          /* Color del marco traslúcido */
            `}
          />
          
          {/* Elemento decorativo para llenar el vacío */}
          <div className={`
            /* --- Posición --- */
            absolute -bottom-6 -left-6
            z-[-1]
            /* --- Dimensiones --- */
            w-64 h-64
            /* --- Colores --- */
            bg-vete-primary/20
            /* --- Estilo --- */
            rounded-full blur-3xl
          `} />
        </div>

      </div>
    </section>
  );
};

export default HeroSessionV1;



