// src/components/RequireAuth.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, parseToken } from "../api/client";

export default function RequireAuth({ children, role }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    // нет токена -> на /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role) {
    const payload = parseToken();
    if (!payload || payload.role !== role) {
      // роль не подходит -> можно отправить на главную
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
