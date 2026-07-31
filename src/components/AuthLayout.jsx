import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
