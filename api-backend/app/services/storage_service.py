# api-backend/app/services/storage_service.py
"""
=============================================================================
SERVICIO DE ALMACENAMIENTO DE OBJETOS (CLOUDFLARE R2 / FALLBACK LOCAL)
=============================================================================
"""

from io import BytesIO
import mimetypes
from pathlib import Path
from uuid import uuid4

import boto3
from botocore.config import Config
from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_IMAGE_TYPES: dict[str, str] = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


class R2StorageService:
    def __init__(self) -> None:
        self.account_id = settings.R2_ACCOUNT_ID.strip()
        self.access_key = settings.R2_ACCESS_KEY_ID.strip()
        self.secret_key = settings.R2_SECRET_ACCESS_KEY.strip()
        self.bucket_name = settings.R2_BUCKET_NAME.strip() or "vetcore-media"
        self.public_url = settings.R2_PUBLIC_URL.strip().rstrip("/")
        self.endpoint_url = (
            getattr(settings, "R2_ENDPOINT_URL", "").strip()
            or f"https://{self.account_id}.r2.cloudflarestorage.com"
        )

        self.is_configured = bool(self.account_id and self.access_key and self.secret_key)

        if self.is_configured:
            self.s3_client = boto3.client(
                service_name="s3",
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                config=Config(signature_version="s3v4"),
            )

    def upload_local_file(self, tenant_id: str, local_path: str, filename: str) -> str:
        """Sube un archivo desde disco local hacia Cloudflare R2 (scripts CLI)."""
        if not self.is_configured:
            return f"/static/productos/{filename}"

        content_type, _ = mimetypes.guess_type(local_path)
        r2_key = f"tenants/{tenant_id}/productos/{filename}"

        try:
            with open(local_path, "rb") as f:
                self.s3_client.upload_fileobj(
                    f,
                    self.bucket_name,
                    r2_key,
                    ExtraArgs={"ContentType": content_type or "image/png"},
                )
            return f"{self.public_url}/{r2_key}" if self.public_url else f"/{r2_key}"
        except Exception as e:
            print(f"[!] Error subiendo {filename} a R2: {e}. Usando fallback local.")
            return f"/static/productos/{filename}"

    async def upload_uploadfile(self, tenant_id: str, file: UploadFile) -> tuple[str, str]:
        """Valida y sube un UploadFile HTTP hacia R2 (o fallback /static). Retorna (url, filename)."""
        content_type = (file.content_type or "").lower()
        if content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato inválido. Solo se permiten JPEG, PNG o WEBP.",
            )

        content = await file.read()
        if not content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo está vacío.",
            )
        if len(content) > MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="La imagen supera el límite máximo de 5 MB.",
            )

        ext = ALLOWED_IMAGE_TYPES[content_type]
        filename = f"{uuid4().hex}{ext}"

        if not self.is_configured:
            dest_dir = Path("app/static/productos")
            dest_dir.mkdir(parents=True, exist_ok=True)
            (dest_dir / filename).write_bytes(content)
            return f"/static/productos/{filename}", filename

        if not self.public_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="R2_PUBLIC_URL no está configurado en las variables de entorno.",
            )

        r2_key = f"tenants/{tenant_id}/productos/{filename}"
        try:
            self.s3_client.upload_fileobj(
                BytesIO(content),
                self.bucket_name,
                r2_key,
                ExtraArgs={"ContentType": content_type},
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Error subiendo imagen a Cloudflare R2: {exc}",
            ) from exc

        return f"{self.public_url}/{r2_key}", filename


storage_service = R2StorageService()