from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from .biosample import BioSample

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    biosample_id: int = Field(foreign_key="biosample.id")
    content: str
    created_at: date

    biosample: Optional["BioSample"] = Relationship(back_populates="comments")