import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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
    if (!username.trim()) {
      setIsUsernameAvailable(true);
      return;
    }
    try {
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      setIsUsernameAvailable(!usernameDoc.exists());
    } catch {
      setIsUsernameAvailable(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUsernameAvailable) {
      setError("This username is already taken.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "usernames", username), { uid: user.uid, email });
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError("Registration failed: " + err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const usernameDoc = await getDoc(
        doc(db, "usernames", user.displayName || "")
      );
      if (!usernameDoc.exists()) {
        await setDoc(doc(db, "usernames", user.displayName || ""), {
          uid: user.uid,
          email: user.email,
        });
      }

      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
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
              placeholder="Enter a username"
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
          <button
            type="submit"
            className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-lg font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full"
          >
            Register
          </button>
        </form>
        <button
          onClick={handleGoogleSignIn}
          className="text-white bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-full text-lg px-12 py-3 text-center inline-flex items-center justify-center w-full mt-4 border-2 border-teal-500"
        >
          Sign up with Google
        </button>
        <button
          onClick={() => navigate("/login")}
          className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden text-sm font-medium text-teal-600 bg-gray-50 border-2 border-teal-500 rounded-full hover:text-white group hover:bg-gray-50 w-full mt-4"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
