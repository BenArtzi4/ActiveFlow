import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "A password reset email has been sent to your email address. Please check your inbox."
      );
      setError(null);
    } catch (err: unknown) {
      console.error("Error sending password reset email:", err);
      setMessage(null);
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Enter your email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-orange-600 bg-gray-50 border-2 border-orange-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            <span className="absolute left-0 block w-full h-0 transition-all bg-orange-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
            <span className="relative z-10">Send Reset Email</span>
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-orange-600 bg-gray-50 border-2 border-orange-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-orange-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
          <span className="relative z-10">Back to Login</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
