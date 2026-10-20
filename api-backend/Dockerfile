# api-backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ejecuta dinámicamente tomando APP_PORT (o 8000 por defecto)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${APP_PORT:-8000}"]