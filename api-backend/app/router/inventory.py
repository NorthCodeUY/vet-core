# /api-backend/app/router/inventory.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..repositories.product_repo import get_all_products

router = APIRouter()

@router.get("/productos")
def listar_productos(db: Session = Depends(get_db)):
    return get_all_products(db)