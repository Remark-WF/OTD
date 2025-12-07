// src/hooks/usePageTracking.js
import { useEffect, useRef } from "react";
import { sendTimeSpent, getToken } from "../api/client";

// ЕДИНАЯ карта, которую ты синхронизируешь с таблицей pages
const PAGE_IDS = {
  intro:       1,
  conclusion:  2,
  main:        3,  // твой MainPanel (process/table/list)
  posts:       4,
  api:         5,
  image:       6,  // тут ставишь фактический id из SELECT id,name
  // stats:    7,  если захочешь отдельный id
};

export default function usePageTracking(pageKey) {
  const startRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    const pageId = PAGE_IDS[pageKey];

    console.log("[TRACKING INIT]", { pageKey, pageId, token });

    if (!token || !pageId) return;

    startRef.current = Date.now();

    return () => {
      const tokenAgain = getToken();
      if (!tokenAgain || !startRef.current) return;

      const seconds = Math.floor((Date.now() - startRef.current) / 1000);
      console.log("[TRACKING DONE]", { pageKey, pageId, seconds });

      if (seconds > 0) {
        sendTimeSpent(pageId, seconds).catch((err) =>
          console.error("Ошибка KPI:", err)
        );
      }
    };
  }, [pageKey]);
}