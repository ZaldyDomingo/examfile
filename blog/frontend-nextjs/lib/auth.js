"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    if (token && userEmail) {
      // Set complete user object with all required properties
      setUser({
        email: userEmail,
        name: userEmail.split("@")[0], // Fallback name from email
        role: "Author", // Default role
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.login({ email, password });
      apiService.setToken(response.accessToken);

      // Set complete user object after login
      const userData = {
        email: email,
        name: response.user?.name || email.split("@")[0], // Use backend response or fallback
        role: response.user?.role || "Author",
      };

      localStorage.setItem("userEmail", email);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      apiService.setToken(response.accessToken);

      // Set complete user object after registration
      const newUser = {
        email: userData.email,
        name:
          response.user?.name || userData.name || userData.email.split("@")[0],
        role: response.user?.role || "Author",
      };

      localStorage.setItem("userEmail", userData.email);
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.removeToken();
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
