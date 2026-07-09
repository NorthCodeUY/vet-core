// app/vet-core/apps/web-client/src/pages/landing/sessions/ProductsSession.tsx

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CategoryGroupCard } from '../../../components/CategoryGroupCard.tsx';
import { ProductCard } from '../../../components/ProductCard.tsx';

import productsData from '../../../data/productos.json';

export const ProductsSession = ({ bgColor }: { bgColor: string }) => {
  // --- ESTADO ---
  // Guardamos lo que el usuario escribe en la barrita de búsqueda.
  // searchTerm: el texto actual. setSearchTerm: la función para cambiarlo.
  const [searchTerm, setSearchTerm] = useState(""); // Estado que maneja el input de busqueda

  // --- LÓGICA DE FILTRADO (MEMOIZADA) ---
  // useMemo hace que esta búsqueda SOLO se ejecute cuando cambia 'searchTerm'.
  // Esto ahorra batería y memoria en el celular del cliente.
  const filteredResults = useMemo(() => {
    // 1. Si no hay nada escrito (está vacío), devolvemos 'null' para indicar que no hay búsqueda activa.
    if (!searchTerm) return null;

    // 2. Unificamos todas las categorías en una sola "gran bolsa" para buscar en todo el local.
    // Usamos el operador spread (...) para sacar los productos de sus listas y juntarlos.
    const all = [...productsData.racion, ...productsData.accesorios];

    // 3. Filtramos: Devolvemos solo los productos cuyo título O descripción coincidan con la búsqueda.

    return all.filter(p =>
      p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || // .toLowerCase() convierte todo a minúsculas para que "perro" encuentre "Perro".
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) // .includes() busca si el texto existe dentro de la frase
    );
  }, [searchTerm]);// se define esta funcion cada vez que 'searchTerm' cambie

  return (
    <section className={`${bgColor} px-6 md:px-16 py-20 mt-10`}>
      <div className="max-w-[1400px] mx-auto">

        {/* --- CONTENEDOR CABECERA DE PRODUCTOS --- */}
        <div className="
          /* --- Posición --- */
          flex flex-col tablet-vete:flex-row      /* Vertical en móvil, horizontal en 858px */
          tablet-vete:justify-between            /* Separa título de buscador en desktop */
          items-center                           /* Centrado vertical perfecto */
          gap-8                                  /* Distancia entre elementos */
          mb-16                                  /* Margen inferior del bloque entero */
        ">

          {/* Titulo de la lista de productos */}
          <h2 className="
              /* --- Texto --- */
              text-4xl font-black italic text-vete-text-light 
              uppercase tracking-tighter
              /* --- Ajuste --- */
              tablet-vete:mb-0   /* Quitamos margen para centrar con el buscador */
            ">
            Lista de <span className="text-vete-primary">Productos</span>
          </h2>

          {/* BUSCADOR */}
          <div className="
            /* --- Posición --- */
            relative w-full max-w-md /* Ancho completo en móvil hasta 448px */
            /* --- Decoración --- */
            group
          ">
            <Search className="
              /* --- Icono --- */
              absolute left-4 top-1/2 -translate-y-1/2 text-vete-text-light 
              group-focus-within:scale-110 transition-transform"
              size={20}
            />
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="
                /* --- Estructura --- */
                w-full pl-12 pr-4 py-4 rounded-2xl 
                /* --- Colores --- */
                bg-white/10 border-2 border-vete-primary/30 text-vete-text-light 
                /* --- Estados --- */
                placeholder:text-vete-text-light/40 focus:outline-none focus:border-vete-primary 
                focus:bg-white/20 transition-all shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // cada vez que el usuario escribe algo, actualiza el estado 'searchTerm'
            />
          </div>
        </div>

        {/* contenedor del titulo */}
        <div className=''>
          {/* --- RENDERIZADO CONDICIONAL --- */}
          {searchTerm ? ( // si hay algo en searchTerm muestra los resultados, si no, muestra el catalogo normal
            // Vista de Resultados
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Titulo de los resultados*/}
              <h3 className="text-2xl font-bold text-vete-primary mb-8 italic">Resultados para "{searchTerm}"</h3>
              {/* Grid de resultados*/}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
                {/* Itera sobre los resultados y muestra la tarjeta de producto*/}
                {filteredResults?.map(p => <ProductCard key={p.id} title={p.titulo} desc={p.descripcion} price={p.precio} img={p.imagen} />)}
                {/* Si no hay resultados muestra un mensaje*/}
                {filteredResults?.length === 0 && <p className="text-white/50">No se encontraron productos.</p>}
              </div>
            </div>
          ) : (
            // Vista Normal por Categorías
            <div className="space-y-20">
              <CategoryGroupCard title="Ración" data={productsData.racion} />
              <CategoryGroupCard title="Accesorios" data={productsData.accesorios} />
              {/* Agregá Medicamentos aquí cuando el JSON esté listo */}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
export default ProductsSession;