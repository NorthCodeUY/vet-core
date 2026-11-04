### 1. El Diagnóstico Conceptual: Retail vs. Automotor

En una tienda de ropa o veterinaria vendes **artículos fungibles** (cualquier remera talle M roja es idéntica a otra remera talle M roja). 

En una automotora vendes **bienes identificables únicos (Unidades Serializadas)**:
- Dos autos pueden ser el mismo modelo exacto (*Toyota Hilux 2024 Blanca 4x4*).
- Pero **NO son el mismo producto físico**: cada uno tiene un **VIN / Número de Chasis único**, un **Padrón / Matrícula**, un **Kilometraje**, un estado mecánico particular y está estacionado en una **Sucursal física** específica (ej: Sucursal Centro vs. Sucursal Este).

---

### 2. El Patrón Arquitectural: "Core Product + Vertical Extension"

No necesitas reescribir el backend ni crear una base de datos nueva. La arquitectura limpia de VetCore resuelve esto con el patrón de **Extensión Polimórfica (Tabla de Dominio 1 a 1)**:

1. **`ProductoModel` (Padre Core):** Sigue existiendo. Guarda lo común a cualquier tienda: Marca/Modelo (`prod_nombre`), Fotos generales (`rel_imagenes`), Categoría (`cat_id = "Camionetas"`), Precio base y flags de visibilidad.
2. **`VehiculoDetalleModel` (Extensión Vertical):** Una tabla que se conecta 1 a 1 con el producto si el `TENANT_TYPE == "AUTOMOTIVE"`. Aquí viven los datos puros de un auto: Chasis (VIN), Motor, Año, Kilometraje, Combustible, Transmisión y Sucursal.
3. **¿Y las Sucursales?** ¡Ya tienes la base! Lo que hoy llamamos **`CajaModel` (Depósito)**, en el dominio de autos es conceptualmente una **`Sucursal / Salón de Ventas`** (Nombre, Dirección, Contacto, Localidad).

---

### 3. Diagrama de Arquitectura Conceptual (Mermaid)


```mermaid
classDiagram
    %% CLASE PRINCIPAL DEL CATÁLOGO
    class ProductoModel {
        +int prod_id
        +string prod_nombre "Toyota Hilux SRX"
        +float prod_precio "55000.00"
        +string prod_descripcion
        +bool prod_visible
        +bool prod_activo
        +int cat_id "Pickups"
    }

    %% EXTENSIÓN ESPECÍFICA PARA AUTOMOTORA (1 a 1)
    class VehiculoDetalleModel {
        +int veh_id
        +int prod_id FK
        +string vin_chasis "8AJHA42G..." (ÚNICO)
        +string matricula "ABC-1234"
        +int anio "2024"
        +int kilometraje "0 km"
        +string combustible "Diesel"
        +string transmision "Automática"
        +string traccion "4x4"
        +string estado "Nuevo | Usado | Consignación"
        +int sucursal_id FK
    }

    %% ENTIDAD DE UBICACIÓN FÍSICA (Reutiliza el concepto de Caja/Depósito)
    class SucursalModel {
        +int sucursal_id
        +string nombre "Sucursal Central Pocitos"
        +string direccion "Av. Brasil 2450"
        +string telefono_contacto "+598 99 123 456"
        +string responsable "Carlos Méndez"
        +string qr_ubicacion "QR-SUC-01"
    }

    %% VARIANTES VISUALES O EXTRAS DEL VEHÍCULO
    class ProductoVarianteModel {
        +int var_id
        +int prod_id FK
        +string var_tipo "Color de Carrocería | Equipamiento"
        +string var_nombre "Blanco Perlado | Tapizado Cuero"
        +float var_precio_adicional "800.00"
        +int var_stock "1"
        +int col_id FK
    }

    class ColorModel {
        +int col_id
        +string col_nombre "Blanco Perlado"
        +string col_hex "#F8F9FA"
    }

    %% RELACIONES
    ProductoModel "1" -- "0..1" VehiculoDetalleModel : Extensión por Tenant (1:1)
    SucursalModel "1" -- "0..*" VehiculoDetalleModel : Ubicación Física (1:N)
    ProductoModel "1" -- "0..*" ProductoVarianteModel : Opciones y Colores (1:N)
    ColorModel "1" -- "0..*" ProductoVarianteModel : Mapeo Visual
```

---

### 4. Cómo Resuelve los Escenarios del Negocio

#### Escenario A: "Tengo 2 autos del mismo modelo, pero son dos unidades distintas (mismo color, distinto chasis/sucursal)"
- Tienes dos filas en `ProductoModel` (ej: *Toyota Yaris 1.5 XS - Unidad #1* y *Unidad #2*).
- Cada fila tiene su propio `VehiculoDetalleModel`:
  - **Auto A:** VIN `...1234`, Kilometraje `0 km`, Ubicación: `Sucursal Centro`.
  - **Auto B:** VIN `...5678`, Kilometraje `0 km`, Ubicación: `Sucursal Car One`.
- Al vender el Auto A, se marca `prod_activo = False`. El Auto B sigue publicado en la web.

#### Escenario B: "Tengo una tarjeta de un auto 0KM y el cliente elige el color en la web"
- Creas **un único producto padre**: `prod_nombre: "Peugeot 208 0km"`.
- Creas variantes en `ProductoVarianteModel`:
  - Opción 1: Color `Gris Artense` (Stock: 2).
  - Opción 2: Color `Rojo Elixir` (Precio adicional: +USD 300, Stock: 1).
- El usuario en la web ve **una sola tarjeta**, cambia de color con tus círculos `#HEX` ya implementados y ve el precio actualizado.

---

### 5. Cómo se Activa en tu Código con Cero Acoplamiento

En el archivo de configuración del nuevo cliente (`.env.automotora`):
```env
TENANT_TYPE=AUTOMOTIVE
ENABLE_VEHICLE_MODULE=true
```

En `app/main.py`:
```python
# Carga condicional del módulo automotor (Feature Flag)
if settings.ENABLE_VEHICLE_MODULE:
    from app.router import vehiculo_router
    app.include_router(vehiculo_router.router, prefix="/api/vehiculos", tags=["Automotora"])
```

### Conclusión Arquitectural:
Tu diseño actual es sólido y flexible. Pasar de vender ropa o medicamentos a vender autos **no requiere reescribir nada**. Solo implicará:
1. Crear una tabla satélite `VehiculoDetalleModel` con clave foránea a `prod_id`.
2. Reutilizar la lógica de depósitos/cajas bajo el concepto de "Sucursales de exhibición".
3. Tu buscador, filtros por categoría, subcategorías con íconos vectoriales y el carrito seguirán funcionando exactamente igual.