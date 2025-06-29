from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.database import create_db_and_tables
from api import biosample, comment 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield
    # Shutdown (if needed)

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

app.include_router(biosample.router, prefix="/biosamples", tags=["BioSamples"])
app.include_router(comment.router, prefix="/comments", tags=["Comments"])