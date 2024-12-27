import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import WorkoutDetails from "./WorkoutDetails";

const db = getFirestore();

interface Workout {
  id: string;
  type: string;
  date: string;
  duration_minutes: number;
  trainer_notes?: string;
  location?: string;
  start_location?: string;
  end_location?: string;
  distance?: number;
  calories_burned?: number;
  main_muscles?: string[];
  poses?: string[] | string;
  equipment_used?: string[];
}

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not logged in. Please log in to view your workouts.");
          return;
        }

        const workoutsRef = collection(db, "workouts");
        const q = query(workoutsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const workoutsData = querySnapshot.docs
            .map((doc) => {
              const data = doc.data() as Omit<Workout, "id">;
              return {
                id: doc.id,
                ...data,
              };
            })
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ); // Sort by date

          setWorkouts(workoutsData);
        } else {
          setWorkouts([]);
          setError("No workouts found.");
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to fetch workouts. Please try again.");
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Workout History</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : workouts.length === 0 ? (
        <p>No workouts available.</p>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutDetails key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
