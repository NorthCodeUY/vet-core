http://127.0.0.1:8000/api/productos/agrupados
"cat_nombre": "Accesorios",
        "cat_id": 1,
        "productos": [
            {
                "prod_id": 1,
                "prod_nombre": "Durapets Bandeja",
                "prod_precio": 308.0,
                "prod_descripcion": "Kit Bandeja, pala y plato",
                "cat_id": 1,
                "rel_imagen_url": [
                    {
                        "img_url": "/static/productos/3.png",
                        "img_principal": true
                    }
                ],
                "rel_subcategoria": [
                    {
                        "subc_nombre": "Gato"
                    }
                ]
            },
            {
                "prod_id": 2,
                "prod_nombre": "Baño cerrado ",
                "prod_precio": 690.0,
                "prod_descripcion": "Baño cerrado (56x40x40cm) +pala",
                "cat_id": 1,
                "rel_imagen_url": [
                    {
                        "img_url": "/static/productos/2.png",
                        "img_principal": true
                    }
                ],

http://127.0.0.1:8000/api/productos?cat_id=1
[
    {
        "prod_id": 1,
        "prod_nombre": "Durapets Bandeja",
        "prod_precio": 308.0,
        "prod_descripcion": "Kit Bandeja, pala y plato",
        "cat_id": 1,
        "rel_imagen_url": [
            {
                "img_url": "/static/productos/3.png",
                "img_principal": true
            }
        ],
        "rel_subcategoria": [
            {
                "subc_nombre": "Gato"
            }
        ]
    },
    {
        "prod_id": 2,
        "prod_nombre": "Baño cerrado ",
        "prod_precio": 690.0,
        "prod_descripcion": "Baño cerrado (56x40x40cm) +pala",
        "cat_id": 1,
        "rel_imagen_url": [
            {
                "img_url": "/static/productos/2.png",
                "img_principal": true
            }
        ],
        "rel_subcategoria": [
            {
                "subc_nombre": "Gato"
            }
        ]
    },
    {
        "prod_id": 3,
        "prod_nombre": "Antideslizante",
        "prod_precio": 81.0,
        "prod_descripcion": "Medias antideslizantes ",
        "cat_id": 1,
        "rel_imagen_url": [
            {
                "img_url": "/static/productos/3.png",
                "img_principal": true
            }
        ],
        "rel_subcategoria": [
            {
                "subc_nombre": "Perro"
            }
        ]
    },


/* --- apps/web-client/src/components/CategoryGroupCard.tsx --- */

import { mapApiToProduct } from '../pages/landing/sessions/ProductsSession'; // <!> Importar el mapeador

export const CategoryGroupCard = ({ title, catId, initialData }: CategoryGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [products, setProducts] = useState(initialData);
  const [hasLoadedFull, setHasLoadedFull] = useState(false);

  /* 
     <!> MEJORA RESPONSIVE: 
     Si no está expandido, mostramos 2 en móvil y 5 en desktop.
  */
  const displayLimit = isExpanded ? products.length : 2; 

  const handleToggleExpand = async () => {
    if (!isExpanded && !hasLoadedFull) {
      try {
        const response = await fetch(`/api/productos?cat_id=${catId}`);
        const rawData = await response.json();

        /* 
           <!> SOLUCIÓN AL ERROR DE IMAGEN:
           Transformamos los datos crudos del backend al formato ApiProduct 
           antes de guardarlos en el estado.
        */
        const transformedProducts = mapApiToProduct(title, catId, rawData);
        
        setProducts(transformedProducts);
        setHasLoadedFull(true);
      } catch (error) {
        console.error("Error cargando más productos:", error);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {/* ... (Header de categoría igual) ... */}

      <div className={`
        /* --- Posición --- */
        grid
        grid-cols-1                  /* 1 col en móvil muy pequeño */
        xs:grid-cols-2               /* 2 cols en móvil (Tu pedido de 2 1) */
        lg:grid-cols-3
        xl:grid-cols-5
        gap-6
        justify-items-center
      `}`}>
        {products.map((p, index) => {
          /* 
             Lógica de visibilidad: 
             En móvil usamos displayLimit (2). 
             En desktop (xl) mostramos 5 si no está expandido.
          */
          const isHiddenOnMobile = index >= displayLimit;
          const isHiddenOnDesktop = !isExpanded && index >= 5;

          return (
            <div
              key={p.prod_id}
              className={`
                ${isHiddenOnMobile ? 'hidden' : 'flex'} 
                ${isHiddenOnDesktop ? 'xl:hidden' : 'xl:flex'}
                animate-in fade-in duration-300
              `}
            >
              <ProductCard producto={p} />
            </div>
          );
        })}
      </div>
    </div>
  );
};