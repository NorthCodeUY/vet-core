// 16 / 07 / 2026  16:30 Version Codigo del nav que no supe como poner 

          <div className={`
            /* --- Dimensiones --- */
            w-10 h-10                    /* Tamaño del avatar */
            
            /* --- Colores --- */
            bg-vete-primary/20           /* Fondo tenue */
            border-2                     /* Borde del avatar */
            border-vete-primary          /* Color verde marca */
            
            /* --- Estilo --- */
            rounded-full                 /* Círculo perfecto */
            overflow-hidden              /* Corta la imagen interna */
          `}>

            
            {user.isLoggedIn ? (
              <img 
                src="/images/avatars/user.png" 
                alt="Usuario" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-full h-full p-2 text-vete-primary" />
            )}
          </div>
          <ChevronDown size={14} className="opacity-50" />
        </div>

      </nav>
    </header>
  );
};








/* --- Lógica de transformación de datos --- */
const mapApiToProduct = (backendProducts: any[]): ApiProduct[] => {
  return backendProducts.map(p => ({
    
    
    /* Esto es una forma mas corta de hacerlo */
    mainImage = p.rel_imagen_url?.find( // Encuentra la imagen principal 
      (ipmg: any) => img.img_principal) 
                      || p.rel_imagen_url?.[0] 
                      || { img_url: '/images/placeholder.png', img_id: 0 };     
    
    prod_id: p.prod_id,
    prod_nombre: p.prod_nombre,
    prod_precio: p.prod_precio,
    prod_descripcion: p.prod_descripcion,
    
    /* Buscamos la imagen que tenga img_principal: true */
    imagen_principal_url: p.rel_imagen_url.find((img: any) => img.img_principal) || p.rel_imagen_url[0],
    
    /* Filtramos las que no son principales */
    imagenes_secundarias_url: p.rel_imagen_url.filter((img: any) => !img.img_principal),
    
    /* Mapeamos las subcategorías */
    subcategoria: p.rel_subcategoria.map((sub: any) => ({ subc_nombre: sub.subc_nombre }))
  
  
  
  
  
  }));
};







// HederSession.tsx

/* --- Color de texto --- */
      ${isScrolled ? 
        'text-vete-secondary' 
        : 
        'text-vete-light'}  /* Color de texto negro si no hay scroll o  si hay scroll  */




// Version 18 / 07 / 2026 no funciona

/* --- Lógica de transformación de datos --- */
const mapApiToProduct = (backendProducts: any[]): ApiProduct[] => {
  return backendProducts.map(p => ({
    prod_id: p.prod_id,
    prod_nombre: p.prod_nombre,
    prod_precio: p.prod_precio,
    prod_descripcion: p.prod_descripcion,
    
    /* Buscamos la imagen que tenga img_principal: true */
    imagen_principal_url: p.rel_imagen_url.find((img: any) => img.img_principal) || p.rel_imagen_url[0],
    
    /* Filtramos las que no son principales */
    imagenes_secundarias_url: p.rel_imagen_url.filter((img: any) => !img.img_principal),
    
    /* Mapeamos las subcategorías */
    subcategoria: p.rel_subcategoria.map((sub: any) => ({ subc_nombre: sub.subc_nombre }))
  }));
};





// ))/////




// apps/web-client/src/pages/landing/sessions/HeroSession.tsx



// <!DMI> Seccion Principal de la web  Compuesto de 2 div uno con el texto y otro 
// bgColor: string -> Color de fondo de la seccion

// <!>  En la version desktop queda muy vasio queda todo al medio y no queda bien abria que plantear
// agrandar la letar o algo y que la imagen el limite sea mas grande NO quea bien en resoluiones grandes 
// Estaria bueno agregar animacion de 3 fotos para la version grande para que me jore el contenido 
// 
const HeroSession = ({ bgColor }: { bgColor: string }) => {
  return (
    /* 
      1. Agregamos un wrapper (div) o usamos la sección como contenedor.
      2. 'max-w-[1200px]' limita el crecimiento en pantallas ultra-anchas.
      3. 'mx-auto' centra todo el bloque horizontalmente.
    */
    <section className={`relative w-full ${bgColor}`}>
      <div className=" max-w-[1200px] mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row items-center gap-10 relative z-10">

        {/* Lado del Texto: Limitamos el ancho para que no se estire de más */}
        <div className="w-full desktop-vete:w-1/2 text-center desktop-vete:text-left flex flex-col items-center desktop-vete:items-start">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-vete-primary">
            <span className="whitespace-nowrap">Cuidamos <span className='text-vete-text-light'>a</span></span> <br />
            <span className="text-vete-text-light">quienes</span> amas
          </h1>

          {/* text-lg  _ text-white*/}
          <p className="text-vete-body opacity-90 max-w-md leading-relaxed ">
            Tu mascota merece la mejor atención médica en un ambiente cálido y
            profesional. Contamos con especialistas comprometidos con el bienestar
            integral de tus compañeros, brindando cuidado, dedicación y confianza
            en cada etapa de su vida.
          </p>
        </div>

        {/* Lado de la Imagen: Controlamos el tamaño máximo para que no sea 'gigante' */}
        <div className="hidden desktop-vete:flex w-full md:w-1/2 justify-center desktop-vete:justify-end relative">
          <img
            src="/images/branding/HeroSection.png"
            className="rounded-[3rem] shadow-2xl object-cover max-w-full h-auto lg:max-h-[1100px]"
            alt="Mascotas"
          />
        </div>

      </div>

    </section>
  )
};