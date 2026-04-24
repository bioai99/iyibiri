# UX Brief — Sistemik Loading / Empty / Error / Success State Library

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** ui-designer → design-system-keeper + frontend-engineer
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #4.A
**Priority:** P0 · **Effort:** XL (3-4 hafta sistemik, tüm sayfalara yayılmış)

## 1. Özet

Atlas Bölüm 10 + audit: **İyiBiri'de hiçbir sayfada `loading.tsx` yok. Empty state ad-hoc. Error state yok.** Bu sistemik boşluk ürün hissi için kritik — her sayfa "yükleniyor" ve "veri yok" durumlarını düzgün gösterebilmeli. Bu brief bir **State Library** (tekrar kullanılabilir komponent seti) + her sayfaya entegrasyon planı çerçeveler.

## 2. Hedef kullanıcı + JTBD

- **Her persona** — sayfa açılışı + veri durumları.
- **JTBD:** "Sayfa yükleniyor mu yoksa kırıldı mı bilmek istiyorum. Veri yoksa neden yok, ne yapabilirim anlamak istiyorum. Hata aldıysam ne hatası + nasıl düzelirim."

## 3. Mevcut durum

- `components/ui/skeleton.tsx` atom var ama kullanılmıyor.
- `components/ui/empty-state.tsx` atom var ama 1-2 sayfada kullanılmış.
- Error UI yok.
- Success state dağınık (mission complete'de celebration overlay var).

## 4. 4 State Paterni

### Loading (skeleton)
Sayfa data bekler. Skeleton varsayılan.
```
┌──────────────────────────────────────┐
│   [skeleton header]                  │
│   [skeleton card]                    │
│   [skeleton card]                    │
│   [skeleton card]                    │
└──────────────────────────────────────┘
```
- shimmer animation (gold accent soft)
- 200ms delay (flash-of-unstyled önler)
- aria-busy="true"

### Empty
Data yok, normal durum.
```
┌──────────────────────────────────────┐
│                                      │
│   [illustration SVG — 120px]         │
│                                      │
│   Henüz görev yok                    │
│   Keşfet sayfasında sana uygun        │
│   görevleri bul.                     │
│                                      │
│   [Keşfet →]                          │
└──────────────────────────────────────┘
```
- Cream bg (light) / ink-800 (dark)
- Gold accent illustration
- Primary CTA + opsiyonel secondary
- Türkçe "sen" dili

### Error
İstek hata aldı.
```
┌──────────────────────────────────────┐
│                                      │
│   ⚠️ (clay color)                    │
│                                      │
│   Bir şeyler ters gitti              │
│   Bağlantını kontrol et, yeniden     │
│   denemek ister misin?               │
│                                      │
│   [Yeniden dene]  [Destek yaz]       │
│                                      │
└──────────────────────────────────────┘
```
- Clay icon (atlas Bölüm 6)
- Primary "Yeniden dene"
- Secondary "Destek yaz" (destek action mevcut — `app/support-action.ts`)

### Success (opsiyonel)
Görev tamamlandı, ödeme başarı.
- Existing `celebration-overlay.tsx` genişletme.
- Karma bonus animasyon.
- Primary "Devam et" veya "Paylaş".

## 5. Library Yapısı

```
components/ui/state-library/
├── loading-skeleton.tsx     # Skeleton presets: card, list, hero, page
├── empty-state.tsx           # (mevcut, genişletilir)
├── error-state.tsx           # YENİ
├── success-state.tsx         # YENİ (opsiyonel, celebration-overlay entegre)
└── illustrations/            # SVG paketi
    ├── empty-missions.svg
    ├── empty-members.svg
    ├── empty-rewards.svg
    ├── empty-notifications.svg
    └── error-generic.svg
```

## 6. Her Sayfaya Entegrasyon

Her P0-P2 sayfa için 4 durum:

| Sayfa | Loading | Empty | Error | Success |
|---|---|---|---|---|
| `/dashboard` | SkeletonPage | — (auth redirect) | ErrorState | — |
| `/dashboard/missions` | SkeletonList × 5 | EmptyMissions | ErrorState | — |
| `/dashboard/missions/[id]` | SkeletonHero + body | — | ErrorState (mission not found) | CelebrationOverlay (complete) |
| `/dashboard/ngos` | SkeletonList | EmptyNGOs | ErrorState | — |
| `/dashboard/ngos/[id]` | SkeletonProfile | — | ErrorState (ngo not found) | — |
| `/dashboard/ngos/[id]/membership` | SkeletonForm | — | ErrorState (payment fail) | SuccessState (celebration) |
| `/dashboard/rewards` | SkeletonList | EmptyRewards | ErrorState | — |
| `/dashboard/notifications` | SkeletonList | EmptyNotifications | ErrorState | — |
| `/dashboard/saved` | SkeletonList | EmptySaved | ErrorState | — |
| `/dashboard/profile` | SkeletonProfile | — | ErrorState | — |
| `/admin/missions` | SkeletonList | EmptyAdminMissions | ErrorState | — |

## 7. Başarı kriterleri

- **Her sayfa 4 state'i destekler** — loading + empty + error + (opsiyonel) success.
- **Loading süresi algısı < 300 ms hissi** — skeleton delay + shimmer.
- **Error state'ten yeniden dene başarı oranı ≥ %60**.
- **Empty state'ten CTA'ya tıklama ≥ %30**.

## 8. Kısıtlar

- Dark mode.
- Mobile-first.
- Reduced-motion respect.
- Performance — skeleton CSS animation (JS değil).
- Illustration SVG — light + dark mode uygun renkler.

## 9. UI ipuçları

- **Skeleton:** 200ms delay önce, sonra shimmer (`background-size: 200% 100%` + animation).
- **Empty:** 120-160px illustration + heading + body + CTA — max 1 ekran.
- **Error:** clay icon 48px + heading + body + primary CTA + secondary "Destek" link.

## 10. Test

- **Network throttle test** — 3G slow, skeleton gösterimi.
- **DB empty test** — her sayfa empty state.
- **Error inject** — Supabase error, network 500, validation fail.

## 11. Bağımlılık

- `components/ui/skeleton.tsx` genişletme.
- `components/ui/empty-state.tsx` varyant sistemi (illustration prop).
- Yeni `error-state.tsx`.
- Illustration SVG tasarımı (ui-designer + freelance ikon tasarımcı?).

## 12. Handoff

- **ui-designer:** 4 state spec + illustration brief (1 hafta).
- **design-system-keeper:** library component yapısı + atom'lar (1 hafta).
- **frontend-engineer:** her sayfaya entegrasyon (2 hafta — tüm sayfalara yayılmış).

**Toplam:** 3-4 hafta, dağılmış paralel iş.
