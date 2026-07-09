
class CategoriaSchema(BaseModel): # Clase que representa la tabla "categoria" en la base de datos
    # <!> bueno esto lo voy a degar asi porque si no no quiero complicarme pero 
    # luego lo voy a modificar para que simpre lo entrege agropado asi la otra forma la use al priciop pero pero no tiene sentido 
    cat_nombre: str # Nombre de la categoria
    class Config: # Clase que representa la tabla "categoria" en la base de datos
        from_attributes = True