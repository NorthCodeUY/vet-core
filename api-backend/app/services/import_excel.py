# api-backend/app/services/import_excel.py

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel
from app.models.subcategoria_model import SubcategoriaModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.imagen_url_model import ImagenUrlModel

def importar():
    db = SessionLocal()
    df = pd.read_csv('app/static/productos.csv') # Ajusta la ruta a tu archivo
    
    for _, row in df.iterrows():
        # 1. Resolver Categoría (Busca o Crea)
        cat = db.query(CategoriaModel).filter_by(cat_nombre=row['Categoria']).first()
        if not cat:
            cat = CategoriaModel(cat_nombre=row['Categoria'])
            db.add(cat); db.commit(); db.refresh(cat)
            
        # 2. Crear Producto
        nuevo_prod = ProductoModel(
            prod_nombre=row['Nomre Producto'],
            prod_precio=float(row['precio']) if pd.notna(row['precio']) else 0.0,
            prod_descripcion=str(row['Descripcion']),
            cat_id=cat.cat_id
        )
        db.add(nuevo_prod); db.commit(); db.refresh(nuevo_prod)
        
        # 3. Resolver Subcategorías (Divide por "/")
        subcats = str(row['Subcategoria']).split('/')
        for sub_n in subcats:
            sub = db.query(SubcategoriaModel).filter_by(subc_nombre=sub_n.strip()).first()
            if not sub:
                sub = SubcategoriaModel(
                    subc_nombre=sub_n.strip()
                )
                db.add(sub); db.commit(); db.refresh(sub)
            
            # Vincular producto y subcategoría
            rel = ProductoSubCategoriaModel(prod_id=nuevo_prod.prod_id, subc_id=sub.subc_id)
            db.add(rel)
        
        # 4. Imagenes
        if pd.notna(row['imagen_url']):
            img = ImagenUrlModel(
                prod_id=nuevo_prod.prod_id, 
                img_url=f"{row['imagen_url']}.png", 
                img_principal=True)
            db.add(img)
            
        db.commit()
    print("¡Carga completada con éxito!")

if __name__ == "__main__":
    importar()