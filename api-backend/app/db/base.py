# api_backend/app/db/base.py
from .base_class import Base
from ..models.clietes_model import Cliente
from ..models.producto_model import Producto
from ..models.pedido_model import Pedido
from ..models.pago_model import Pago
from ..models.pedido_detalle_model import Pedido_detalle
from ..models.subcategoria_model import Subcategoria
from ..models.producto_subcategoria_model import Producto_subcategoria