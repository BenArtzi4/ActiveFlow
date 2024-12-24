from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class Workout(BaseModel):
    id: Optional[str] = None
    type: str 
    date: datetime
    duration_minutes: int
    location: Optional[str] = None
    details: Optional[str] = None

class User(BaseModel):
    email: EmailStr
    password: str
    username: str
