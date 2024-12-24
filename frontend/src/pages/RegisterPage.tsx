import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const db = getFirestore();

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const checkUsernameAvailability = async (username: string) => {
    try {
      const usernameDoc = await getDoc(
        doc(collection(db, "usernames"), username)
      );
      setIsUsernameAvailable(!usernameDoc.exists());
    } catch (err) {
      console.error("Error checking username:", err);
      setIsUsernameAvailable(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameAvailable) {
      setError("Username is already taken.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save the username to Firestore
      await setDoc(doc(collection(db, "usernames"), username), {
        uid: user.uid,
      });
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-300 via-blue-300 to-purple-400 pattern-dots-md bg-opacity-10">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Create Your Account
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsernameAvailability(e.target.value);
              }}
              className={`w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none ${
                isUsernameAvailable
                  ? "focus:ring-2 focus:ring-teal-400"
                  : "border-red-500 focus:ring-2 focus:ring-red-400"
              } transition`}
              placeholder="Enter username"
              required
            />
            {!isUsernameAvailable && (
              <p className="text-sm text-red-500 mt-2">
                This username is already taken.
              </p>
            )}
          </div>
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
              className="w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter your email"
              required
            />
          </div>
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
              className="w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter your password"
              required
            />
          </div>
          {/* Register Button */}
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            <span className="absolute left-0 block w-full h-0 transition-all bg-teal-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="relative z-10">Register</span>
          </button>
        </form>
        {/* Register with Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="text-white bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-full text-lg px-12 py-3 text-center inline-flex items-center justify-center w-full mt-4 border-2 border-teal-500"
        >
          <svg
            className="w-5 h-5 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              fillRule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              clipRule="evenodd"
            />
          </svg>
          Sign up with Google
        </button>
        {/* Back to Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-sm font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-teal-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-300 ease-in-out"></span>
          <span className="absolute right-0 flex items-center justify-center w-full h-full text-teal-50 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            Back to Login
          </span>
          <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
            Already have an account? Login here
          </span>
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;