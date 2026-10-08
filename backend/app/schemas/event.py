"""
Event schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from app.models.event import EventStatus, EventVisibility


class EventCreate(BaseModel):
    club_id: uuid.UUID
    title: str
    description: Optional[str] = None
    goal: Optional[str] = None
    expected_turnout: Optional[int] = None
    audience: Optional[str] = None
    venue: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    visibility: EventVisibility = EventVisibility.PUBLIC


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goal: Optional[str] = None
    expected_turnout: Optional[int] = None
    audience: Optional[str] = None
    venue: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    visibility: Optional[EventVisibility] = None
    registration_link: Optional[str] = None
    feedback_summary: Optional[str] = None
    lessons_learned: Optional[str] = None


class EventStageAdvance(BaseModel):
    notes: Optional[str] = None


class EventOut(BaseModel):
    id: uuid.UUID
    club_id: uuid.UUID
    title: str
    description: Optional[str]
    goal: Optional[str]
    expected_turnout: Optional[int]
    venue: Optional[str]
    start_datetime: Optional[datetime]
    end_datetime: Optional[datetime]
    stage: EventStatus
    visibility: EventVisibility
    is_locked: bool
    registration_link: Optional[str]

    model_config = {"from_attributes": True}
