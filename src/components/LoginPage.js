// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser, parseToken } from "../api/client";
import "../styles/style.css";

function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // если уже залогинен – просто отправим на /intro
  const already = parseToken();
  if (already) {
    navigate("/intro", { replace: true });
  }

  const from = location.state?.from?.pathname || "/intro";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="error-text">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </main>
  );
}

export default LoginPage;
