"""
Membership endpoints – join requests, membership management
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from typing import Optional
from app.db.session import get_db
from app.models.membership import JoinRequest, JoinRequestStatus, Membership, ClubRole
from app.api.deps import get_current_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/memberships", tags=["Memberships"])


class JoinRequestCreate(BaseModel):
    club_id: uuid.UUID
    motivation: Optional[str] = None


class JoinRequestOut(BaseModel):
    id: uuid.UUID
    club_id: uuid.UUID
    user_id: uuid.UUID
    motivation: Optional[str]
    status: JoinRequestStatus
    model_config = {"from_attributes": True}


class ReviewRequest(BaseModel):
    approve: bool
    review_note: Optional[str] = None


@router.post("/join-requests", response_model=JoinRequestOut, status_code=201)
def submit_join_request(
    body: JoinRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check duplicate
    existing = db.query(JoinRequest).filter(
        JoinRequest.user_id == current_user.id,
        JoinRequest.club_id == body.club_id,
        JoinRequest.status == JoinRequestStatus.PENDING
    ).first()
    if existing:
        raise HTTPException(400, "A pending request already exists")
    req = JoinRequest(user_id=current_user.id, club_id=body.club_id, motivation=body.motivation)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("/join-requests/club/{club_id}", response_model=List[JoinRequestOut])
def get_club_join_requests(
    club_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(JoinRequest).filter(
        JoinRequest.club_id == club_id,
        JoinRequest.status == JoinRequestStatus.PENDING
    ).all()


@router.patch("/join-requests/{request_id}/review", response_model=JoinRequestOut)
def review_join_request(
    request_id: str,
    body: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(JoinRequest).filter(JoinRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Request not found")
    req.status = JoinRequestStatus.APPROVED if body.approve else JoinRequestStatus.REJECTED
    req.reviewed_by_id = current_user.id
    req.review_note = body.review_note
    if body.approve:
        membership = Membership(user_id=req.user_id, club_id=req.club_id, role=ClubRole.MEMBER)
        db.add(membership)
    db.commit()
    db.refresh(req)
    return req
