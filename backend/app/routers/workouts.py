from fastapi import APIRouter, HTTPException
from app.services.firebase_service import add_workout, get_workouts
from app.models import Workout

router = APIRouter()

@router.post("/")
def create_workout(workout: Workout):
    try:
        workout_id = add_workout(workout)
        return {"message": "Workout added successfully", "id": workout_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
def fetch_workouts(user_id: str):
    try:
        workouts = get_workouts(user_id)
        return workouts
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
def fetch_user_workouts(user_id: str):
    try:
        workouts = get_workouts(user_id)
        return workouts
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
