from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import workouts, auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to ActiveFlow"}

# Routers for workouts and authentication
app.include_router(workouts.router, prefix="/api/workouts", tags=["Workouts"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
