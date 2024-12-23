from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Workout(BaseModel):
    id: Optional[int] = None
    type: str  # "gym", "running", "calisthenics", "functional workout"
    date: datetime
    duration_minutes: int
    location: Optional[str] = None
    details: Optional[str] = None
