import React, { useState } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      setError("Invalid or missing reset link.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been successfully reset.");
      setError(null);
    } catch (err: unknown) {
      console.error("Error resetting password:", err);
      setMessage(null);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 via-teal-300 to-cyan-400">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Reset Password
        </h2>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Enter your new password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter your new password"
              required
            />
          </div>
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            <span className="absolute left-0 block w-full h-0 transition-all bg-teal-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
            <span className="relative z-10">Reset Password</span>
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-teal-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
          <span className="relative z-10">Back to Login</span>
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
