// components/mission-card.tsx
//
// ⚠️ DEPRECATED — 2026-04-24
// Bu dosya eskimiş. Gerçek MissionCard component'i:
//   @/components/ui/mission-card
//
// Atlas Bölüm 7 kanonik kararı (D4 reconciliation):
//   components/ui/mission-card.tsx = TEK DOĞRU kaynak
//   components/mission-card.tsx    = DEPRECATED shim (re-export)
//
// Neden bu dosya hâlâ var?
//   Projedeki eski doküman referansları (docs/superpowers/plans/*)
//   geriye dönük import riskini önlemek için bir shim bıraktık.
//   Yeni kod bu dosyayı referans almaz.
//
// Atlas: docs/project-atlas.md Bölüm 7 + Bölüm 10.
// design-system-keeper: gelecekte tamamen kaldırılabilir.

export { MissionCard, MissionCard as default } from '@/components/ui/mission-card'
