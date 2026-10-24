# api-backend/app/models/producto_variante_model.py
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING: # La logica es que si no estaria importando las clases directamente no me daria error al ejecutar el codigo

    from app.models.producto_model import ProductoModel # Importación de la clase ProductoModel
    from app.models.color_model import ColorModel # Importación de la clase ColorModel

class ProductoVarianteModel(Base):
    """
    Entidad que representa el SKU físico (Stock Keeping Unit) o presentación vendible.
    
    Patrón de Diseño: Producto Padre (Abstracto) vs Variante Hija (Física).
    
    - ProductoModel: Representa el concepto del catálogo (ej. "Pretal Antitirones", 
      "Remera Oversize"). Contiene descripción general, fotos y categoría.
    - ProductoVarianteModel: Representa el ítem concreto en estantería que posee stock, 
      dimensiones (talle/volumen) y precio específico (ej. "Talle M - Rojo", "1 Litro").
    """
    __tablename__ = "producto_variante"

    # =========================================================================
    # Claves Primarias y Foráneas
    # =========================================================================
    var_id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True,
        doc="Identificador único de la variante física (SKU)."
    )

    prod_id: Mapped[int] = mapped_column(
        ForeignKey("producto.prod_id", ondelete="CASCADE"), 
        nullable=False, 
        index=True,
        doc="ID del producto padre al que pertenece esta variante. Si se elimina el padre, se eliminan sus variantes."
    )
    
    col_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("color.col_id"), 
        nullable=True, 
        index=True,
        doc="ID del color asociado (opcional, aplicable a indumentaria y accesorios)."
    )

    # =========================================================================
    # Atributos de Identificación y Dimensión <!> Esto no lo tengo tan claro es como una lista de elementos qye yo precarlgo o que 
    # =========================================================================
    var_tipo: Mapped[str] = mapped_column(
        String(50), 
        nullable=False, 
        default="Presentación",
        doc="Clasificador del tipo de variante: 'Talle', 'Volumen', 'Peso', 'Medida'."
    )
    
    var_nombre: Mapped[str] = mapped_column(
        String(50), 
        nullable=False,
        doc="Valor visible para el cliente final en el catálogo: 'S', 'XL', '250 ml', '5 Kg'."
    )
    
    sku: Mapped[Optional[str]] = mapped_column(
        String(64), 
        unique=True, 
        nullable=True, 
        index=True,
        doc="Código de barras o identificador único para lectores ópticos e inventario."
    )

    # =========================================================================
    # Control Transaccional y Financiero <!> Esto no me quedeo claro esplicamelo un poco mas <!> y entiendeme
    # yo actualmente tego una tarjeta con presio osea qeu si el producto tiene talles la compra se ase a ese producto y a  ese tella lo que alteraria mi relacion acutal a la entidad linea de compra 
    # y en la tarjeta de productos voy a tener que cambiarla que tenga diferentes formas de comparar o algo 

    # =========================================================================
    var_precio_adicional: Mapped[float] = mapped_column(
        Float, 
        nullable=False, 
        default=0.0,
        doc="Diferencial de precio sobre el precio base del producto. 0.0 si mantiene el precio base."
    )
    # <!>Esto si me Esto si me lo vas a tener que esplicar  
    var_stock: Mapped[int] = mapped_column(
        Integer, 
        nullable=False, 
        default=0,
        doc="Existencias físicas disponibles exclusivamente para esta combinación de talle/color."
    )

    # =========================================================================
    # Relaciones ORM
    # =========================================================================
    rel_producto: Mapped["ProductoModel"] = relationship(
        "ProductoModel", 
        back_populates="rel_variantes",
        doc="Relación Many-to-One con el producto padre."
    )
    
    rel_color: Mapped[Optional["ColorModel"]] = relationship(
        "ColorModel", 
        back_populates="rel_variantes",
        doc="Relación Many-to-One con la entidad de color normalizada."
    )