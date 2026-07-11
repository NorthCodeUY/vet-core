# api-backend/app/schemas/producto_schema.py
from pandas._libs.tslibs.offsets import Nano
from pydantic import BaseModel, Field, field_validator # Importamos BaseModel de pydantic
from typing import List, Optional # Importamos List y Optional de typing


class SubcategoriaSchema(BaseModel): # Clase que representa la tabla "subcategoria" en la base de datos
    subc_nombre: str # Nombre de la subcategoria
    class Config: # Clase que representa la tabla "subcategoria" en la base de datos
        from_attributes = True # Permite que el modelo sea convertido a JSON

class ImagenSchema(BaseModel): # Clase que representa la tabla "imagen" en la base de datos
    img_url: str # Nombre de la imagen
    img_principal: bool # Determina cual es la imagen principal
        # Esto es una "validación" que transforma el dato al salir
    @field_validator('img_url')
    @classmethod
    def assemble_image_url(cls, v: str) -> str:
        # Aquí defines la base de tu servidor
        BASE_URL = "/static/productos/" # <!> Supongo que esto en produccion cuando este en el contenedor docker tendria que cambiar 
        return f"{BASE_URL}{v}"

    class Config: # Clase que representa la tabla "imagen" en la base de datos
        from_attributes = True # Permite que el modelo sea convertido a JSON

class ProductoSchema(BaseModel): # Clase que representa la tabla "producto" en la base de datos
    """
    Schema que representa un producto completo en la tienda.
    Incluye sus datos básicos, categoría, subcategoría e imágenes asociadas.
    """
    prod_id: int # ID del producto
    prod_nombre: str # Nombre del producto
    prod_precio: float # Precio del producto
    prod_descripcion: Optional[str]= None # Descripción del producto
    # Aquí vinculamos las relaciones
    imagenes: List[ImagenSchema] = Field(default_factory=list, alias="rel_imagen_url") # Relación con la tabla "imagen"    
    subcategoria: List[SubcategoriaSchema] = Field(default_factory=list, alias="rel_subcategoria") # Relación con la tabla "subcategoria"
    
    class Config: # Clase que representa la tabla "producto" en la base de datos
        from_attributes = True # Permite que el modelo sea convertido a JSON
        populate_by_name = True # Permite que el modelo sea convertido a JSON por el nombre
        

class ProdCatAgrupadaSchema(BaseModel): 
    """
    Schema que representa una categoria con sus productos.
    """
    cat_nombre: str # Nombre de la categoria: str = Field(..., alias="rel_categoria") # Nombre de la categoria
    cat_id: int # ID de la categoria
    productos: List[ProductoSchema] # Reutilizamos el Schema anterior
    
    class Config: # Clase que representa la tabla "categoria" en la base de datos
        from_attributes = True # Permite que el modelo sea convertido a JSON
    # Ejemplo de salida
    # [
    # {
    # "cat_nombre": "Accesorios",
    # "cat_id": 1,
    # "productos": [ {prod_id: 1, ...}, {prod_id: 2, ...}, ... ]
    # },
    # {
    # "categoria": "Alimento",
    # "productos": [ {prod_id: 10, ...}, {prod_id: 11, ...}, ... ]
    # }
    # ] 

    