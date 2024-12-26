import React, { useState } from "react";

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
  poses?: string[] | string; // Updated to accept string as well
  equipment_used?: string[];
}

// Utility function to capitalize the first letter of the workout type
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const WorkoutDetails: React.FC<{ workout: Workout }> = ({ workout }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border p-4 rounded shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={`/icons/workouts/${workout.type.toLowerCase()}.png`}
            alt={workout.type}
            className="h-10 w-10"
          />
          <p className="ml-4 font-semibold">
            {`${capitalizeFirstLetter(workout.type)} - ${formatDate(
              workout.date
            )}`}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Type:</strong> {capitalizeFirstLetter(workout.type)}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(workout.date)}
          </p>
          <p>
            <strong>Duration:</strong> {workout.duration_minutes} minutes
          </p>
          {workout.location && (
            <p>
              <strong>Location:</strong> {workout.location}
            </p>
          )}
          {workout.start_location && (
            <p>
              <strong>Start Location:</strong> {workout.start_location}
            </p>
          )}
          {workout.end_location && (
            <p>
              <strong>End Location:</strong> {workout.end_location}
            </p>
          )}
          {workout.distance && (
            <p>
              <strong>Distance:</strong> {workout.distance} km
            </p>
          )}
          {workout.calories_burned && (
            <p>
              <strong>Calories Burned:</strong> {workout.calories_burned}
            </p>
          )}
          {workout.main_muscles && (
            <p>
              <strong>Main Muscles:</strong> {workout.main_muscles.join(", ")}
            </p>
          )}
          {workout.poses && (
            <p>
              <strong>Yoga Poses:</strong>{" "}
              {Array.isArray(workout.poses)
                ? workout.poses.join(", ")
                : workout.poses || "Not specified"}
            </p>
          )}
          {workout.equipment_used && (
            <p>
              <strong>Equipment Used:</strong>{" "}
              {workout.equipment_used.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutDetails;
