import React, { createContext, useState, useEffect } from "react";
import { api } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("accessToken")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      const { data } = await api.post("/auth/verify-email", { email, code });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
