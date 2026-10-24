# api-backend/app/models/producto_model.py

# <!> 
# 
# Una cosa que tengo que tener en cueta es que debira tenr un
#  boton o lago con baja logica para que no aparesa por que no hay estok 
# o lo que sea pero que no se me borre para el registro no se que opinas 
# cuado empiese a sentralizar la parte de pedido
# y tora cosa alg para deterninar que no tien stok epro que se es necsario se mantenga en el carrito 
# por jemplo yo tneog una clieta que es una veteriara ella puede quedare sin una raion porque no se dio cuent o lo qaue ç
# sea pero ella pide al provedor le pretuna al clite y se lo da pero en la web aparesca sin stok y que ella deside si retirarlo aono 
# 
# y tengo otro clite que vede jollas con amatista eso n tiene stok se vende y se vendio no lo puedo dar de baja porque me sirve para el registiro etc pero 
# tene que salir de la bitrina digital algo asei  


"""
=============================================================================
MODELO DE PERSISTENCIA: NÚCLEO DEL CATÁLOGO DE PRODUCTOS
=============================================================================
Entidad central del catálogo. Agrupa información descriptiva, categorización,
galería multimedia y presentaciones físicas vendibles (variantes).
"""

from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.categoria_model import CategoriaModel
    from app.models.imagen_url_model import ImagenUrlModel
    from app.models.producto_subcategoria_model import ProductoSubCategoriaModel
    from app.models.producto_variante_model import ProductoVarianteModel
    from app.models.caja_item_model import CajaItemModel


class ProductoModel(Base):
    """
    Entidad maestra de producto.
    
    Regla de Inventario:
    - Si el producto no tiene variantes: 'prod_stock' y 'prod_precio' rigen la venta.
    - Si el producto tiene variantes: El stock y precio se calculan a partir de 
      sus registros relacionados en 'producto_variante'.
    """
    __tablename__ = "producto"

    # =========================================================================
    # Identificadores y Atributos Básicos
    # =========================================================================
    prod_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único del producto en catálogo."
    )
    
    prod_nombre: Mapped[str] = mapped_column(
        String(150), 
        nullable=False,
        doc="Nombre comercial del producto desplegado en frontend."
    )
    
    prod_descripcion: Mapped[Optional[str]] = mapped_column(
        Text, 
        nullable=True,
        doc="Descripción técnica, instrucciones o detalles del producto."
    )
    
    prod_precio: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Precio base en moneda local."
    )
    
    prod_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Stock global físico (utilizado como fallback cuando no hay variantes)."
    )

    # =========================================================================
    # Claves Foráneas
    # =========================================================================
    cat_id: Mapped[int] = mapped_column(
        ForeignKey("categoria.cat_id"), 
        nullable=False, 
        index=True,
        doc="Identificador de la categoría principal."
    )

    # =========================================================================
    # Relaciones ORM Tipadas (SQLAlchemy 2.0)
    # =========================================================================
    
    # 1. Categoría Principal
    rel_categoria: Mapped["CategoriaModel"] = relationship(
        "CategoriaModel",
        doc="Relación Many-to-One hacia la categoría del producto."
    )
    
    # 2. Galería de Imágenes (1 a N)
    rel_imagenes: Mapped[List["ImagenUrlModel"]] = relationship(
        "ImagenUrlModel", 
        back_populates="rel_producto",
        cascade="all, delete-orphan",
        lazy="selectin",
        doc="Lista de imágenes asociadas al producto."
    )

    # 3. Subcategorías (Relación M:N a través de tabla intermedia)
    rel_subcategoria: Mapped[List["ProductoSubCategoriaModel"]] = relationship(
        "ProductoSubCategoriaModel",
        cascade="all, delete-orphan",
        doc="Asociaciones con subcategorías secundarias del catálogo."
    )

    # 4. Variantes Físicas (Talles, Colores, Medidas)
    rel_variantes: Mapped[List["ProductoVarianteModel"]] = relationship(
        "ProductoVarianteModel",
        back_populates="rel_producto",
        cascade="all, delete-orphan",
        lazy="selectin",
        doc="Presentaciones físicas vendibles asociadas a este producto."
    )

    # 5. Inventario en Cajas de Depósito
    rel_caja_items: Mapped[List["CajaItemModel"]] = relationship(
        "CajaItemModel",
        back_populates="rel_producto",
        doc="Trazabilidad de existencias físicas distribuidas en cajas de depósito."
    )