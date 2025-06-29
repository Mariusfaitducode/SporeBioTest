from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models.comment import Comment
from schemas.comment import CommentCreate
from db.database import get_session
from typing import List

router = APIRouter()

@router.post("/", response_model=Comment)
def create_comment(comment: CommentCreate, session: Session = Depends(get_session)):
    db_comment = Comment(**comment.model_dump())
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

@router.get("/", response_model=List[Comment])
def get_comments(session: Session = Depends(get_session)):
    return session.exec(select(Comment)).all()

@router.get("/{comment_id}", response_model=Comment)
def get_comment(comment_id: int, session: Session = Depends(get_session)):
    return session.get(Comment, comment_id)

@router.put("/{comment_id}", response_model=Comment)
def update_comment(comment_id: int, comment: Comment, session: Session = Depends(get_session)):
    db_comment = session.get(Comment, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db_comment.content = comment.content
    session.commit()
    session.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}", response_model=Comment)
def delete_comment(comment_id: int, session: Session = Depends(get_session)):
    db_comment = session.get(Comment, comment_id)
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    session.delete(db_comment)
    session.commit()
    return db_comment
