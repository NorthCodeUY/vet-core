# api-backend/app/repositories/product_repo.py

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload
from collections import defaultdict
from app.models.producto_model import ProductoModel
from app.models.categoria_model import CategoriaModel


def get_all_products(db: Session):
    """
    Obtiene todos los productos de la base de datos.
    
    Args:
        db (Session): Sesión de la base de datos.
    
    Returns:
        list[ProductoModel]: Lista de productos.
    """
    # <!> Esto croe qeu tengo que sacarlo no cro usarlo lo
    #  voy a dejar por haora pero ne algun momento tengo que sacarlo como funicona no quiero por haora 
    return db.query(ProductoModel).options(
        joinedload(ProductoModel.rel_imagen_url),
        joinedload(ProductoModel.rel_subcategoria)
    ).all()


def get_productos_agrupados(db: Session, limit_por_categoria: int = 5):
    # 1. Primero, traemos todas las categorías existentes
    categorias = db.query(CategoriaModel).all()
    
    resultado = []
    
    # 2. Por cada categoría, hacemos una consulta específica limitada
    for cat in categorias:
        productos = db.query(ProductoModel).options(
            joinedload(ProductoModel.rel_imagen_url),
            joinedload(ProductoModel.rel_subcategoria)
        ).filter(ProductoModel.cat_id == cat.cat_id)\
         .limit(limit_por_categoria).all()
        
        # Solo agregamos si la categoría tiene productos
        if productos:
            resultado.append({
                "cat_nombre": cat.cat_nombre,
                "cat_id": cat.cat_id,
                "productos": productos
            })
            
    return resultado
 

def get_productos_filtrados(db: Session, search: str = None, cat_id: int = None):
    # Añadimos .join(CategoriaModel) para poder filtrar por el nombre de la categoría
    query = db.query(ProductoModel).join(CategoriaModel).options(
        joinedload(ProductoModel.rel_imagen_url),
        joinedload(ProductoModel.rel_subcategoria)
    )
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                ProductoModel.prod_nombre.ilike(search_filter),
                ProductoModel.prod_descripcion.ilike(search_filter),
                CategoriaModel.cat_nombre.ilike(search_filter) # Ahora funcionará por el join
            )
        )
    # ... resto del código igual













def get_productos_filtrados(db: Session, search: str = None, cat_id: int = None):
    query = db.query(ProductoModel).options(
        joinedload(ProductoModel.rel_imagen_url),
        joinedload(ProductoModel.rel_subcategoria),
        joinedload(ProductoModel.rel_categoria)
    )
    
    # Si hay búsqueda, buscamos en nombre O descripción
    if search:
        search_filter = f"%{search}%" # El símbolo % significa "cualquier cosa"
        query = query.filter(
            or_( # <!> Creo que aca me falta Cat_Nom pero no se como programarlo aun esta en mi Producto_shemas pero no se si es coorecto buscarlo hay 
                ProductoModel.prod_nombre.ilike(search_filter),
                ProductoModel.prod_descripcion.ilike(search_filter),
                CategoriaModel.cat_nombre.ilike(search_filter)
            )
        )
        
    # Si hay categoría, filtramos por categoría
    if cat_id:
        query = query.filter(ProductoModel.cat_id == cat_id)
        
    return query.all()