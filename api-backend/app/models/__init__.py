# api-backend/app/models/__init__.py
"""
==============================================================================
ÍNDICE MAESTRO DE MODELOS (ORQUESTADOR DE REGISTRO EN SQLALCHEMY)
==============================================================================
El orden garantiza que los modelos base se registren antes que las entidades
que dependen de ellos mediante Foreign Keys y Relationships.
"""

# --- 1. ENTIDADES MAESTRAS (Sin dependencias externas) ---
from .user_model import UserModel
from .categoria_model import CategoriaModel
from .subcategoria_model import SubcategoriaModel
from .color_model import ColorModel

# --- 2. PERSONAL Y CLIENTES ---
from .funcionario_model import FuncionarioModel
from .cliente_model import ClienteModel

# --- 3. CATÁLOGO Y VARIANTES (SKU) ---
from .producto_model import ProductoModel
from .producto_variante_model import ProductoVarianteModel
from .imagen_url_model import ImagenUrlModel
from .producto_subcategoria_model import ProductoSubCategoriaModel

# --- 4. DEPÓSITO Y LOGÍSTICA ---
from .caja_model import CajaModel
from .caja_item_model import CajaItemModel

# --- 5. VENTAS, TRANSACCIONES Y PAGOS ---
from .pedido_model import PedidoModel
from .pedido_detalle_model import PedidoDetalleModel
from .pago_model import PagoModel