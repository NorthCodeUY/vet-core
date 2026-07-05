# /api-backend/app/repositories/product_repo.py

from sqlalchemy.orm import Session
from ..models.producto_model import ProductoModel
from ..models.subcategoria_model import SubcategoriaModel
from ..models.categoria_model import CategoriaModel

def crear_producto(db: Session, nombre, precio, stock, categoria):
    # Aquí iría la lógica para buscar/crear la categoría y luego el producto
    nuevo_prod = ProductoModel(
        prod_nombre=nombre,
        prod_precio=precio,
        prod_stock=stock,
        prod_categoria=categoria
    )
    db.add(nuevo_prod)
    db.commit()
    db.refresh(nuevo_prod)
    return nuevo_prod