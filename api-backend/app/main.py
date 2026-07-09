# /api-backend/app/main.py

from fastapi import FastAPI # Importamos FastAPI de la libreria fastapi
from .database import engine, Base # Importamos la base de datos y el motor de la base de datos
from app.models import ClienteModel, ProductoModel, PedidoModel, PagoModel, PedidoDetalleModel, SubcategoriaModel, ProductoSubCategoriaModel, ImagenUrlModel  # Esto dispara el __init__.py de la carpeta models
from app.router import producto_router # Importamos el router de productos
# Esto crea las tablas en Postgres al iniciar si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI() # Creamos la aplicacion

app.include_router(producto_router.router, prefix="/api")

# Get raiz 
# Para verificaar que la api funciona 
@app.get("/")
def read_root():
    return {"message": "Veterinaria Beltrameli API funcionando"}

