# api-backend/app/schemas/caja_schema.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class CajaItemBaseSchema(BaseModel):
    prod_id: int
    var_id: Optional[int] = None
    cantidad: int = Field(gt=0, description="Cantidad dentro de la caja")

class CajaItemResponseSchema(CajaItemBaseSchema):
    item_id: int
    # Campos calculados para visualización rápida al escanear
    producto_nombre: Optional[str] = None
    variante_detalle: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class CajaCreateSchema(BaseModel):
    caja_codigo: str = Field(..., min_length=3, max_length=50)
    caja_nombre: str = Field(..., min_length=3, max_length=100)
    direccion: str = Field(..., min_length=5, max_length=255)
    deposito_referencia: Optional[str] = None
    contacto_nombre: Optional[str] = None
    contacto_telefono: Optional[str] = None
    items: List[CajaItemBaseSchema] = Field(default_factory=list)

class CajaResponseSchema(BaseModel):
    caja_id: int
    caja_codigo: str
    caja_nombre: str
    direccion: str
    deposito_referencia: Optional[str] = None
    contacto_nombre: Optional[str] = None
    contacto_telefono: Optional[str] = None
    estado: str
    created_at: datetime
    items: List[CajaItemResponseSchema] = Field(default_factory=list, alias="rel_items")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)