import React, { useState } from "react";

export default function PasswordInput({ value, onChange, error }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mb-3">
      <input
        type={visible ? "text" : "password"}
        className={`w-full p-3 rounded-md focus:outline-none ${error ? "border-2 border-red-500" : "border border-transparent"}`}
        value={value}
        onChange={onChange}
        placeholder="••••••••"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-3 top-3 text-white select-none"
        tabIndex={-1}
      >
        {visible ? "Hide" : "Show"}
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
