# backend/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List

# ----- User schemas -----
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True


# ----- Job schemas -----
class JobBase(BaseModel):
    title: str
    company: str
    link: Optional[str] = None
    status: Optional[str] = "new"
    notes: Optional[str] = None

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    owner_id: int
    owner: UserOut
    class Config:
        from_attributes = True
