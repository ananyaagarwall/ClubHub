"""
Document vault endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.db.session import get_db
from app.models.document import Document, DocumentCategory, ApprovalStatus
from app.api.deps import get_current_user, require_faculty_or_admin
from app.models.user import User
import uuid

router = APIRouter(prefix="/documents", tags=["Documents"])


class DocumentCreate(BaseModel):
    club_id: uuid.UUID
    event_id: Optional[uuid.UUID] = None
    title: str
    category: DocumentCategory = DocumentCategory.OTHER
    file_url: str
    file_name: Optional[str] = None
    notes: Optional[str] = None


class DocumentOut(BaseModel):
    id: uuid.UUID
    club_id: uuid.UUID
    event_id: Optional[uuid.UUID]
    title: str
    category: DocumentCategory
    file_url: str
    file_name: Optional[str]
    approval_status: ApprovalStatus
    is_public: bool
    model_config = {"from_attributes": True}


@router.post("", response_model=DocumentOut, status_code=201)
def upload_document(body: DocumentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    doc = Document(**body.model_dump(), uploaded_by_id=current_user.id)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/club/{club_id}", response_model=List[DocumentOut])
def list_club_documents(club_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Document).filter(Document.club_id == club_id).all()


@router.patch("/{doc_id}/approve", response_model=DocumentOut)
def approve_document(doc_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_faculty_or_admin)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(404, "Document not found")
    doc.approval_status = ApprovalStatus.APPROVED
    doc.approved_by_id = current_user.id
    db.commit()
    db.refresh(doc)
    return doc
