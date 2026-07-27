
# app/security.py
from passlib.context import CryptContext # Manejo de contrasenias
from datetime import datetime, timedelta # Manejo de tiempo para el tocken
from jose import jwt # Manejo de tocken 


# CryptContext es la herramienta que maneja el hashing.
# "bcrypt" es el algoritmo estándar y seguro para contraseñas.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Tiempos de expiración
ACCESS_TOKEN_EXPIRE_ADMIN_HOURS = 24
ACCESS_TOKEN_EXPIRE_CLIENT_DAYS = 365 # 1 año para clientes

# Esta clave es como la llave maestra para firmar tus tokens JWT.
# <!> CÁMBIALA por una cadena aleatoria larga cuando subas a producción.
SECRET_KEY = "tu_clave_secreta_super_segura" # ¡Cámbiala en producción!
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    """
    Toma una contraseña en texto plano y la convierte en un hash irreversible.
    Ejemplo: '123456' -> '$2b$12$R9h/cIPz0gi...'
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara una contraseña escrita por el usuario con el hash guardado en la DB.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """
    Crea un token JWT (JSON Web Token) que sirve como 'pasaporte' para el usuario.
    El token incluye una fecha de expiración (24 horas por defecto). """
    

    to_encode = data.copy() # Copia de los datos
    expire = datetime.utcnow() + timedelta(hours=24) # Tiempo de expiración
    to_encode.update({"exp": expire}) # Actualización de los datos
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # Codificación del token

