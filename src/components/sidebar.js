// src/components/sidebar.js
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { parseToken, clearToken } from "../api/client";
import GlobalSearch from "./GlobalSearch";      // ← ДОБАВИЛИ
import "../styles/style.css";

function Sidebar() {
  const payload = parseToken();
  const isAuth = !!payload;
  const isAdmin = payload?.role === "admin";
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      {/* 🔍 Глобальный поиск вверху сайдбара */}
      <GlobalSearch />

      <ul>
        {/* Информационные страницы */}
        <li>
          <NavLink to="/intro" className={linkClass}>
            Введение
          </NavLink>
        </li>
        <li>
          <NavLink to="/process" className={linkClass}>
            Описание
          </NavLink>
        </li>
        <li>
          <NavLink to="/table" className={linkClass}>
            Таблица
          </NavLink>
        </li>
        <li>
          <NavLink to="/list" className={linkClass}>
            Список
          </NavLink>
        </li>
        <li>
          <NavLink to="/conclusion" className={linkClass}>
            Заключение
          </NavLink>
        </li>

        {/* Функциональные страницы (RequireAuth на маршрутах) */}
        <li>
          <NavLink to="/posts" className={linkClass}>
            Статьи
          </NavLink>
        </li>
        <li>
          <NavLink to="/image" className={linkClass}>
            Инвертер
          </NavLink>
        </li>
        <li>
          <NavLink to="/api" className={linkClass}>
            API
          </NavLink>
        </li>

        {/* Статистика только для admin */}
        {isAdmin && (
          <li>
            <NavLink to="/stats" className={linkClass}>
              Статистика страниц
            </NavLink>
          </li>
        )}

        {/* Блок аутентификации */}
        {isAuth ? (
          <li className="sidebar-auth-block">
            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-logout-btn"
            >
              Выйти ({payload.email})
            </button>
          </li>
        ) : (
          <>
            <li className="sidebar-auth-block">
              <NavLink to="/login" className={linkClass}>
                Вход
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={linkClass}>
                Регистрация
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
