// src/components/GlobalSearch.js
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

const PAGES_INDEX = [
  {
    key: "intro",
    route: "/intro",
    title: "Введение",
    text: "контроль качества маркировки цели системы преимущества внедрения",
  },
  {
    key: "main",
    route: "/process",
    title: "Основное описание",
    text: "процесс контроля сканирование верификация таблица преимуществ контакты",
  },
  {
    key: "posts",
    route: "/posts",
    title: "Посты",
    text: "пример работы с внешним API jsonplaceholder список постов",
  },
  {
    key: "api",
    route: "/api",
    title: "API документация",
    text: "swagger openapi эндпоинты авторизация токен статистика",
  },
  {
    key: "image",
    route: "/image",
    title: "Инвертер изображения",
    text: "загрузка картинок инвертирование обработка изображения",
  },
  {
    key: "stats",
    route: "/stats",
    title: "Статистика страниц",
    text: "kpi количество посещений время на странице только для администратора",
  },
  {
    key: "conclusion",
    route: "/conclusion",
    title: "Заключение",
    text: "итоги выводы результат работы системы контроль качества",
  },
];

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PAGES_INDEX.filter((p) =>
      (p.title + " " + p.text).toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const goTo = (route) => {
    const q = query.trim();
    navigate(route, {
      state: q ? { highlight: q } : undefined,  // ← сюда кладём слово
    });
    setOpened(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      goTo(results[0].route);
    }
  };

  const handleClickResult = (route) => {
    goTo(route);
  };

  return (
    <div className="global-search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Поиск по сайту..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpened(true);
          }}
          onFocus={() => query && setOpened(true)}
        />
        <button type="submit">OK</button>
      </form>

      {opened && results.length > 0 && (
        <div className="global-search-results">
          {results.map((r) => (
            <div
              key={r.route}
              className="global-search-item"
              onClick={() => handleClickResult(r.route)}
            >
              <div className="global-search-title">{r.title}</div>
              <div className="global-search-snippet">{r.text}</div>
            </div>
          ))}
        </div>
      )}

      {opened && query.trim() && results.length === 0 && (
        <div className="global-search-results">
          <div className="global-search-empty">Ничего не найдено</div>
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;
