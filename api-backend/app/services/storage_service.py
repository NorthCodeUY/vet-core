# api-backend/app/services/storage_service.py
import os
import uuid
import boto3
from botocore.config import Config
from fastapi import UploadFile, HTTPException

class R2StorageService:
    def __init__(self):
        self.account_id = os.getenv("R2_ACCOUNT_ID") # ID de mi cuenta en R2
        self.access_key = os.getenv("R2_ACCESS_KEY_ID") # ID de la clave de acceso
        self.secret_key = os.getenv("R2_SECRET_ACCESS_KEY") # Secreto de la clave de acceso
        self.bucket_name = os.getenv("R2_BUCKET_NAME", "vetcore-media") # Nombre del bucket <!> que es ducket
        self.public_url = os.getenv("R2_PUBLIC_URL") # URL pública del bucket
        
        # S3 Client compatible con Cloudflare R2
        self.s3_client = boto3.client(
            service_name="s3", # Tipo de servicio
            endpoint_url=f"https://{self.account_id}.r2.cloudflarestorage.com", # URL del servicio
            aws_access_key_id=self.access_key, # ID de la clave de acceso
            aws_secret_access_key=self.secret_key, # Secreto de la clave de acceso
            config=Config(signature_version="s3v4") # Versión de la firma
        )

    def upload_product_image(self, tenant_id: str, file: UploadFile) -> str:
        """
        Sube una imagen al bucket organizándola por prefijo de tenant.
        Retorna la URL pública final lista para guardar en la BD.
        @params: 
            self: Instancia de la clase
            tenant_id: ID del cliente
            file: Archivo a subir
        @returns: URL pública del archivo
        @raises: HTTPException si hay un error
        """
        extension = file.filename.split(".")[-1].lower() if file.filename else "webp"
        unique_filename = f"{uuid.uuid4().hex}.{extension}"
        
        # Ruta aislada por cliente dentro del bucket
        r2_key = f"tenants/{tenant_id}/productos/{unique_filename}"

        try:
            self.s3_client.upload_fileobj( # Sube el archivo a R2
                file.file, # Archivo a subir
                self.bucket_name, # Nombre del bucket
                r2_key, # Ruta aislada por cliente dentro del bucket
                ExtraArgs={"ContentType": file.content_type or "image/webp"} # Tipo de contenido
            )
            # Retorna URL pública: https://pub-xxx.r2.dev/tenants/flordeloto/productos/uuid.webp
            return f"{self.public_url}/{r2_key}"
        except Exception as e:
            # <!> Esto como funciona va a el log de docker y hay puedo sentraliarlo estoy  y
            #  que puedo usar para que me llegen a un telegram los erroes o ter algo que
            #  los clasifique a me interesa  y no para poder llevar un control de mis clietes 
            
            raise HTTPException(status_code=500, detail=f"Error subiendo imagen a R2: {str(e)}")