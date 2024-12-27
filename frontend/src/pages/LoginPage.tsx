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

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("No Firestore record found for this user.");
      }

      const userData = userDoc.data();
      console.log("User data fetched:", userData);

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
              className="w-full px-6 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
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
              className="w-full px-6 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-16 py-4 overflow-hidden text-lg font-medium text-sky-600 bg-gray-50 border-2 border-sky-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            <span className="absolute left-0 block w-full h-0 transition-all bg-sky-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
            <span className="relative z-10">Login</span>
          </button>
        </form>
        {/* Login with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="relative inline-flex items-center justify-center px-16 py-4 overflow-hidden text-lg font-medium text-white bg-sky-500 border-2 border-sky-500 rounded-full w-full mt-4 group"
        >
          <img
            src="/images/google-white-icon.png"
            alt="Google Logo"
            className="w-6 h-6 relative z-10 group-hover:hidden"
          />
          <img
            src="/images/google-blue-icon.png"
            alt="Google Logo Hover"
            className="w-6 h-6 relative z-10 hidden group-hover:block"
          />
          <span className="relative z-10 ml-2 group-hover:text-sky-500 transition-opacity duration-300">
            Sign in with Google
          </span>
          <span className="absolute left-0 block w-full h-full bg-white top-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out z-0"></span>
        </button>
        {/* Register Button */}
        <button
          onClick={() => navigate("/register")}
          className="relative inline-flex items-center justify-center px-16 py-4 overflow-hidden text-lg font-medium text-sky-600 bg-gray-50 border-2 border-sky-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-sky-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
          <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300 text-lg">
            Don't have an account?
            <br />
            Register here
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Register
          </span>
        </button>
        {/* Forgot Password Button */}
        <div className="text-center mt-2">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-sky-600 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
