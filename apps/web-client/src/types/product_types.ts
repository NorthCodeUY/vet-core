// apps/web-client/src/types/product_types.ts

export interface ApiImage {
  img_url: string;
  img_principal: boolean;
}

export interface ApiProduct {
  prod_id: number;
  prod_nombre: string;
  prod_precio: number;
  prod_descripcion: string;
  rel_imagen_url: ApiImage[];
  rel_subcategoria: { subc_nombre: string }[];
}

export interface ApiCategory {
  cat_id: number;
  cat_nombre: string;
  productos: ApiProduct[];
}