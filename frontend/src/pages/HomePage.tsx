import React from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const HomePage: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("You have been signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold">Welcome to ActiveFlow</h1>
      <p className="text-gray-600 mt-4">
        This is your homepage. You can start tracking your workouts!
      </p>
      <button
        onClick={handleSignOut}
        className="mt-6 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default HomePage;
