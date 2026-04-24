// DEPRECATED — 2026-04-24
//
// Bu dosya light tema (ADR-004 öncesi) verification UI içeriyordu.
// UX audit K2 (2026-04-24) "tier-1 hissini öldüren tek kritik bug" olarak flag etti.
//
// Yerine kullanılacak:
//   → app/dashboard/missions/[id]/complete/complete-client.tsx  (dark tema)
//   → components/mission/verification-panel.tsx                (4 variant)
//   → components/mission/verification-code-input.tsx           (TR-safe)
//
// Hiçbir yerde import edilmiyor, sadece dosya silinemediği için buraya shim kaldı.
// İlerki bir turda dosya repo temizliği sırasında silinecek.

export {}
