from datetime import date
from pydantic import BaseModel
from typing import Optional

class BioSampleCreate(BaseModel):
    sampling_location: str
    type: str
    sampling_date: Optional[date] = None
    sampling_operator: str