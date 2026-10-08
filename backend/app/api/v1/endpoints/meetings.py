"""
Meeting endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.db.session import get_db
from app.models.meeting import Meeting, MeetingStatus, AgendaItem, Decision, Task, TaskStatus
from app.api.deps import get_current_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/meetings", tags=["Meetings"])


class MeetingCreate(BaseModel):
    club_id: uuid.UUID
    title: str
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None


class MeetingOut(BaseModel):
    id: uuid.UUID
    club_id: uuid.UUID
    title: str
    scheduled_at: Optional[datetime]
    location: Optional[str]
    status: MeetingStatus
    model_config = {"from_attributes": True}


class MinutesUpdate(BaseModel):
    minutes: str
    summary: Optional[str] = None


@router.get("/club/{club_id}", response_model=List[MeetingOut])
def list_meetings(club_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Meeting).filter(Meeting.club_id == club_id).all()


@router.post("", response_model=MeetingOut, status_code=201)
def create_meeting(body: MeetingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meeting = Meeting(**body.model_dump())
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@router.patch("/{meeting_id}/minutes", response_model=MeetingOut)
def update_minutes(meeting_id: str, body: MinutesUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(404, "Meeting not found")
    meeting.minutes = body.minutes
    meeting.summary = body.summary
    meeting.status = MeetingStatus.COMPLETED
    db.commit()
    db.refresh(meeting)
    return meeting
