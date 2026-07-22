# /api-backend/app/main.py

from app.router import auth_router

from fastapi import FastAPI # Importamos FastAPI de la libreria fastapi
from .database import engine, Base # Importamos la base de datos y el motor de la base de datos
from app.models import ClienteModel, ProductoModel, PedidoModel, PagoModel, PedidoDetalleModel, SubcategoriaModel, ProductoSubCategoriaModel, ImagenUrlModel  # Esto dispara el __init__.py de la carpeta models
from app.router import producto_router, auth_router # Importamos el router de productos

from fastapi.middleware.cors import CORSMiddleware # <!> Revisar esto 
from fastapi.staticfiles import StaticFiles # Importamos para el manejo de archivos estaticos 


# Esto crea las tablas en Postgres al iniciar si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI() # Creamos la aplicacion

# Incluye los routers una sola vez. 
# Si el router ya tiene prefix="/auth", la ruta final será /api/auth
app.include_router(producto_router.router, prefix="/api")
app.include_router(auth_router.router, prefix="/api") 

# Esto le dice a FastAPI: "Si alguien pide /static, busca en la carpeta app/static"
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# --- CONFIGURACIÓN DE CORS ---
# Esto le dice a FastAPI que acepte peticiones desde tu puerto de React
app.add_middleware( # <!> Ver el Tema de seguridad en mi bakend cuando lo suba a produccion 
    CORSMiddleware,
    allow_origins=["*"], # URL de tu frontend
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, etc.
    allow_headers=["*"], # Permite todos los headers
)


# Get raiz 
# Para verificaar que la api funciona 
@app.get("/")
def read_root():
    return {"message": "Veterinaria Beltrameli API funcionando"}

