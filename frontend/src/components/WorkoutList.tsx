import { useEffect, useState } from "react";
import api from "../api";

interface Workout {
  id: number;
  type: string;
  date: string;
  duration_minutes: number;
  location?: string;
  details?: string;
}

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    api
      .get("/api/workouts")
      .then((response) => setWorkouts(response.data))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Workout History</h2>
      {workouts.length === 0 ? (
        <p>No workouts available.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((workout) => (
            <li key={workout.id} className="border p-4 rounded">
              <p>
                <strong>Type:</strong> {workout.type}
              </p>
              <p>
                <strong>Date:</strong> {new Date(workout.date).toLocaleString()}
              </p>
              <p>
                <strong>Duration:</strong> {workout.duration_minutes} minutes
              </p>
              {workout.location && (
                <p>
                  <strong>Location:</strong> {workout.location}
                </p>
              )}
              {workout.details && (
                <p>
                  <strong>Details:</strong> {workout.details}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutList;
