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

    # Location fields
    location: Optional[str] = None  # for all types except running
    start_location: Optional[str] = None  # for running
    end_location: Optional[str] = None  # for running

    # Running-specific fields
    distance: Optional[float] = None
    calories_burned: Optional[int] = None

    # Gym-specific fields
    main_muscles: Optional[List[str]] = None

    # Yoga-specific fields
    poses: Optional[List[str]] = None

    # Functional-specific fields
    equipment_used: Optional[List[str]] = None
