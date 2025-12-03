// src/components/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser(email, password);
      // после регистрации отправляем на страницу входа
      navigate("/login");
    } catch (err) {
      setError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:&nbsp;</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Пароль:&nbsp;</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p style={{ color: "red", marginTop: 8 }}>
            {error}
          </p>
        )}
        <button type="submit" style={{ marginTop: 12 }}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
