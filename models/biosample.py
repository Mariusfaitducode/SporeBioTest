from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date

from typing import Optional, List, TYPE_CHECKING
if TYPE_CHECKING:
    from .comment import Comment

class BioSample(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sampling_location: str
    type: str  # e.g., water, chocolate, flour
    sampling_date: date
    sampling_operator: str

    comments: List["Comment"] = Relationship(back_populates="biosample")
