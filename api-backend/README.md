// app/main.py -> Ejecutar con uvicorn app.main:app --reload
## <!> Estructur de baken sugerido de proeycto comparando miproyecot contaduria barion 4 mayo

``` text
api-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Punto de entrada (FastAPI)
│   ├── config.py               # Variables de entorno y constantes
│   ├── database.py             # Configuración de SQLAlchemy / Engine
│   ├── security.py             # Lógica de JWT y hashing
│   ├── docker-compose.yml      # Levanta los contenedores de Base de datos y api backend
│   ├── Dockerfile              # Crea lia imagen de el poryecto para api backend
│   ├── README.md               # README del proyecto
│   ├── run_desarollo.py        # Scrip para ejecutar la api en modo desarrollo con uvicorn
│   ├── requirements.txt        # Dependencias del proyecto
│   ├── models/                 # Modelos de base de datos (SQLAlchemy)
│   │   ├── categoria_model.py
│   │   ├── cliente_model.py
│   │   ├── funcionario_model.py
│   │   ├── imagen_url_model.py
│   │   ├── __init__.py
│   │   ├── pago_model.py
│   │   ├── pedido_detalle_model.py
│   │   ├── pedido_model.py
│   │   ├── producto_model.py
│   │   ├── producto_subcategoria_model.py
│   │   ├── subcategoria_model.py
│   │   └── user_model.py
│   ├── repositories             # Repositorio para el acceso a datos
│   │   ├── __init__.py
│   │   └── product_repo.py
│   ├── router                   # Endpoints de la API
│   │   ├── auth_router.py
│   │   ├── __init__.py
│   │   ├── pedido_route.py
│   │   └── producto_router.py
│   ├── schemas/                # Validación de datos (Pydantic)
│   │   ├── __init__.py
│   │   ├── producto_schema.py
│   │   └── user_schema.py
│   ├── services
│   │   ├── import_excel.py
│   │   ├── product_service.py
│   │   ├── qr_generator.py
│   │   ├── token_service.py
│   │   └── whatsapp_service.py
│   └── static/
│       ├── productos/     # Imagenes guardadas de los productos
│       └── productos.csv    # Archivo excel para importación de productos 

```





# Configuración y Arranque
- main.py : Punto de entrada que configura FastAPI, CORS, routers y el scheduler de notificaciones
- config.py : Variables de configuración como claves secretas, configuración de email, etc.
- database.py : Configuración de SQLAlchemy y conexión a la base de datos
- dependencies.py : Funciones para inyección de dependencias en los endpoints


# Modelos de Datos
Definen la estructura de la base de datos usando SQLAlchemy ORM:




# Schemas (Pydantic)
Definen la validación de datos para las API:

- Cada schema corresponde a un modelo y define cómo se validan los datos de entrada/salida
- Incluye schemas para autenticación, tokens y configuración


# Routers
Definen los endpoints de la API REST:

- Cada router maneja un recurso específico (clientes, productos, pedidos, etc.)
- auth.py : Endpoints para autenticación y gestión de sesiones


# Repositorios
Implementan el patrón repositorio para acceso a datos:

- Cada repositorio encapsula las operaciones CRUD para un modelo específico
- Separa la lógica de acceso a datos de la lógica de negocio


# Servicios
Implementan lógica de negocio compleja:

- scheduler_service.py : Servicio para verificar vencimientos y generar notificaciones
- websocket_manager.py : Gestión de conexiones WebSocket para notificaciones en tiempo real
- whatsapp_service.py : Integración con WhatsApp para envío de notificaciones


# Despliegue
- requirements.txt : Dependencias del proyecto
- dockerfile: Configuración para despliegue con Docker


# 3. Flujo de Datos
1. 1.
   Las peticiones HTTP llegan a los routers
2. 2.
   Los routers utilizan schemas para validar los datos de entrada
3. 3.
   Los routers llaman a los repositorios para acceder a la base de datos
4. 4.
   Los repositorios utilizan los modelos para interactuar con la base de datos
5. 5.
   Los servicios implementan lógica de negocio compleja (notificaciones, programación de tareas)
6. 6.

