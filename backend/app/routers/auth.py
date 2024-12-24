from fastapi import APIRouter, HTTPException
from app.services.firebase_service import register_user, login_user

router = APIRouter()

@router.post("/register")
async def register(email: str, password: str, username: str):
    try:
        user = await register_user(email, password, username)
        return {"message": "User registered successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(email: str, password: str):
    try:
        user = await login_user(email, password)
        return {"message": "Login successful", "user": user}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
