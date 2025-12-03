import React, { useEffect, useState } from "react";
import { getKpi } from "../api/client";

function formatTime(seconds) {
  // Красивое форматирование
  if (seconds < 60) return `${seconds.toFixed(1)} сек`;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m} мин ${s} сек`;
}

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getKpi();
        setStats(data);
      } catch (e) {
        console.error("Ошибка загрузки KPI", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Загрузка статистики...</div>;

  return (
    <div className="content">
      <h1>Статистика посещений</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Страница</th>
            <th>Посещения</th>
            <th>Общее время</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr key={s.page_id}>
              <td>{s.page_name}</td>
              <td>{s.visits}</td>
              <td>{formatTime(s.total_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}