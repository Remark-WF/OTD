// src/components/PostsPanel.js
import React, { useEffect, useState, useMemo } from "react";
import { getPosts } from "../api/client";
import usePageTracking from "../hooks/usePageTracking";
import SearchBar from "./SearchBar"; 
import useRouteHighlight from "../hooks/useRouteHighlight";

function PostsPanel() {
  usePageTracking("posts");
  useRouteHighlight();
  
  const [articles, setArticles] = useState([]);
  const [limit, setLimit] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    getPosts()
      .then(setArticles)
      .catch((e) => setError(e.message || "Ошибка загрузки статей"));
  }, []);

  const visibleArticles = useMemo(
    () => articles.slice(0, limit),
    [articles, limit]
  );

  return (
    <div className="content">
      <SearchBar />
      <h2>Статьи по теме компьютерного зрения и упаковки</h2>

      {/* если хочешь, можно добавить и общий SearchBar */}
      {/* <SearchBar /> */}

      <p>
        Ниже — подборка внешних материалов (кейсы и статьи). Клик по заголовку
        откроет оригинал в новой вкладке.
      </p>

      <label>
        Количество статей: {limit}
        <input
          type="range"
          min="1"
          max={articles.length || 5}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{ marginLeft: "8px" }}
        />
      </label>

      {error && <p className="error">Ошибка: {error}</p>}

      <ul>
        {visibleArticles.map((a) => (
          <li key={a.id} className="post-item">
            <h3>
              <a href={a.url} target="_blank" rel="noreferrer">
                {a.title}
              </a>
            </h3>
            {a.source && (
              <p className="article-source">
                Источник: <strong>{a.source}</strong>
              </p>
            )}
            {a.description && <p>{a.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPanel;
