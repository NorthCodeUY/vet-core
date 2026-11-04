# api-backend/app/models/producto_variante_model.py
"""
=============================================================================
MODELO DE PERSISTENCIA: VARIANTES FÍSICAS Y SKUs DE PRODUCTO (SQLALCHEMY 2.0)
=============================================================================
Representa la unidad atómica de inventario (SKU).
Contiene existencias, código de barras específico, costos comerciales
y reglas transaccionales independientes del producto padre.
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
    - var_codigo_barra: Código de barras único para este tamaño/volumen concreto.
    - var_precio_costo: Costo de compra de esta presentación específica.
    - var_stock_minimo: Nivel mínimo antes de generar aviso de compra.
    - var_visible: False oculta esta opción del selector sin desactivar el producto padre.
    """
    __tablename__ = "producto_variante"

    # =========================================================================
    # 1. Claves Primarias y Foráneas
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
        doc="ID del producto padre al que pertenece esta variante."
    )
    
    col_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("color.col_id"), 
        nullable=True, 
        index=True,
        doc="ID del color asociado (opcional, aplicable a indumentaria y correas)."
    )

    # =========================================================================
    # 2. Identificación, Dimensiones y Códigos Ópticos
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

    # <!> no se paro porque me pones esto pero si lo recomendas dejalo pemro 
    # a mi me gusta usar vet_ o lo qu se por delante a model 
    
    val_sku: Mapped[Optional[str]] = mapped_column(
        String(64), 
        unique=True, 
        nullable=True, 
        index=True,
        doc="Código interno alfanumérico para logística de almacén."
    )

    var_codigo_barra: Mapped[Optional[str]] = mapped_column(
        String(64),
        unique=True,
        nullable=True,
        index=True,
        doc="Código de barras EAN/UPC específico de esta presentación física para escáner óptico."
    )

    # =========================================================================
    # 3. Control Financiero y Precios <!>  aca me gustaria suar predio de vena 
    # no diferencia es dificil e calcularo y mas complejo de mantener pero de venta 
    # si o si y presio de costo opcional 
    # =========================================================================
    var_precio_venta: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Diferencial de precio que se suma al precio base del producto (+/-)."
    )

    var_precio_costo: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
        default=None,
        doc="Costo de adquisición del proveedor para esta variante puntual."
    )

    # =========================================================================
    # 4. Control de Inventario y Stock
    # =========================================================================
    var_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Existencias físicas en depósito exclusivamente para este SKU."
    )

    var_stock_minimo: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=None,
        doc="Umbral de alerta para compra de mercadería de esta variante específica."
    )

    # =========================================================================
    # 5. Reglas de Disponibilidad, Vitrina y Ciclo de Vida
    # =========================================================================
    var_activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Baja lógica: False descontinúa la variante de forma definitiva."
    )

    var_visible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        doc="Vitrina: False oculta el botón/chip en la web sin borrar el inventario."
    )

    var_disponible: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        doc="Disponibilidad comercial: False deshabilita temporalmente el chip (muestra tachado)."
    )

    var_permitir_sin_stock: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="Habilita pedidos por encargo para esta variante con stock físico en 0."
    )

    # =========================================================================
    # 6. Relaciones ORM
    # =========================================================================
    rel_producto: Mapped["ProductoModel"] = relationship(
        "ProductoModel", 
        back_populates="rel_variantes"
    )
    
    rel_color: Mapped[Optional["ColorModel"]] = relationship(
        "ColorModel", 
        back_populates="rel_variantes"
    )