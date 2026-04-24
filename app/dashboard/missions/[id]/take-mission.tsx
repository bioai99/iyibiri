// DEPRECATED — 2026-04-24
//
// Bu dosya eski tasarımdan artefakt: mission alma işlemini localStorage'da
// tutuyordu (Supabase öncesi). Artık `lib/missions/actions.ts#takeMission`
// server action kullanılıyor, state `user_missions` tablosunda.
//
// UX audit (2026-04-24) P0 #3 audit — "dead code" olarak flag etti.
// Hiçbir yerde import edilmiyor, dosya silinemediği için shim.

export {}
