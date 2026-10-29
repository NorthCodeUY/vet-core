# api-backend/app/schemas/__init__.py
"""Exportación unificada del paquete de esquemas Pydantic."""

from app.schemas.categoria_schema import (
    CategoriaResponseSchema, 
    CategoriaCreateSchema
)
from app.schemas.subcategoria_schema import (
    SubcategoriaResponseSchema, 
    SubcategoriaCreateSchema, 
    SubcategoriaUpdateSchema
)
from app.schemas.producto_schema import (
    ProductoResponseSchema,
    ProductoSchema,
    VarianteResponseSchema,
    ColorResponseSchema,
    ProdCatAgrupadaSchema
)
from app.schemas.caja_schema import (
    CajaResponseSchema, 
    CajaCreateSchema
)
from app.schemas.user_schema import *