// src/components/StatsPage.js
import React, { useEffect, useState } from "react";
import { getKpi } from "../api/client";
import usePageTracking from "../hooks/usePageTracking";
import useRouteHighlight from "../hooks/useRouteHighlight";
import SearchBar from "./SearchBar";
import "../styles/style.css";

function StatsPage() {
  usePageTracking("stats");
  useRouteHighlight();

  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getKpi()
      .then(setRows)
      .catch((e) => setError(e.message || "Ошибка загрузки KPI"));
  }, []);

  return (
    <main className="content">
      <SearchBar />

      <div className="stats-card">
        <h2 className="hover-head">Статистика посещений страниц</h2>

        {error && <p className="error-text">Ошибка: {error}</p>}

        {rows.length === 0 ? (
          <p>Пока нет данных по KPI.</p>
        ) : (
          <table className="stats-table">
            <thead>
              <tr>
                <th>ID страницы</th>
                <th>Страница</th>
                <th>Посещений</th>
                <th>Общее время (сек)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.page_id}>
                  <td>{r.page_id}</td>
                  <td>{r.page_name}</td>
                  <td>{r.visits}</td>
                  <td>{Math.round(r.total_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default StatsPage;
