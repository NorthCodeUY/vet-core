<!-- app/vet-core/apps/web-client/src/components/ProductCard/REDMI.md -->

Estructura de subcategoria para la parte de eiconos segun el bakend 

┌──────────────────────────────────────────────┐
               │              ¿Llega 'imageUrl'?              │
               │        (Tu archivo SVG personalizado)        │
               └──────────────────────┬───────────────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
               [ SÍ ]                                    [ NO ]
      ────────────────────────               ────────────────────────
      Pinta TU SVG PROPIO                    ¿Existe el nombre en Lucide?
      (Ignora la librería Lucide)                      │
                                             ┌─────────┴─────────┐
                                             ▼                   ▼
                                           [ SÍ ]              [ NO ]
                                     ────────────────     ────────────────
                                     Pinta icono Lucide   Pinta icono neutro
                                     ("Shirt", "Dog")     (<Tag /> por defecto)

"""