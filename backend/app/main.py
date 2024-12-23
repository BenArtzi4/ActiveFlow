from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import workouts



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
allow_origins=["http://localhost:5173"] 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to ActiveFlow"}


app.include_router(workouts.router, prefix="/api", tags=["Workouts"])
