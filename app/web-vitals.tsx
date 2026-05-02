"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals RUM (Real User Monitoring)
 *
 * Faz 7 — performance-engineer (2026-05-02)
 *
 * Her gerçek kullanıcı sayfa yüklemesinde Core Web Vitals (LCP, FID/INP, CLS,
 * FCP, TTFB) topluyor ve `/api/vitals` endpoint'ine `navigator.sendBeacon`
 * üzerinden gönderiyor. Sayfa unload'unu blok etmediği için kullanıcı
 * deneyimine sıfır etki.
 *
 * - Dev'de konsola log (debug için)
 * - Prod'da beacon ile API'ye POST (background)
 *
 * API endpoint şimdilik sadece console.log yapıyor; ileride bir Supabase
 * tablosuna yazılabilir veya Vercel Analytics'e bağlanabilir.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[web-vitals]", metric.name, Math.round(metric.value), metric);
    }

    if (process.env.NODE_ENV !== "production") return;

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      path: window.location.pathname,
      timestamp: Date.now(),
    });

    const url = "/api/vitals";

    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      // Fallback: keepalive fetch — sayfa unload sırasında bile arka planda biter
      fetch(url, { body, method: "POST", keepalive: true }).catch(() => {
        // sessizce bırak — RUM endpoint hatası UX'i etkilemesin
      });
    }
  });

  return null;
}
