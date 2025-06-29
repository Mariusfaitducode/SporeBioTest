from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func
from models.biosample import BioSample
from schemas.biosample import BioSampleCreate
from db.database import get_session
from typing import List
from datetime import date

router = APIRouter()

@router.post("/", response_model=BioSample)
def create_biosample(biosample: BioSampleCreate, session: Session = Depends(get_session)):
    
    if biosample.sampling_date is None:
        biosample.sampling_date = date.today()
    
    db_biosample = BioSample(**biosample.model_dump()) 
    session.add(db_biosample)
    session.commit()
    session.refresh(db_biosample)
    return db_biosample

@router.get("/", response_model=dict)
def get_biosamples(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    session: Session = Depends(get_session)
):
    # Calculate offset
    offset = (page - 1) * size
    
    # Get total count
    total_count = session.exec(select(func.count(BioSample.id))).one()
    
    # Get paginated results
    statement = select(BioSample).offset(offset).limit(size)
    biosamples = session.exec(statement).all()
    
    # Calculate pagination metadata
    total_pages = (total_count + size - 1) // size
    
    return {
        "items": biosamples,
        "page": page,
        "size": size,
        "total": total_count,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }

@router.get("/{biosample_id}", response_model=BioSample)
def get_biosample(biosample_id: int, session: Session = Depends(get_session)):
    return session.get(BioSample, biosample_id)

@router.put("/{biosample_id}", response_model=BioSample)
def update_biosample(biosample_id: int, biosample: BioSampleCreate, session: Session = Depends(get_session)):
    db_biosample = session.get(BioSample, biosample_id)
    if not db_biosample:
        raise HTTPException(status_code=404, detail="BioSample not found")
    
    if biosample.sampling_date is None:
        biosample.sampling_date = db_biosample.sampling_date
    
    db_biosample.sampling_location = biosample.sampling_location
    db_biosample.type = biosample.type
    db_biosample.sampling_date = biosample.sampling_date
    db_biosample.sampling_operator = biosample.sampling_operator
    session.commit()
    session.refresh(db_biosample)
    return db_biosample

@router.delete("/{biosample_id}", response_model=BioSample)
def delete_biosample(biosample_id: int, session: Session = Depends(get_session)):
    db_biosample = session.get(BioSample, biosample_id)
    if not db_biosample:
        raise HTTPException(status_code=404, detail="BioSample not found")
    session.delete(db_biosample)
    session.commit()
    return db_biosample
