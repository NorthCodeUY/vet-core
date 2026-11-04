# api-backend/app/models/producto_variante_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: VARIANTES FÍSICAS Y SKUs DE PRODUCTO
=============================================================================
Representa la unidad atómica de inventario (SKU).
Contiene existencias, código de barras específico y reglas transaccionales
independientes del producto padre.
"""

from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.producto_model import ProductoModel
    from app.models.color_model import ColorModel


class ProductoVarianteModel(Base):
    """
    Entidad 'producto_variante'.
    
    Reglas de Negocio:
    - var_activo: Baja lógica (False oculta la variante permanentemente sin alterar compras históricas).
    - var_disponible: Interruptor temporal (False desactiva la opción en el selector del frontend).
    - permitir_sin_stock: Permite encargar la variante aunque var_stock sea 0.
    """
    __tablename__ = "producto_variante"

    # =========================================================================
    # Claves Primarias y Foráneas
    # =========================================================================
    var_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único del SKU físico."
    )

    prod_id: Mapped[int] = mapped_column(
        ForeignKey("producto.prod_id", ondelete="CASCADE"), 
        nullable=False, 
        index=True,
        doc="ID del producto padre al que pertenece."
    )
    
    col_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("color.col_id"), 
        nullable=True, 
        index=True,
        doc="ID del color asociado (opcional)."
    )

    # =========================================================================
    # Identificación, Código Óptico y Dimensiones
    # =========================================================================
    var_tipo: Mapped[str] = mapped_column(
        String(50), 
        nullable=False, 
        default="Presentación",
        doc="Categorización del atributo ('Talle', 'Volumen', 'Peso', 'Medida')."
    )
    
    var_nombre: Mapped[str] = mapped_column(
        String(50), 
        nullable=False,
        doc="Etiqueta visible para el cliente ('S', 'XL', '250 ml', '15 Kg')."
    )

    var_codigo_barra: Mapped[Optional[str]] = mapped_column(
        String(64),
        unique=True,
        nullable=True,
        index=True,
        doc="Código de barras EAN/UPC de esta presentación física para escáner óptico."
    )

    # =========================================================================
    # Control Transaccional, Precios y Stock <!> Esto vamos a usar valores serrados si 
    # queres para otro clite vamos a uar presio de costo y presio de venta valeria solo va a usar presio de venta 
    # cpas dejamos 
    # que presio de costo sea nullo presio de venta tiene que eir si o si 
    # =========================================================================
    var_precio_adicional: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Diferencial de precio sobre el precio base del producto (+/-)."
    )
    # <!> Aca deberia aver una entidad stok minimo minimo Cpas podems usar la capasidad de null para saber los que no tien 
    var_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Existencias físicas en depósito exclusivamente para este SKU."
    )

    # =========================================================================
    # Reglas de Disponibilidad y Ciclo de Vida
    # =========================================================================
    var_activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Baja lógica: False si la variante se descontinúa definitivamente."
    )
    

    var_permitir_sin_stock: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="Habilita pedidos por encargo para esta variante específica con stock en 0."
    )

    var_disponible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        doc="Visibilidad comercial: False deshabilita el botón/chip en el frontend."
    )

    # <!> ACA ME FALTA LA PARTE DE VAR_VISIBLE PARA LA MISMA MODALIDAD DE PRODUCTO_MODEL

    # =========================================================================
    # Relaciones ORM
    # =========================================================================
    rel_producto: Mapped["ProductoModel"] = relationship(
        "ProductoModel", 
        back_populates="rel_variantes"
    )
    
    rel_color: Mapped[Optional["ColorModel"]] = relationship(
        "ColorModel", 
        back_populates="rel_variantes"
    )