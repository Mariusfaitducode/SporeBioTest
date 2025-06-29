from datetime import date
from pydantic import BaseModel
from typing import Optional

class CommentCreate(BaseModel):
    content: str
    biosample_id: int
    created_at: Optional[date] = None