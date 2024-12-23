from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Workout

router = APIRouter()

# In-memory storage for simplicity (replace with Firestore later)
workouts_db = []

@router.get("/workouts", response_model=List[Workout])
def get_workouts():
    """Retrieve all workouts"""
    return workouts_db

@router.post("/workouts", response_model=Workout)
def add_workout(workout: Workout):
    """Add a new workout"""
    workout.id = len(workouts_db) + 1  # Simulating auto-increment
    workouts_db.append(workout)
    return workout

@router.delete("/workouts/{workout_id}")
def delete_workout(workout_id: int):
    """Delete a workout by ID"""
    global workouts_db
    workouts_db = [w for w in workouts_db if w.id != workout_id]
    return {"message": f"Workout {workout_id} deleted"}
