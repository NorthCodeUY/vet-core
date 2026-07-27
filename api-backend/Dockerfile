# api-backend/Dockerfile

# Usa una imagen base pequeña
FROM python:3.12-slim

# Evita que Python escriba archivos .pyc (ensucian el contenedor)
ENV PYTHONDONTWRITEBYTECODE=1
# Permite que los logs salgan directo a la terminal
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Primero copiamos los requerimientos para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto de FastAPI
EXPOSE 8000

# Lanzamos uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]