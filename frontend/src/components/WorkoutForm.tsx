import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    duration_minutes: 0,
    details: "",
    location: "",
    start_location: "",
    end_location: "",
    distance: "",
    calories_burned: "",
    main_muscles: "",
    poses: "",
    equipment_used: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to Firestore
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        alert("You must be logged in to add a workout.");
        return;
      }

      // Validate form data
      if (!formData.type || !formData.date || !formData.duration_minutes) {
        alert("Please fill in all required fields.");
        return;
      }

      // Prepare workout data
      const workoutData = {
        ...formData,
        userId: user.uid,
        date: new Date(formData.date).toISOString(),
      };

      // Add document to Firestore
      await addDoc(collection(db, "workouts"), workoutData);

      alert("Workout added successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout. Please try again.");
    }
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

        {/* Common Fields */}
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

        <div>
          <label
            htmlFor="details"
            className="block font-medium text-gray-700 mb-2"
          >
            Additional Details
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="block w-full border p-3 rounded-lg shadow-sm"
            placeholder="Add any relevant details"
          />
        </div>

        {/* Conditional Fields */}
        {formData.type === "running" && (
          <>
            <div>
              <label
                htmlFor="start_location"
                className="block font-medium text-gray-700 mb-2"
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
              <label
                htmlFor="end_location"
                className="block font-medium text-gray-700 mb-2"
              >
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

            <div>
              <label
                htmlFor="distance"
                className="block font-medium text-gray-700 mb-2"
              >
                Distance (km)
              </label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="block w-full border p-3 rounded-lg shadow-sm"
              />
            </div>
          </>
        )}

        {(formData.type === "functional" || formData.type === "running") && (
          <div>
            <label
              htmlFor="calories_burned"
              className="block font-medium text-gray-700 mb-2"
            >
              Calories Burned (Optional)
            </label>
            <input
              type="number"
              id="calories_burned"
              name="calories_burned"
              value={formData.calories_burned}
              onChange={handleChange}
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
        )}

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
              value={formData.main_muscles}
              onChange={handleChange}
              placeholder="Comma-separated (e.g., chest, arms)"
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
              value={formData.poses}
              onChange={handleChange}
              placeholder="Comma-separated (e.g., downward dog, cobra)"
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
              value={formData.equipment_used}
              onChange={handleChange}
              placeholder="Comma-separated (e.g., kettlebell, rope)"
              className="block w-full border p-3 rounded-lg shadow-sm"
            />
          </div>
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
