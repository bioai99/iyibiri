import { NextResponse } from "next/server";

/**
 * Web Vitals RUM endpoint
 *
 * Faz 7 — performance-engineer (2026-05-02)
 *
 * `app/web-vitals.tsx` `navigator.sendBeacon` ile metric göndermek için
 * bu endpoint'i kullanıyor. Şu an sadece Vercel function log'larına yazıyor;
 * ileride Supabase `web_vitals` tablosuna persist edilecek (TD-042-followup).
 *
 * NOT: Bu endpoint guest-friendly (auth gerek yok) — RUM datası anonim.
 * IP / user-agent header'ları toplanmıyor (KVKK).
 */

type WebVitalPayload = {
  name: string;
  value: number;
  rating?: "good" | "needs-improvement" | "poor";
  delta?: number;
  id?: string;
  navigationType?: string;
  path?: string;
  timestamp?: number;
};

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WebVitalPayload;

    // Şimdilik Vercel function log'u — ileride DB'ye persist edilecek.
    // Edge runtime: console.log Vercel'da function log'larında görünür.
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        type: "web-vital",
        name: payload.name,
        value: Math.round(payload.value),
        rating: payload.rating ?? null,
        path: payload.path ?? null,
        ts: payload.timestamp ?? Date.now(),
      })
    );

    return new NextResponse(null, { status: 204 });
  } catch {
    // Sessiz fail — RUM endpoint hatası UX'i etkilemesin.
    return new NextResponse(null, { status: 204 });
  }
}
