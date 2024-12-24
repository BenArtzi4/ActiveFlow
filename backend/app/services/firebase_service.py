import firebase_admin
from firebase_admin import auth, credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("env/firebase_credentials.json")  # Path to your Firebase service account key
firebase_admin.initialize_app(cred)
db = firestore.client()

async def register_user(email: str, password: str, username: str):
    user = auth.create_user(email=email, password=password)
    user_doc = {
        "uid": user.uid,
        "email": email,
        "username": username
    }
    db.collection("users").document(user.uid).set(user_doc)
    return user_doc

async def login_user(email: str, password: str):
    # Note: Firebase Admin SDK doesn't verify passwords directly. Use the client-side SDK for authentication.
    user = auth.get_user_by_email(email)
    return {"uid": user.uid, "email": user.email}

async def add_workout(workout):
    workout_doc = workout.dict()
    doc_ref = db.collection("workouts").add(workout_doc)
    return doc_ref[1].id

async def get_workouts(user_id: str):
    workouts = db.collection("workouts").where("user_id", "==", user_id).stream()
    return [doc.to_dict() for doc in workouts]
