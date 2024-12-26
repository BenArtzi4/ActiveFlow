import firebase_admin
from firebase_admin import auth, credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("config/firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

async def register_user(email: str, password: str, username: str):
    """Registers a new user in Firebase Auth and stores the user in Firestore."""
    user = auth.create_user(email=email, password=password)
    user_doc = {
        "uid": user.uid,
        "email": email,
        "username": username
    }
    db.collection("users").document(user.uid).set(user_doc)
    return user_doc

async def login_user(email: str, password: str):
    """Retrieves user information from Firebase Auth."""
    user = auth.get_user_by_email(email)
    return {"uid": user.uid, "email": user.email}

def add_workout(workout):
    """
    Adds a new workout document to the Firestore "workouts" collection.
    """
    workout_doc = workout.dict()
    doc_ref = db.collection("workouts").add(workout_doc)
    return doc_ref[1].id

def get_workouts(user_id: str):
    """
    Fetches all workouts for a specific user from the Firestore "workouts" collection.
    """
    workouts = db.collection("workouts").where("user_id", "==", user_id).stream()
    return [doc.to_dict() for doc in workouts]
