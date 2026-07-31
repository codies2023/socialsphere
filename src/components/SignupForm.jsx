import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "./LoadingButton";
import { validateEmail, validatePassword, validateName } from "../utils/validators";

export default function SignupForm({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!validateName(name)) errs.name = "Name must be at least 2 characters";
    if (!validateEmail(email)) errs.email = "Invalid email address";
    if (!validatePassword(password)) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSignup(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="block mb-2 font-semibold text-white">Name</label>
      <input
        type="text"
        className={`w-full p-3 rounded-md mb-3 focus:outline-none ${errors.name ? "border-2 border-red-500" : "border border-transparent"}`}
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
      />
      {errors.name && <p className="text-red-500 mb-2">{errors.name}</p>}

      <label className="block mb-2 font-semibold text-white">Email</label>
      <input
        type="email"
        className={`w-full p-3 rounded-md mb-3 focus:outline-none ${errors.email ? "border-2 border-red-500" : "border border-transparent"}`}
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      {errors.email && <p className="text-red-500 mb-2">{errors.email}</p>}

      <label className="block mb-2 font-semibold text-white">Password</label>
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <LoadingButton type="submit" className="mt-6 w-full">Sign Up</LoadingButton>
    </form>
  );
}
