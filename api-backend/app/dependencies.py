# /api-backend/app/dependencies.py
# <!> Esta clase no tengo ni idea para que es 
from .database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 
