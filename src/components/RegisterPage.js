// src/components/RegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser } from "../api/client";
import "../styles/style.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== repeat) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      // создаём пользователя с ролью user
      await registerUser(email, password);
      // можно сразу залогинить
      await loginUser(email, password);
      navigate("/intro", { replace: true });
    } catch (e) {
      setError(e.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <h1>Регистрация</h1>
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
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Повторите пароль
          <input
            type="password"
            value={repeat}
            autoComplete="new-password"
            onChange={(e) => setRepeat(e.target.value)}
            required
          />
        </label>

        {error && <div className="error-text">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
