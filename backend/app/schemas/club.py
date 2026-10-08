"""
Club schemas
"""
from pydantic import BaseModel
from typing import Optional
import uuid
from app.models.club import ClubType, ClubStatus


class ClubCreate(BaseModel):
    college_id: uuid.UUID
    department_id: Optional[uuid.UUID] = None
    name: str
    short_name: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    club_type: ClubType = ClubType.DEPARTMENTAL


class ClubUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    instagram_handle: Optional[str] = None
    linkedin_url: Optional[str] = None


class ClubOut(BaseModel):
    id: uuid.UUID
    college_id: uuid.UUID
    department_id: Optional[uuid.UUID]
    name: str
    short_name: Optional[str]
    description: Optional[str]
    tagline: Optional[str]
    club_type: ClubType
    status: ClubStatus
    logo_url: Optional[str]
    cover_url: Optional[str]
    instagram_handle: Optional[str]
    linkedin_url: Optional[str]
    is_public: bool

    model_config = {"from_attributes": True}
