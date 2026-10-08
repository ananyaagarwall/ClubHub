"""
Auth schemas – login, register, tokens
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    global_role: str
    is_active: bool

    model_config = {"from_attributes": True}
