import { useState } from "react";
import api from "../api";

const WorkoutForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    duration_minutes: 0,
    location: "",
    details: "",
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
        setFormData({
          type: "",
          date: "",
          duration_minutes: 0,
          location: "",
          details: "",
        });
      })
      .catch((error) => console.error("Error adding workout:", error));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="block w-full border p-2 rounded"
        >
          <option value="">Select a type</option>
          <option value="gym">Gym</option>
          <option value="running">Running</option>
          <option value="calisthenics">Calisthenics</option>
          <option value="functional workout">Functional Workout</option>
        </select>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="block w-full border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="duration_minutes">Duration (minutes)</label>
        <input
          type="number"
          id="duration_minutes"
          name="duration_minutes"
          value={formData.duration_minutes}
          onChange={handleChange}
          required
          className="block w-full border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="details">Details</label>
        <textarea
          id="details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Workout
      </button>
    </form>
  );
};

export default WorkoutForm;
