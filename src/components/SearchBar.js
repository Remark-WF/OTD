// src/components/SearchBar.js
import React, { useState } from "react";
import "../styles/style.css";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Простое использование встроенного поиска браузера
    // Ищет следующее вхождение на странице
    const found = window.find
      ? window.find(q, false, false, true, false, false, false)
      : false;

    if (!found) {
      // Для простоты — маленькое уведомление
      // Можно заменить на собственный текст под строкой поиска
      alert("Ничего не найдено");
    }
  };

  return (
    <form className="page-search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Поиск по странице..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Найти</button>
    </form>
  );
}

export default SearchBar;
