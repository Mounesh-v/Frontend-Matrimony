import { useState, useEffect } from "react";

export default function useAuth() {
  const getToken = () => {
    return localStorage.getItem("adminToken") || "";
  };

  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save Admin Token ONLY
  const saveToken = (token) => {
    localStorage.setItem("adminToken", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  return { token, saveToken, logout };
}
