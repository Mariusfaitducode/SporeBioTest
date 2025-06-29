from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.biosample import BioSample
from schemas.biosample import BioSampleCreate
from db.database import get_session
from typing import List

router = APIRouter()

@router.post("/", response_model=BioSample)
def create_biosample(biosample: BioSampleCreate, session: Session = Depends(get_session)):
    db_biosample = BioSample(**biosample.model_dump()) 
    session.add(db_biosample)
    session.commit()
    session.refresh(db_biosample)
    return db_biosample

@router.get("/", response_model=List[BioSample])
def get_biosamples(session: Session = Depends(get_session)):
    return session.exec(select(BioSample)).all()

@router.get("/{biosample_id}", response_model=BioSample)
def get_biosample(biosample_id: int, session: Session = Depends(get_session)):
    return session.get(BioSample, biosample_id)

@router.put("/{biosample_id}", response_model=BioSample)
def update_biosample(biosample_id: int, biosample: BioSampleCreate, session: Session = Depends(get_session)):
    db_biosample = session.get(BioSample, biosample_id)
    if not db_biosample:
        raise HTTPException(status_code=404, detail="BioSample not found")
    db_biosample.sampling_location = biosample.sampling_location
    db_biosample.type = biosample.type
    db_biosample.sampling_date = biosample.sampling_date
    db_biosample.sampling_operator = biosample.sampling_operator

@router.delete("/{biosample_id}", response_model=BioSample)
def delete_biosample(biosample_id: int, session: Session = Depends(get_session)):
    db_biosample = session.get(BioSample, biosample_id)
    if not db_biosample:
        raise HTTPException(status_code=404, detail="BioSample not found")
    session.delete(db_biosample)
    session.commit()
    return db_biosample
