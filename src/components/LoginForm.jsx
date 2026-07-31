import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "./LoadingButton";
import { validateEmail, validatePassword } from "../utils/validators";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!validateEmail(email)) errs.email = "Invalid email address";
    if (!validatePassword(password)) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="block mb-2 font-semibold text-white">Email</label>
      <input
        type="email"
        className={`w-full p-3 rounded-md mb-3 focus:outline-none ${errors.email ? "border-2 border-red-500" : "border border-transparent"}`}
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}

      <label className="block mb-2 font-semibold text-white">Password</label>
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <LoadingButton type="submit" className="mt-6 w-full" >Login</LoadingButton>
    </form>
  );
}
