# app/repositories/product_repo.py

def get_productos_filtrados(db: Session, cat_id: int = None, limit: int = 5, offset: int = 0):
    query = db.query(ProductoModel).options(
        joinedload(ProductoModel.rel_imagen_url),
        joinedload(ProductoModel.rel_categoria)
    )
    
    # Filtro opcional por categoría
    if cat_id:
        query = query.filter(ProductoModel.cat_id == cat_id)
        
    # Aplicamos paginación
    # limit: cuántos traer
    # offset: cuántos saltar (ej: si ya cargaste 5, el próximo offset es 5)
    return query.offset(offset).limit(limit).all()



# Funcina paero le falta 

    def get_productos_agrupados(db: Session, limit: int = 5, offset: int = 0):
    todos_los_productos = db.query(ProductoModel).options(
        joinedload(ProductoModel.rel_imagen_url), #<!> Sacar esto luego aver si funciona sin esto pero solo para sacarme la duda luego 
        joinedload(ProductoModel.rel_subcategoria),  # <!> Este tambien
        joinedload(ProductoModel.rel_categoria)
    ).offset(offset).limit(limit).all()
    
    # Agrupamos en memoria (es ultra rápido)
    grupos = defaultdict(list) # Usamos defaultdict para agrupar los productos por categoria
    for prod in todos_los_productos: # Recorremos todos los productos
        nombre_cat = prod.rel_categoria.cat_nombre # Obtenemos el nombre de la categoria
        grupos[nombre_cat].append(prod) # Agregamos el producto a la categoria correspondiente
        
    # Transformamos a la lista de dicts que quiere tu frontend
    resultado = []

    for cat, prods in grupos.items(): # Recorremos los productos y los agrupamos por categoria
        resultado.append({ # Agregamos los productos a la categoria correspondiente
            "cat_nombre": cat, # Nombre de la categoria
            "cat_id": prods[0].rel_categoria.cat_id, # ID de la categoria
            "productos": prods # Productos de la categoria
            })
    return resultado
