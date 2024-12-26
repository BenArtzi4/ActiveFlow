import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const WorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    duration_minutes: 0,
    trainer_notes: "",
    location: "",
    start_location: "",
    end_location: "",
    distance: "",
    calories_burned: "",
    main_muscles: "",
    poses: "",
    equipment_used: "",
  });

  // Handle input changes with proper typing
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission with proper typing
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post("/api/workouts", formData)
      .then(() => {
        alert("Workout added successfully!");
        navigate("/");
      })
      .catch((error) => console.error("Error adding workout:", error));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add a New Workout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workout Type */}
        <div>
          <label
            htmlFor="type"
            className="block font-medium text-gray-700 mb-2"
          >
            Workout Type
          </label>
          <ul className="grid grid-cols-2 gap-4">
            {["gym", "running", "calisthenics", "functional", "yoga"].map(
              (type) => (
                <li
                  key={type}
                  className={`cursor-pointer p-3 border rounded-lg flex items-center space-x-3 ${
                    formData.type === type
                      ? "bg-light-blue-100 border-light-blue-400"
                      : "bg-gray-100 border-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, type })}
                >
                  <img
                    src={`/icons/workouts/${type}.png`}
                    alt={type}
                    className="h-8 w-8"
                  />
                  <span className="text-lg font-semibold capitalize">
                    {type}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block font-medium text-gray-700 mb-2"
          >
            Date
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="block w-full border p-3 rounded-lg shadow-sm"
          />
        </div>

        {/* Duration */}
        <div>
          <label
            htmlFor="duration_minutes"
            className="block font-medium text-gray-700 mb-2"
          >
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration_minutes"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            required
            className="block w-full border p-3 rounded-lg shadow-sm"
          />
        </div>

        {/* Additional Fields Based on Type */}
        {formData.type === "gym" && (
          <div>
            <label
              htmlFor="main_muscles"
              className="block font-medium text-gray-700 mb-2"
            >
              Main Muscles Targeted
            </label>
            <input
              type="text"
              id="main_muscles"
              name="main_muscles"
              placeholder="Comma-separated muscles (e.g., chest, arms)"
              value={formData.main_muscles}
              onChange={handleChange}
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
        )}

        {formData.type === "yoga" && (
          <div>
            <label
              htmlFor="poses"
              className="block font-medium text-gray-700 mb-2"
            >
              Yoga Poses
            </label>
            <input
              type="text"
              id="poses"
              name="poses"
              placeholder="Comma-separated poses (e.g., downward dog, cobra)"
              value={formData.poses}
              onChange={handleChange}
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
        )}

        {formData.type === "functional" && (
          <div>
            <label
              htmlFor="equipment_used"
              className="block font-medium text-gray-700 mb-2"
            >
              Equipment Used
            </label>
            <input
              type="text"
              id="equipment_used"
              name="equipment_used"
              placeholder="Comma-separated equipment (e.g., kettlebell, rope)"
              value={formData.equipment_used}
              onChange={handleChange}
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
        )}

        {formData.type !== "running" && formData.type !== "" && (
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location"
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
        )}

        {formData.type === "running" && (
          <>
            <div>
              <label
                htmlFor="start_location"
                className="block font-medium mb-2"
              >
                Start Location
              </label>
              <input
                type="text"
                id="start_location"
                name="start_location"
                value={formData.start_location}
                onChange={handleChange}
                className="block w-full border p-3 rounded-lg shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="end_location" className="block font-medium mb-2">
                End Location
              </label>
              <input
                type="text"
                id="end_location"
                name="end_location"
                value={formData.end_location}
                onChange={handleChange}
                className="block w-full border p-3 rounded-lg shadow-sm"
              />
            </div>
          </>
        )}

        <div className="flex flex-col items-center space-y-4 mt-6">
          <button
            type="submit"
            className="w-full max-w-xs px-6 py-3 text-lg font-medium text-white bg-light-blue-500 rounded-lg shadow hover:bg-light-blue-600"
          >
            Add Workout
          </button>

          <button
            onClick={() => navigate("/")}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-full shadow hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
