import { useEffect, useRef } from "react";
import { sendTimeSpent } from "../api/client";

export function usePageTracking(pageId) {
  const startRef = useRef(null);

  useEffect(() => {
    // компонент смонтировался — запоминаем время старта
    startRef.current = performance.now();

    // функция очистки: вызывается при размонтировании компонента (уход со страницы)
    return () => {
      const end = performance.now();
      const seconds = (end - startRef.current) / 1000;

      if (seconds < 0.1) return; // чтобы не слать совсем микроскопическое время

      sendTimeSpent(pageId, seconds).catch((err) => {
        console.error("Ошибка отправки времени:", err);
      });
    };
  }, [pageId]); 
}