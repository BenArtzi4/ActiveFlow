from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Workout(BaseModel):
    id: Optional[str] = None
    user_id: str
    type: str  # gym / running / calisthenics / functional / yoga
    date: datetime
    duration_minutes: int
    trainer_notes: Optional[str] = None
    details: Optional[str] = None 
    location: Optional[str] = None
    start_location: Optional[str] = None
    end_location: Optional[str] = None
    distance: Optional[float] = None
    calories_burned: Optional[int] = None
    main_muscles: Optional[List[str]] = None
    poses: Optional[List[str]] = None
    equipment_used: Optional[List[str]] = None
