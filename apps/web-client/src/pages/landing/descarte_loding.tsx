/* --- apps/web-client/src/pages/landing/sessions/ProductsSession.tsx --- */

import { Search, Loader2 } from 'lucide-react';
import { CategoryGroupCard } from '../../../components/CategoryGroupCard.tsx';
import { ProductCard } from '../../../components/ProductCard.tsx';
import { useProducts } from '../../../hooks/useProducts'; // <-- Nuestra Fachada

export const ProductsSession = ({ bgColor }: { bgColor: string }) => {
  /* Extraemos todo del cerebro (Hook) */
  const { searchTerm, setSearchTerm, categories, loading, filteredResults } = useProducts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="animate-spin text-vete-primary" size={48} />
        <p className="text-vete-primary font-bold italic">Cargando catálogo de Salto...</p>
      </div>
    );
  }

  return (
    <section className={`
      /* --- Posición --- */
      relative py-20 mt-10 px-6 md:px-16
      /* --- Colores --- */
      ${bgColor}
    `}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Buscador */}
        <div className="flex flex-col tablet-vete:flex-row tablet-vete:justify-between items-center gap-8 mb-16">
          <h2 className="text-4xl font-black italic text-vete-text-light uppercase tracking-tighter">
            Lista de <span className="text-vete-primary">Productos</span>
          </h2>

          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-text-light/50" size={20} />
            <input 
              type="text"
              placeholder="¿Qué estás buscando?"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border-2 border-vete-primary/30 text-vete-text-light focus:outline-none focus:border-vete-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Resultados o Categorías */}
        <div className="w-full">
          {searchTerm ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-vete-primary mb-8 italic">Resultados para "{searchTerm}"</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center">
                {filteredResults?.map(p => <ProductCard key={p.prod_id} producto={p} />)}
                {filteredResults?.length === 0 && <p className="text-white/50">No hay coincidencias.</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-20">
              {categories.map((cat) => (
                <CategoryGroupCard 
                  key={cat.cat_id}
                  title={cat.cat_nombre} 
                  catId={cat.cat_id} 
                  initialData={cat.productos} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSession;