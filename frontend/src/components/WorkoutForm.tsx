import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const WorkoutForm = () => {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
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

        <button
          onClick={() => navigate("/")}
          type="button"
          className="px-6 py-3 text-lg font-medium text-gray-800 bg-gray-200 rounded-full shadow hover:bg-gray-300"
        >
          Back
        </button>

        <button
          type="submit"
          className="w-full px-6 py-3 text-lg font-medium text-white bg-light-blue-500 rounded-lg shadow hover:bg-light-blue-600"
        >
          Add Workout
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
