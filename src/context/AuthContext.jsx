import React, { createContext, useState, useEffect, useContext } from "react";
import * as api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      const userData = { ...response.user, token: response.token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully");
      setLoading(false);
      return true;
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.signup(name, email, password);
      const userData = { ...response.user, token: response.token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Signed up successfully");
      setLoading(false);
      return true;
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
