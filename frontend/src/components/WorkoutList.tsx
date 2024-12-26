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
  poses?: string[];
  equipment_used?: string[];
}

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const workoutsRef = collection(db, "workouts");
        const q = query(workoutsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const workoutsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workout[];

        setWorkouts(workoutsData);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Workout History</h2>
      {workouts.length === 0 ? (
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
