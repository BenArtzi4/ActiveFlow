import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { setLogLevel } from "firebase/app";

setLogLevel("debug");

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("No Firestore record found for this user.");
      }

      const userData = userDoc.data();
      console.log("User data fetched:", userData);

      // Store user information in local storage
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("username", userData?.username || "");

      navigate("/");
    } catch (err: unknown) {
      console.error("Error during login:", err);

      if (err instanceof Error) {
        const firebaseError = err as { code?: string };

        if (firebaseError.code === "auth/user-not-found") {
          setError("No account found with this email.");
        } else if (firebaseError.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (err.message === "No Firestore record found for this user.") {
          setError("Account setup incomplete. Please register again.");
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          username: user.displayName || "",
        });
      }

      localStorage.setItem("userId", user.uid);
      localStorage.setItem("username", user.displayName || "");

      navigate("/");
    } catch (err: unknown) {
      console.error("Error during Google sign-in:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter your email"
              required
            />
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-sky-600 bg-gray-50 border-2 border-sky-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            Login
          </button>
        </form>
        {/* Google Sign-in */}
        <button
          onClick={handleGoogleSignIn}
          className="text-white bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-full text-lg px-12 py-3 text-center inline-flex items-center justify-center w-full mt-4 border-2 border-sky-500"
        >
          Sign in with Google
        </button>
        {/* Register Redirect */}
        <button
          onClick={() => navigate("/register")}
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-sm font-medium text-sky-600 bg-gray-50 border-2 border-sky-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          Don't have an account? Register here
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
