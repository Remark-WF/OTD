// src/components/RequireAuth.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { parseToken, clearToken } from "../api/client";

function RequireAuth({ children, role }) {
  const location = useLocation();
  const payload = parseToken();

  // нет токена
  if (!payload) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // токен протух
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearToken();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // проверка роли (для админских маршрутов)
  if (role && payload.role !== role) {
    return <Navigate to="/intro" replace />;
  }

  return children;
}

export default RequireAuth;
