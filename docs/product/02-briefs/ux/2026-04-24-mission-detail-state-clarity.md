# UX Brief — Mission Detail State Machine Clarity

**Tarih:** 2026-04-24
**Sahip (brief):** product-analyst
**Sonraki sahip:** ux-researcher → ui-designer → frontend-engineer
**Master plan:** `docs/product/01-workstreams/2026-04-24-v1-improvement-master-plan.md` #15
**Priority:** P0 · **Effort:** L (2 hafta)
**Bağlı ADR:** ADR-007 (Karma formülü), ADR-004 (dark-only)

## 1. Özet (1 paragraf)

`/dashboard/missions/[id]` sayfasında **mission state machine 4 durum** var (pre-apply / applied / check-in / completed) — `take-mission.tsx` + `mission-detail-client.tsx` + `states-client.tsx` dosyalarında render ediliyor. Durumlar kodda net ama **UI geçişleri kullanıcı için şeffaf değil** — kullanıcı hangi durumda olduğunu, ne yapması gerektiğini, Karma formülünü anlamlı şekilde görmüyor. Bu brief state machine'i kullanıcı için **tek bakışta anlaşılır** hale getirmeyi çerçeveler.

## 2. Hedef kullanıcı + JTBD

- **Persona:** P1 + P2 — görev deneyimi ilk aşamasında.
- **JTBD:** "Bu göreve katılmalı mıyım (kaç Karma, ne kadar zaman, ne yapacağım)? Katıldım, ne bekleniyor? Tamamladım mı doğrulama nasıl?"

## 3. Mevcut durum

**Kod:** 4 state tek component'te (`take-mission.tsx`) render — state prop'a göre farklı UI. Pattern iyi; **UX'te durum değişimi zayıf gösterilmiş.**

**Eksikler:**
- Karma formülü görünmez (ADR-007 Base × Skill × Impact).
- Impact statement mission card'ta sadece küçük var, detayda vurgulu değil.
- State geçişi animasyonu yok (Framer Motion uygulanabilir).
- Check-in durumu kullanıcı için belirsiz — "Ne yapmalıyım şimdi?" sorusu net değil.
- Completed durumunda Karma geçmişi + paylaşım CTA yok.

## 4. Önerilen akış (delta)

### State 1: Pre-apply (henüz katılmadım)
```
┌──────────────────────────────────────┐
│ ← Geri   Sahil Temizliği Gönüllüsü ⋯ │
├──────────────────────────────────────┤
│                                      │
│   [foto full-bleed + gradient]       │
│                                      │
│   +200 Karma                         │
│   [TEMA logo] TEMA Vakfı             │
│                                      │
│   [4 chip]                           │
│   🏞 Doğa · 🏃 Saha · ⏱ 3 saat · 🟢 Kolay │
│                                      │
│   Impact statement                    │
│   "Bu görevle bir kıyı şeridi        │
│    temizlenir; deniz canlıları nefes │
│    alır."                            │
│                                      │
│   Tarih: 15 Mayıs, 10:00             │
│   Lokasyon: Kilyos Sahili            │
│   Kalan kontenjan: 12/20             │
│                                      │
│   [Başvur — 200 Karma hediye]        │
└──────────────────────────────────────┘
```

### State 2: Applied (başvurdum, henüz tarih gelmedi)
- Hero: "Başvurdun ✓" + tarih geri sayım ("12 gün")
- CTA: "Takvime ekle" + "İptal et" (destructive secondary)
- Alt: "Hazırlık" kartı (getirilmesi gerekenler, dress code)

### State 3: Check-in (etkinlik günü, yer geldi)
- Hero: "Hoş geldin! 👋" + QR okuyucu butonu
- CTA: "QR tara" veya "Kod gir" (ADR-008 verify_method)
- Alt: "Etkinlik devam ediyor" kart
- Motion: subtle pulse / breathing effect (etkinlik anı vurgusu)

### State 4: Completed
- Hero: KarmaCounter animasyon 0 → 200 + impact statement büyük
- Celebration overlay (confetti, 3 saniye)
- CTA: "Paylaş" (Instagram story + WhatsApp template) + "Yeni görev keşfet"
- Alt: "Seri +1 gün 🔥" + seviye ilerleme

### Karma formülü görünür

Her state'te "+200 Karma" yanında küçük info icon. Tıklanınca modal:

```
Karma hesaplaması
─────────────────
Süre tabanı (half_day) .... 200
× Beceri (no_skill)  ...... 1.0
× Etki (genel)  ........... 1.0
─────────────────
= 200 Karma

Karma sistemi hakkında →
```

Transparency kullanıcının Karma değerine güvenini artırır.

## 5. Cognitive load

**Azalan:**
- State transition'ı net renk + icon + mesajla.
- Karma formülü tek modal ile şeffaf.

## 6. Başarı kriterleri

- **State transition confusion %0** — kullanıcı "Ne yapmam gerek?" sorusuna cevap bulur.
- **Karma formülü modal açılma %30-50** (güven göstergesi — açılıyor ama zorla değil).
- **Completed state'inde paylaşım oranı %25+**.
- **Mission iptal oranı < %10** (applied state).

## 7. Kısıtlar

- Atlas Bölüm 8: mobile safe area + QR camera (html5-qrcode kullanılıyor, permission handling).
- Dark mode.
- Framer Motion + reduced-motion fallback.
- Impact statement copy zaten DB'de (`missions.impact_statement`).

## 8. UI ipuçları

- Hero full-bleed foto + gradient overlay (atlas Bölüm 6).
- State transition: Framer Motion `layoutId` shared (cross-state continuity).
- KarmaCounter animate (atlas örnek).
- QR scanner fullscreen modal.

## 9. Test önerileri

- **1. tıklama testi** her state için.
- **Usability test** — QR scan ile completed geçiş akışı.
- **Edge case:**
  - Kontenjan dolmuş mission başvuru denemesi.
  - Offline QR scan.
  - Tarih geçmiş applied mission.

## 10. Açık sorular

- "İptal et" butonu bir etkinliğe 24 saat kala görünsün mü (STK operasyonu bozulmaz)?
- Paylaşım kartı ayrı workstream (P2) — V1'de basit OS share kullanılsın mı?
- Karma formülü modal kullanıcı için çok teknik mi? Basit + detaylı iki level tooltip?

## 11. Bağımlılık

- `components/ui/mission-card.tsx` canonical (master plan #3.A).
- `components/ui/karma-counter.tsx` formülü tooltip genişletme.
- `components/ui/celebration-overlay.tsx` impact parametresi.
- `009_parametric_ngo_fee.sql` + `010_payment_routing.sql` apply edilmiş.

## 12. Handoff

- **UX researcher:** 4-state journey map + heuristik audit + Karma formülü modal test (1 hafta).
- **UI designer:** her state için visual spec + motion + transition (5 gün).
- **frontend-engineer:** implement (1 hafta).

**Toplam:** 2 hafta paralel.
