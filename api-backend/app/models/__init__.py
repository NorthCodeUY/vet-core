# /api-backend/app/models/__init__.py

# ==============================================================================
# INDICE DE MODELOS (ORQUESTADOR DE IMPORTACIONES)
# ==============================================================================
# El orden es CRÍTICO para que SQLAlchemy pueda resolver las relaciones.
# Primero importamos las tablas "Padre" (sin dependencias de otras tablas)
# y luego las tablas "Hijo" (que tienen Foreign Keys).

# --- 1. ENTIDADES BASE (Sin Foreign Keys) ---
from .user_model import UserModel             # Tabla 'usuarios' (Padre)
from .categoria_model import CategoriaModel   # Tabla 'categoria' (Padre)
from .subcategoria_model import SubcategoriaModel # Tabla 'subcategoria' (Padre)

# --- 2. ENTIDADES DEPENDIENTES (Tienen Foreign Keys hacia las de arriba) ---
from .funcionario_model import FuncionarioModel # Depende de UserModel
from .cliente_model import ClienteModel         # Depende de UserModel
from .producto_model import ProductoModel       # Depende de CategoriaModel
from .imagen_url_model import ImagenUrlModel    # Depende de ProductoModel
from .producto_subcategoria_model import ProductoSubCategoriaModel # Depende de Producto y Subcategoria

# --- 3. ENTIDADES DE GESTIÓN (Pedidos y Pagos) ---
from .pedido_model import PedidoModel           # Depende de Cliente
from .pedido_detalle_model import PedidoDetalleModel # Depende de Pedido y Producto
from .pago_model import PagoModel               # Depende de Pedido
