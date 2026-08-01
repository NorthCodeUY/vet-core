# api-backend/app/schemas/producto_schema.py
# from pandas._libs.tslibs.offsets import Nano # <!> Borrar 
from pydantic import BaseModel, Field, field_validator, ConfigDict # Importamos BaseModel de pydantic
from typing import List, Optional # Importamos List y Optional de typing

from app.config import settings 

class SubcategoriaSchema(BaseModel): 
    """ 
    Clase que representa la tabla "subcategoria" en la base de datos 
    
    """
    subc_nombre: str # Nombre de la subcategoria
    model_config = ConfigDict( # representa la tabla "subcategoria" en la base de datos
        from_attributes=True # Permite que el modelo sea convertido a JSON
        )

  
class ImagenSchema(BaseModel): 
    """ 
    Clase que representa la tabla "imagen_url" en la 
    base de datos
    @:param img_url: Nombre de la imagen
    @:param img_id: ID de la imagen
    @:param img_principal: Determina cual es la imagen principal
    """
    img_url: str # Nombre de la imagen
    img_id: int # ID de la imagen
    img_principal: bool # Determina cual es la imagen principal



    # Esto es una "validación" que transforma el dato al salir
   
    # Crea RUtas Absolutas Lo dejo por si me sirve !!! NO BORRAR ESTOOOOO !!! 
    # @field_validator(
    #     'img_url', # Indica que se ejecutara cuando se acceda al campo img_url
    #     mode="after" # Indica que se ejecutara despues de que se obtenga el valor del campo img_url
    #     )
    # @classmethod
    # def assemble_image_url(cls, v: str) -> str: 
    #     """
    #     Lógica de construcción de URL:
    #     1. Si es nulo o vacío, devuelve cadena vacía (el frontend decidirá qué mostrar).
    #     2. Si ya es una URL completa (empieza con http), la respeta.
    #     3. Si es solo el nombre, construye: BASE_URL + /static/productos/ + nombre.
    #     """
    #     if not v: # Si la url es nula o vacia 
    #         return "" # Retorna una cadena vacia 

    #   
    #     if v.startswith("http"): # Si la url es absoluta 
    #         return v # Retorna la url 
        
    #     # Limpiamos la base del .env (ej: http://192.168.1.11:8001)
    #     base = settings.base_url.rstrip("/") # path = v.lstrip("/")
    #     #  Limpiamos el nombre del archivo de la DB (ej: 3.png)
    #     filename = v.lstrip("/")

    #     # Construimos la ruta completa hacia la subcarpeta de productos
    #     return f"{base}/static/productos/{filename}"

    #     # # Si el path guardado en la DB no incluye 'static', se lo ponemos
    #     # if not filename.startswith("static"): 
    #     #     return f"{base}/{filename}"
    #     # else: 
    #     #     return v



    model_config = ConfigDict( # Representa la tabla "imagen_url" en la base de datos
        from_attributes=True # Permite que el modelo sea convertido a JSON
        )




class ProductoSchema(BaseModel): 
    """
    Schema que representa un producto completo en la tienda.
    Incluye sus datos básicos, categoría, subcategoría e imágenes asociadas.
    """
    prod_id: int # ID del producto
    prod_nombre: str # Nombre del producto
    prod_precio: float # Precio del producto
    prod_descripcion: Optional[str]= None # Descripción del producto
    cat_id: int # ID de la categoria
 
    # Aquí vinculamos las relaciones
    imagenes: List[ImagenSchema] = Field(default_factory=list, alias="rel_imagen_url") # Relación con la tabla "imagen"    
    subcategoria: List[SubcategoriaSchema] = Field(default_factory=list, alias="rel_subcategoria") # Relación con la tabla "subcategoria"
    
    model_config = ConfigDict( # Representa la tabla "producto" en la base de datos
        from_attributes=True, # Permite que el modelo sea convertido a JSON
        populate_by_name=True # Permite que el modelo sea convertido a JSON por el nombre
    )

class ProdCatAgrupadaSchema(BaseModel): 
    """
    Schema que representa una categoria con sus productos.
    """
    cat_nombre: str # Nombre de la categoria: str = Field(..., alias="rel_categoria") # Nombre de la categoria
    cat_id: int # ID de la categoria
    productos: List[ProductoSchema] # Reutilizamos el Schema anterior
    
    model_config = ConfigDict( # Representa la tabla "categoria" en la base de datos
        from_attributes=True # Permite que el modelo sea convertido a JSON
        )

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

    
