# api-backend/app/services/storage_service.py
"""
=============================================================================
SERVICIO DE ALMACENAMIENTO DE OBJETOS (CLOUDFLARE R2 / S3 API)
=============================================================================
"""

import os
import mimetypes
import boto3
from botocore.config import Config
from fastapi import UploadFile, HTTPException


class R2StorageService:
    def __init__(self):
        self.account_id = os.getenv("R2_ACCOUNT_ID")
        self.access_key = os.getenv("R2_ACCESS_KEY_ID")
        self.secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
        self.bucket_name = os.getenv("R2_BUCKET_NAME", "vetcore-media")
        self.public_url = os.getenv("R2_PUBLIC_URL", "").rstrip("/")
        
        self.is_configured = bool(self.account_id and self.access_key and self.secret_key)

        if self.is_configured:
            self.s3_client = boto3.client(
                service_name="s3",
                endpoint_url=f"https://{self.account_id}.r2.cloudflarestorage.com",
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                config=Config(signature_version="s3v4")
            )

    def upload_local_file(self, tenant_id: str, local_path: str, filename: str) -> str:
        """
        Sube un archivo del disco local hacia Cloudflare R2.
        Retorna la URL pública de R2 si está configurado, o la ruta local estática como fallback.
        """
        if not self.is_configured:
            # Fallback seguro para desarrollo local sin conexión a R2
            return f"/static/productos/{filename}"

        content_type, _ = mimetypes.guess_type(local_path)
        r2_key = f"tenants/{tenant_id}/productos/{filename}"

        try:
            with open(local_path, "rb") as f:
                self.s3_client.upload_fileobj(
                    f,
                    self.bucket_name,
                    r2_key,
                    ExtraArgs={"ContentType": content_type or "image/png"}
                )
            return f"{self.public_url}/{r2_key}"
        except Exception as e:
            print(f"[!] Error subiendo {filename} a R2: {e}. Usando fallback local.")
            return f"/static/productos/{filename}"