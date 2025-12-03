import React, { useEffect, useState, useMemo } from "react";
import { getPosts } from "../api/client";
import { usePageTracking } from "../hooks/usePageTracking";

function PostsPanel() {

  usePageTracking(4);

  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [error, setError] = useState("");

  // Загружаем все посты один раз при монтировании
  useEffect(() => {
    getPosts()                      // ← Вариант А: один раз все посты
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

  // Мемоизация среза (оптимизация для демонстрации useMemo)
  const visiblePosts = useMemo(() => posts.slice(0, limit), [posts, limit]);

  return (
    <div className="posts-panel">
      <h2>Посты</h2>

      <label>
        Количество постов: {limit}
        <input
          type="range"
          min="1"
          max="20"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>

      {error && <p className="error">Ошибка: {error}</p>}

      <ul>
        {visiblePosts.map((p) => (
          <li key={p.id} className="post-item">
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsPanel;
