import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import WorkoutList from "../components/WorkoutList";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || "User");
        } else {
          setUsername("User");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("User");
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gradient-to-br from-light-blue-200 via-light-blue-300 to-light-blue-400 rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Welcome to <span className="text-light-blue-600">ActiveFlow</span>
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Hello, <span className="text-light-blue-700">{username}</span>
        </h2>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <WorkoutList />
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/add-workout")}
          className="px-6 py-3 text-lg font-medium text-white bg-light-blue-600 rounded-full shadow hover:bg-light-blue-700 focus:ring-4 focus:ring-light-blue-300 focus:outline-none"
        >
          Add a New Workout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
