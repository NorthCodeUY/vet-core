# /api-backend/app/router/producto_router.py

from fastapi import APIRouter, Depends
from collections import defaultdict
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.product_repo import get_all_products, get_productos_agrupados, get_productos_filtrados #<!> Talves seria bueno agregar algo que me tragia todo lo de este paqeute para no tner que declarlo aunque no se si el la mejor practica 
from app.schemas.producto_schema import ProdCatAgrupadaSchema, ProductoSchema # Importamos el schema
from typing import List

router = APIRouter()

# Endpoint para la LANDING (agrupado)
@router.get("/productos/agrupados", response_model=List[ProdCatAgrupadaSchema])
def listar_agrupados(db: Session = Depends(get_db)):
    return get_productos_agrupados(db)

# Endpoint para BUSCADOR / FILTROS (lista plana)
@router.get("/productos", response_model=List[ProductoSchema])
def listar_productos(cat_id: int = None, search: str = None, db: Session = Depends(get_db)):
    return get_productos_filtrados(db, cat_id=cat_id, search=search)



# # <!> Si uso esto funciona el cartar todo los producots pero no funciona cuando pongo espandir y cargo lo de categoria 
# @router.get("/productos", response_model=list[ProdCatAgrupadaSchema])
# def listar_productos(cat_id: int = None, search: str = None, db: Session = Depends(get_db)):
#     # 1. Si quieres los productos agrupados para la landing:
#     if not cat_id and not search:
#         return get_productos_agrupados(db) 
    
#     # 2. Si quieres filtrar por categoría o búsqueda, usas otro método:
#     return get_productos_filtrados(db, cat_id=cat_id, search=search)


# <!> Si uso esto funciona el boton espandir que estoy aciendo pero no me carga las imagenes 
# @router.get("/productos") # Quitamos el response_model fijo para evitar el error 500
# def listar_productos(cat_id: int = None, search: str = None, db: Session = Depends(get_db)):
#     if not cat_id and not search:
#         return get_productos_agrupados(db) 
    
#     # Aquí devolvemos la lista plana de productos, FastAPI lo serializará automáticamente
#     return get_productos_filtrados(db, cat_id=cat_id, search=search)

