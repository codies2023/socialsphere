import React from "react";
import { useAuth } from "../context/AuthContext";

export default function LoadingButton({ children, className = "", ...props }) {
  const { loading } = useAuth();

  return (
    <button
      {...props}
      disabled={loading}
      className={`bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold rounded-md p-3 shadow-lg hover:brightness-110 transition ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
