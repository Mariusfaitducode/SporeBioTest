from datetime import date
from pydantic import BaseModel

class CommentCreate(BaseModel):
    content: str
    biosample_id: int
    created_at: date