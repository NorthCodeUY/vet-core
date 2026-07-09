/* --- apps/web-client/src/features/landing/LandingPage.tsx --- */

const ProductsSection = ({ bgColor }: { bgColor: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<any[]>([]); // Estado para los datos del backend
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos del Backend al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/productos`);
        const data = await response.json();
        setCategories(data); // Guardamos el JSON que me pasaste
      } catch (error) {
        console.error("Error en la vete:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Lógica de búsqueda (Aplanamos el JSON para buscar en todos los productos)
  const filteredResults = useMemo(() => {
    if (!searchTerm) return null;
    // Juntamos todos los productos de todas las categorías en una sola lista
    const allProducts = categories.flatMap(cat => cat.productos);
    
    return allProducts.filter(p => 
      p.prod_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prod_descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categories]);

  if (loading) return <div className="text-white text-center py-20">Cargando productos de Salto...</div>;

  return (
    <section className={`${bgColor} px-6 md:px-16 py-20 mt-10`}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header con Buscador (Igual al tuyo) */}
        <div className="flex flex-col tablet-vete:flex-row tablet-vete:justify-between items-center gap-8 mb-16">
          <h2 className="text-4xl font-black italic text-vete-text-light uppercase tracking-tighter">
            Lista de <span className="text-vete-primary">Productos</span>
          </h2>

          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-vete-text-light" size={20} />
            <input 
              type="text"
              placeholder="¿Qué estás buscando?"
              className={`
                /* --- Dimensiones --- */
                w-full                       /* Ancho total */
                pl-12                        /* Espacio para icono */
                pr-4                         /* Padding derecho */
                py-4                         /* Padding vertical */
                
                /* --- Estilo --- */
                rounded-2xl                  /* Bordes redondeados */
                bg-white/10                  /* Fondo oscuro traslúcido */
                border-2                     /* Borde */
                border-vete-primary/30       /* Color marca */
                text-vete-text-light         /* Texto claro */
                
                /* --- Animación --- */
                focus:border-vete-primary    /* Resalta al escribir */
                transition-all               /* Suavidad */
              `}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          {searchTerm ? (
            /* Vista de Resultados */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold text-vete-primary mb-8 italic">Resultados para "{searchTerm}"</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredResults?.map(p => (
                  <ProductCard 
                    key={p.prod_id} 
                    title={p.prod_nombre} 
                    desc={p.prod_descripcion} 
                    price={p.prod_precio} 
                    img={`${import.meta.env.VITE_API_IMAGES}/${p.rel_imagen_url[0]?.img_url}`} 
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Vista Normal por Categorías (Usando tu JSON del Backend) */
            <div className="space-y-20">
              {categories.map((cat) => (
                <CategoryGroupCard 
                  key={cat.cat_id} 
                  title={cat.cat_nombre} 
                  data={cat.productos} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};