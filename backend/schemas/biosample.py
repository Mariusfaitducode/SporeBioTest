from datetime import date
from pydantic import BaseModel

class BioSampleCreate(BaseModel):
    sampling_location: str
    type: str
    sampling_date: date
    sampling_operator: str