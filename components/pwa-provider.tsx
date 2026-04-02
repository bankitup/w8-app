"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export function PWAProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silent fallback: the app still works without offline caching.
      });
    }
  }, []);

  return children;
}
