import { useEffect, useState } from "react";
import api from "../api";
import WorkoutDetails from "./WorkoutDetails";

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
    api
      .get(`/api/workouts/${localStorage.getItem("userId")}`)
      .then((response) => setWorkouts(response.data))
      .catch((error) => console.error("Error fetching workouts:", error));
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
