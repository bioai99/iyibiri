# İyiBiri — App UI Kit

Dashboard / PWA arayüzünün yüksek-fidelity, tıklanabilir recreation'ı. Next.js codebase'inden (`iyibiri/app/dashboard/*` + `iyibiri/components/**`) alındı, sade JSX'e dönüştürüldü.

## Dosyalar

- `index.html` — Canlı click-thru prototip. iPhone frame içinde 5-sekmeli app.
- `tokens.js` — Domain renkleri, tier tablosu, difficulty sözlükleri ve mock data (`IYI_DATA`: profil, STK'lar, görevler, ödüller).
- `Components.jsx` — Atomik/düşük seviye: `Icon`, `StatusBar`, `BottomNav`, `Header`, `HeroCard`, `MissionCard`, `RewardCard`, `NGOCard`, `SectionHeader`.
- `Screens.jsx` — Tam ekranlar: `HomeScreen`, `MissionsScreen`, `MissionDetailScreen`, `NGOsScreen`, `RewardsScreen`, `ProfileScreen`.

## Interaksiyon akışı

1. **Ana Sayfa** — amber gradient hero (Karma + seviye progress + streak), öne çıkan görev kartları, STK rail'i, ödül teaser.
2. **Görevler** — domain filter chip'leri (Tümü / Doğa / Eğitim / Sosyal / Finansal / Hayvanlar / Kültür), full mission card listesi.
3. **Mission Detay** — domain gradient hero + STK pill, etki ifadesi kartı, adım listesi, alt sticky CTA ("Göreve Başla" → "Tamamladım").
4. **Kuruluşlar** — 2 kolonlu STK grid'i.
5. **Ödüller** — kullanılabilir Karma banner'ı + kupon kartları (sol gradient şerit + dashed divider + Kullan CTA).
6. **Profil** — avatar + seviye rozeti + 3 stat + tamamlanan görevler.

## State

Root `App` component'ta:
- `profile` — Karma, streak, completed; ödül claim'de düşer, görev tamamlayınca artar.
- `takenIds`, `completedIds` — Set'ler, mission card durumlarını sürer.
- `detail` — açık mission detay.
- `toast` — etkileşim geri bildirimi (altın Karma kazancı, yeşil ödül, mavi görev alındı).

## Tasarım referansları

- Hero amber glow: `0 8px 32px rgba(251,146,60,0.35)` — birebir codebase'den.
- Mission card: domain gradient band (üstte STK logo + Karma sparkle pill) + beyaz body (başlık + duration + difficulty chip + chevron). `iyibiri/components/ui/mission-card.tsx`'ten.
- Reward card: sol dikey gradient şerit + dashed middle divider + Kullan CTA.
- Bottom nav: amber active pill background (`rgba(244,185,66,.18)`) + `#C18613` aktif renk.

## Bilinen kısıtlar

- Lottie maskotlar yerine emoji avatar (🦊) — yer kapladığı için codebase'den kopyalanmadı.
- Lucide ikonları: inline SVG recreation (stroke 2). Üretim kullanımında `lucide-react` yükle.
- Unsplash kapak fotoğrafları gösterilmedi; NGO ve mission kartları solid gradient bant kullanıyor (codebase de domain gradient'lerini ana yol olarak kullanıyor).
