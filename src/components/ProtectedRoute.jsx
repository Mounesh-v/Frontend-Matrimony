import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userData = localStorage.getItem("userData");
  const adminToken = localStorage.getItem("adminToken");

  if (!token || !userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
