from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
import os
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./biosamples.db")


engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    from models import biosample, comment 
    SQLModel.metadata.create_all(engine)

# FastAPI session dependency
def get_session():
    with Session(engine) as session:
        yield session
