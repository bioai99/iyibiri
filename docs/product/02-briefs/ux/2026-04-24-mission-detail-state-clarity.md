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

## Handoff log

Bu brief'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 09:15 — **ux-researcher** ✅ — **audit + journey**: `docs/ux/03-heuristics/2026-04-24-mission-detail-state-machine-heuristik-audit.md` + `docs/ux/02-journeys/2026-04-24-mission-lifecycle-journey.md`. 9 state envanteri + Karma race condition tespiti (K4) + tema debt (K2). Q40-Q42 açık sorular. *(retroactive)*
- 2026-04-24 09:30 — **ui-designer** ✅ — **spec**: `docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md`. 14 bölüm, 9 state ASCII + FSM transition table + verification panel 4 variant + migration 013 şeması + server action sözleşmesi + 14 TR error copy. *(retroactive)*
- 2026-04-24 10:00 — **supabase-backend + frontend-engineer** ✅ — **infrastructure**: migration 013 + `lib/missions/state.ts` (9 state FSM) + `lib/missions/error-codes.ts` + `lib/missions/actions.ts` (server actions, race condition fix) + 55/55 unit test. TR locale bug unit test ile ispat → UI spec Bölüm 3.6 revize edildi. *(retroactive)*
- 2026-04-24 11:00 — **frontend-engineer** ✅ — **components + routing**: `components/mission/` 3 new + `/complete` dark rewrite + `/missions/[id]/page.tsx` 9-state routing + 2 dead file shim. 83/83 test. *(retroactive)*