Los datos validados se devuelven como respuesta HTTP
Esta arquitectura sigue el patrón de diseño de capas, separando claramente las responsabilidades y facilitando el mantenimiento y la escalabilidad del sistema.



# Guía de Instalación Paso a Paso para el Backend


# Requisitos Previos
- Python 3.10 o superior
- Acceso a la línea de comandos (PowerShell o CMD en Windows)
- Git (para clonar el repositorio)


# Paso 1: Preparar el Entorno Virtual

1. 1.
   Abre una terminal (PowerShell o CMD) en la carpeta raíz del proyecto:
   
   ``` 
    cd 
    c:\Users\silva\Documents\GitHub\Proyecto-EstudioContable-
    ```


2. 2.
   Crea un entorno virtual:
   
   ```
   python -m venv venv
   ```

Activa el entorno virtual:
   
- En Windows (PowerShell):

```
.\venv\Scripts\Activate.ps1
```

- En Windows (CMD):

```
venv\Scripts\activate.bat
```

## Paso 2: Instalar Dependencias

Asegúrate de que el entorno virtual está activado (verás (venv) al inicio de la línea de comandos)

Instala todas las dependencias del archivo requirements.txt:

```
pip install -r backend\requirements.txt
Esto instalará:
```
    FastAPI: Framework web para crear APIs
    SQLAlchemy: ORM para interactuar con la base de datos
    Uvicorn: Servidor ASGI para ejecutar la aplicación
    Pydantic: Para validación de datos
    Otras dependencias necesarias


# Paso 3: Configuraciones Adicionales

Configura las variables de entorno en el archivo app/config.py:

Asegúrate de que la base de datos esté configurada correctamente en backend/database.py

Paso 4: Iniciar el Backend

Desde la carpeta raíz del proyecto, con el entorno virtual activado, ejecuta:

```
cd api-backend
uvicorn app.main:app --reload
```

El servidor se iniciará en http://127.0.0.1:8000


Puedes acceder a la documentación automática de la API en:

Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc
Solución de Problemas Comunes

Error de importación de módulos:

Asegúrate de que estás ejecutando el servidor desde la carpeta correcta
Verifica que el entorno virtual esté activado

Error de conexión a la base de datos:

Revisa la configuración en app/database.py
Asegúrate de que la base de datos existe y es accesible


Error con las dependencias:

Si hay conflictos, intenta: pip install -r backend\requirements.txt --force-reinstall


Problemas con el scheduler:

Verifica que APScheduler esté correctamente instalado
Revisa los logs para identificar errores específicos
Esta guía te permitirá configurar y ejecutar el backend del sistema de gestión contable. Si encuentras algún problema específico durante la instalación, revisa los mensajes de error para obtener más detalles.


<!> Comando que use para levantar el entorno lo e arriba toeno que pulilo pero porhaora no 



   Como tu Senior Backend Architect, te confirmo que para una estación de trabajo nueva necesitas preparar tanto el entorno de Docker (para la base de datos y servicios) como el entorno Local (para desarrollo rápido y autocompletado en tu IDE).
   Aquí tienes la hoja de ruta técnica para dejar la ThinkPad-L390 operativa en 5 minutos:
   1. Requisitos del Sistema
   Asegúrate de tener instalado:
   Python 3.12 (es la versión que definimos en el Dockerfile).
   Docker y Docker Compose V2.
   Git.
   2. Configuración del Entorno Virtual (Local)
   Desde la raíz de api-backend/, ejecuta:
   code
   Bash
   # 1. Crear el entorno virtual
   python3 -m venv venv

   # 2. Activarlo
   source venv/bin/activate

   # 3. Actualizar pip e instalar dependencias
   pip install --upgrade pip
   pip install -r requirements.txt
   3. Configuración de Infraestructura (Docker)
   Tu proyecto depende de una red externa llamada northcode-net. Si no la creas, el docker-compose fallará.
   code
   Bash
   # Crear la red necesaria para que los contenedores se hablen
   docker network create northcode-net
   4. Variables de Entorno (El paso más importante)
   Como el archivo .env no se sube al repo, debes crearlo. Usa el template que definimos anteriormente:

   poblar la dbse d datow on datos de prueb 
   

</!>