import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { parseToken, clearToken } from "../api/client";
import "../styles/style.css";

function Sidebar() {
  const payload = parseToken();
  const isAdmin = payload?.role === "admin";
  const isLoggedIn = !!payload;
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <ul>
        {!isLoggedIn && (
          <li>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Вход
            </NavLink>
          </li>
        )}

        <li>
          <NavLink to="/intro" className={({ isActive }) => (isActive ? "active" : "")}>
            Введение
          </NavLink>
        </li>
        <li>
          <NavLink to="/process" className={({ isActive }) => (isActive ? "active" : "")}>
            Описание
          </NavLink>
        </li>
        <li>
          <NavLink to="/table" className={({ isActive }) => (isActive ? "active" : "")}>
            Таблица
          </NavLink>
        </li>
        <li>
          <NavLink to="/list" className={({ isActive }) => (isActive ? "active" : "")}>
            Список
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? "active" : "")}>
            Посты
          </NavLink>
        </li>
        <li>
          <NavLink to="/api" className={({ isActive }) => (isActive ? "active" : "")}>
            API
          </NavLink>
        </li>
        <li>
          <NavLink to="/conclusion" className={({ isActive }) => (isActive ? "active" : "")}>
            Заключение
          </NavLink>
        </li>
        <li>
          <NavLink to="/image" className={({ isActive }) => (isActive ? "active" : "")}>
            Инвертер
          </NavLink>
        </li>

        {isAdmin && (
          <li>
            <NavLink to="/stats" className={({ isActive }) => (isActive ? "active" : "")}>
              Статистика страниц
            </NavLink>
          </li>
        )}

        {isLoggedIn && (
          <li>
            <button type="button" onClick={handleLogout} className="logout-button">
              Выход
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
