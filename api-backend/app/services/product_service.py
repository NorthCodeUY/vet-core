import pandas as pd
from sqlalchemy.orm import Session
from app.models.producto_model import ProductoModel
from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
from app.models.subcategoria_model import SubcategoriaModel
from app.models.categoria_model import CategoriaModel

def get_or_create_categoria(db: Session, nombre: str):
    """
    Busca una categoria por nombre o la crea si no existe.
    
    Args:
        db (Session): La sesión activa de la base de datos.
        nombre (str): El nombre de la categoría a buscar/crear.
        
    Returns:
        CategoriaModel: La instancia de la categoría encontrada o creada.
    """
    nombre_normalizado = nombre.strip().capitalize() # Normalizamos el nombre
    # Buscamos la categoria
    cat = db.query(CategoriaModel).filter_by(cat_nombre=nombre_normalizado).first() 
    
    if not cat: # Si no existe la categoria
        cat = CategoriaModel(cat_nombre=nombre_normalizado) # Creamos la categoria
        db.add(cat) # Agregamos la categoria
        db.commit() # Guardamos la categoria
        db.refresh(cat) # Actualizamos la categoria
        
    return cat

def get_or_create_subcategoria(db: Session, nombre: str):
    """
    Busca una subcategoría por nombre o la crea si no existe.
    
    Args:
        db (Session): La sesión activa de la base de datos.
        nombre (str): El nombre de la subcategoría a buscar/crear.
        
    Returns:
        SubcategoriaModel: La instancia de la subcategoría encontrada o creada.
    """
    nombre_normalizado = nombre.strip().capitalize() # Normalizamos el nombre
    # Buscamos la subcategoria
    subcat = db.query(SubcategoriaModel).filter_by(subc_nombre=nombre_normalizado).first() 
    
    if not subcat: # Si no existe la subcategoria
        subcat = SubcategoriaModel(subc_nombre=nombre_normalizado) # Creamos la subcategoria
        db.add(subcat) # Agregamos la subcategoria
        db.commit() # Guardamos la subcategoria
        db.refresh(subcat) # Actualizamos la subcategoria
        
    return subcat


def importar_desde_csv(db: Session, archivo_csv: str):
    """
    Importa productos desde un archivo CSV a la base de datos.
    
    Args:
        db (Session): La sesión activa de la base de datos.
        archivo_csv (str): La ruta del archivo CSV que contiene los datos de los productos.
    """
    df = pd.read_csv(archivo_csv)

    # Recorremos el archivo CSV
    for _, row in df.iterrows():
        
        # Crear la categoria
        cat = get_or_create_categoria(db, row['Categoria'])
        
        # Crear el producto
        nuevo_prod = ProductoModel(
            prod_nombre=row['Nomre Producto'],
            prod_descripcion=str(row['Descripcion']),
            prod_precio=float(row['precio']) if pd.notna(row['precio']) else 0.0,
            prod_stock=0, # Default
            cat_id=cat.cat_id
        )
        db.add(nuevo_prod)
        db.commit()
        db.refresh(nuevo_prod)
        
        # 2. Manejar múltiples subcategorías separadas por "/"
        subcategorias_texto = str(row['Subcategoria']).split('/')
        
        for sub_nombre in subcategorias_texto:
            subcat = get_or_create_subcategoria(db, sub_nombre.strip())
            
            # 3. Crear relación en la tabla asociativa
            relacion = ProductoSubCategoriaModel(
                prod_id=nuevo_prod.prod_id,
                subc_id=subcat.subc_id
            )
            db.add(relacion)
            
        db.commit()