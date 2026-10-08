"""
Institution schemas
"""
from pydantic import BaseModel
from typing import Optional
import uuid
from app.models.institution import CollegeStatus


class CollegeCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    university: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    website: Optional[str] = None


class CollegeOut(BaseModel):
    id: uuid.UUID
    name: str
    short_name: Optional[str]
    university: Optional[str]
    city: Optional[str]
    state: Optional[str]
    website: Optional[str]
    logo_url: Optional[str]
    status: CollegeStatus

    model_config = {"from_attributes": True}


class DepartmentCreate(BaseModel):
    college_id: uuid.UUID
    name: str
    short_name: Optional[str] = None


class DepartmentOut(BaseModel):
    id: uuid.UUID
    college_id: uuid.UUID
    name: str
    short_name: Optional[str]

    model_config = {"from_attributes": True}
