import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) navigate("/");
  };

  const handleSignup = async (name, email, password) => {
    const success = await signup(name, email, password);
    if (success) navigate("/");
  };

  return (
    <AuthLayout>
      <div className="mb-6 text-center text-white font-bold text-3xl">SocialSphere</div>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "login"
              ? "bg-white text-pink-600 shadow-lg"
              : "text-white hover:underline"
          }`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            mode === "signup"
              ? "bg-white text-pink-600 shadow-lg"
              : "text-white hover:underline"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <SignupForm onSignup={handleSignup} />
      )}
    </AuthLayout>
  );
}
