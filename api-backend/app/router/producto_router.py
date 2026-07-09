# /api-backend/app/router/producto_router.py

from fastapi import APIRouter, Depends
from collections import defaultdict
from sqlalchemy.orm import Session
from app.database import get_db
from app.repositories.product_repo import get_all_products, get_productos_agrupados, get_productos_filtrados #<!> Talves seria bueno agregar algo que me tragia todo lo de este paqeute para no tner que declarlo aunque no se si el la mejor practica 
from app.schemas.producto_schema import ProdCatAgrupadaSchema # Importamos el schema

router = APIRouter()


# En app/router/producto_router.py

@router.get("/productos", response_model=list[ProdCatAgrupadaSchema])
def listar_productos(cat_id: int = None, search: str = None, db: Session = Depends(get_db)):
    # 1. Si quieres los productos agrupados para la landing:
    if not cat_id and not search:
        return get_productos_agrupados(db) 
    
    # 2. Si quieres filtrar por categoría o búsqueda, usas otro método:
    return get_productos_filtrados(db, cat_id=cat_id, search=search)

