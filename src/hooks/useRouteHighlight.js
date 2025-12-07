// src/hooks/useRouteHighlight.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useRouteHighlight() {
  const location = useLocation();

  useEffect(() => {
    const q = location.state?.highlight;
    if (!q || typeof window === "undefined" || typeof window.find !== "function") {
      return;
    }

    // Небольшая задержка, чтобы страница успела отрендериться
    const timer = setTimeout(() => {
      // Пытаемся найти первое вхождение
      window.find(q, false, false, true, false, false, false);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.state?.highlight]);
}
