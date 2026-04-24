# Dashboard Journey — İkinci Ziyaret (3 Ay Sonra)

**Tarih:** 2026-04-24
**Yazar:** ux-researcher
**Persona:** Zehra (26, İstanbul, teknoloji profesyoneli)
**Senaryo:** 3 ay İyiBiri user'ı → 4 görev tamamladı, 1 seri → hafta içi akşam, iş çıkışı, metroda — "neler var bakalım"
**Referans 1. ziyaret:** `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md`
**Karşılaştırma:** 1. ziyaretten farklı dark moment ve peak moment'ler
**Skill usage:** ✅ `user-journey-mapping` + ✅ `mobile-app-polish-standards`
**Hipotez etiketi:** Bu map kanıt-tarafı (3 ay aktif Zehra'nın davranışı retention cohort'tan); açık karar (Q25, Q34) doğrulama için test sürümü.

---

## 1. Persona (3 ay sonra)

**Zehra, 26, İstanbul, teknoloji profesyoneli**

**Tur 1'den beri değişen durum:**
- İlk görevi (Bilim Merkezi turist rehberi) 2 gün sonra tamamladı → +100 Karma hediye (onboarding bonus).
- Sonra 3 görev daha (kütüphanede okuma programı, hayvan bakım sığınağı, gençlik merkezinde workshop). Hepsi 1–2 saat micro-gönüllülükler.
- 15 gün seri → Duolingo'da 60+ gün seri'sine alışkın, İyiBiri seri "yapılabilir" hissi aldı.
- Kütüphanede katıldığı STK'ya üye oldu (zaten ön koşulu vardı — arkadaşının referansı).
- Ödüllerle ilgili hiçbir bilgisi yok (Karma = "sayıcı", ödüllerle bağlantı yapamıyor çünkü dashboard ödül rail yok).
- Push notification aldığı yok (feature yok) — kendi kendine açıyor uygulamayı (hafta 1–2 günü, sonra hafta sonu).

---

## 2. Senaryo

"Zehra 3 ay sonra Perşembe akşam (iş çıkışında, metroda) İyiBiri'yi açıyor. 'Neler yeni var, seri devam mı, bugün bir görev yapmalı mısın' soruları var. 1. ziyarete göre **komfor ve familiarity** beklentileri arttı — ama **'durağan' hissi riski var** (aynı kartlar, aynı görevler)."

---

## 3. 10-Step Journey Map

| # | Ekran / Touchpoint | Kullanıcı eylemi | Düşünce ("İçinden geçen") | Duygu | Fırsat / sorun |
|---|---|---|---|---|---|
| 1 | `/dashboard` yükleniyor (0–1 sn) | App açıyor, loading skeleton bekliyor | "Açılırken ne kadar beklerim?" | 0 😐 | Skeleton 200ms öncesi gelmiyorsa "uzun açılış" hissi (tur 1'de +1 olmuştu, şimdi tekrar sıkılabilir). |
| 2 | Hero görünüyor (KarmaCounter animate) | Hero animation'ı izliyor (+450 Karma görünür) | "Vay be, 450 Karma birikti? Nerden?" | +2 😊 | **Peak moment adayı** — Zehra'nın kazanımı görünür hale geldi. Ama niye 450? Ödüllerle bağlantı yok (dashboard'da reward rail yok). |
| 3 | Tier + seri snapshot görünür | Seri stat'ı okuyor ("15 gün seri") | "Hala seri devam, güzel" | +2 😊 | **Peak moment:** Seri visible (A1 önerisi implement edilmişse). Duolingo benchmark emulate — flame emoji + dot bar. Şimdi momentum hissedilir. |
| 4 | Leaderboard teaser görünür (Q25 cevabı (a) pozitif frame) | "Bu hafta #43'tesin · 150 fark top 10" okur | "Hmm, #43 mü? Sosyal mi? Biraz tuhaf hissettim ama yakınlaştığı hoşuma gitti" | +1 🙂 | **Sosyal motivasyon riski:** Zehra'nın baskı hissi (beklenen), ama "yaklaşıyorsun" frame mitigates. Q25 test sonrası doğrula. **Alt risk:** "sıfır başta baskı hisseden kişi çıkabilir" — fallback (c) gerek. |
| 5 | "Günün görevi" DailyMissionCard görünür | Görev kartı okuyor (title + impact + Karma + STK) | "Bugün hayvan bakımında saatlik shift var, 2 saat. Karma kaç? +150. Yapabildim mi geçen hafta?" | +2 😊 | **Featured selection algoritması önemli (Q34):** Zehra'ya uygun (domain match) görev önerilmişse +2, random/uygunsuzsa −1. Şimdi tur 1'den farklı olarak **"bunu yapabilirim mi?" hızlı karar veriyor** (momentum). |
| 6 | "Başvur" tıklar | Mission apply form açılıyor (confirmation) | "Peki başvurdum, ne zaman başlıyor?" | +2 😊 | **Ceremony:** Haptic medium tap + "başvurdum" state güncellemesi. Tur 1'de `+2` hissiydi, şimdi daha routine — ama tekrar `+2` olmalı (consistency). |
| 7 | Applied state (dashboard'a dönüyor) | Aktif görev sayısı güncellenmiş ("1 aktif görev") | "Tamam, takvimimde var. Yarın yapacağım" | +1 🙂 | **Dark moment riski:** Eğer (5)'te görev uygun değilse (algoritma bad), Zehra buradan "her zaman böyle mi?" hissiyle çıkabilir. **A1 (streak), A2 (leaderboard), A3 (algoritma) kombinasyonu critical.** |
| 8 | Scroll mission listesi | "Keşfet" ile diğer görevler skanlıyor | "Başka ne var? Bunu yapmasam, başka seçenek var mı?" | 0 😐 | **Scannability test:** 4-chip render (A4 önerisi) veya domain + time + location yeterli? Zehra hızla "bana uygun mu" karar verme hızı. |
| 9 | NGO rail kaydır | Üyesi olduğu kütüphane STK kaydını görüyor | "Aa, buraya üyeydim. Güncellenmiş mi?" | +1 🙂 | **NGO rail:**Zehra'nın bağı varsa identity + participation hissi. Empty state variant yok mu? (N1 issue) |
| 10 | Logout (kapatıyor) | "Yeterince baktım" | "Yarın benekle başlayacağım. Devam etme niyetim var" | +2 😊 | **Peak moment — retention:** Zehra "devam edeceğim" niyeti var. Tur 1'den +1 point farklı — familiarity + momentum. **Tur 3 (4–6 ay) risk:** Engagement fatigue ("aynı şeyler devroluyor mu"). |

---

## 4. Emotion Curve

```
Adım      1    2    3    4    5    6    7    8    9   10
Skor      0   +2   +2   +1   +2   +2   +1    0   +1   +2
                                                ↓
                                          risk zone
                      ↑ peak zone (A1/A2/A3 combined)
```

**Curve analizi:**
- **Adım 2–7 (0 → +2 → +2 → +1 → +2 → +2 → +1) peak zone:** A1 (streak), A2 (leaderboard), A3 (algoritma) bir arada çalışırsa yüksek motivasyon.
- **Adım 8 (0) − risk zone:** "Başka seçenek var mı?" sorusunda zayıfladı (tur 1'de +1 idi). Zehra'nın karar vermesi biraz yavaş → scannability (A4).
- **Adım 10 (+2) peak:** Retention signali güçlü (tur 1'den +1 point up).

**Dark moment (tur 1 vs tur 2 farkı):**
- **Tur 1 dark moment:** Adım 3 "çok şey var, nerden başlayayım" (Adım 3 skor −1).
- **Tur 2 dark moment:** Adım 8 "scannability yavaş, başka seçenek mi?" (Adım 8 skor 0 = neutral risk). **Mitigator:** featured mission algoritması (A3) + 4-chip scannability (A4) birlikte.

---

## 5. Peak Moments — Tur 1 vs Tur 2

### Tur 1 Peak (Adım 8)
"İlk başvuru başarısı + celebration overlay" → +3 (max). Duygusal tepe noktası.

### Tur 2 Peak (Adım 2–3 combined)
"Birikmiş Karma + seri devam" → +2 (steady). **Farklılık:** Tur 1'de **ilklik çarpanı** (first time dopamine), tur 2'de **consistency çarpanı** (long-term motivation). 

**İyileştirme (A1 + A2 + A3 impact):**
- A1 (Streak visible) → Adım 3 skor +2 keep (tur 1'de bu sinyali yoktu, adım 3 tur 1'de durum karışıktı).
- A2 (Leaderboard) → Adım 4 skor +1 → +2 (sosyal karşılaştırma etkisi).
- A3 (Featured algoritma) → Adım 5 skor +2 keep (random olsaydı −1 riski vardı).

**Analiz:** A1 + A2 + A3 kombinasyonu tur 2 peak'i tur 1 seviyesinde tutarak **retention cliff** (3–6 ay attrition) engelliyor.

---

## 6. Dark Moment Deep-Dive (Tur 1 vs Tur 2)

### Tur 1 Dark Moment: Adım 3 "Çok şey var"
**Root cause:** Dashboard bölüm saatlarındaki cognitive overload. Focal point belirsiz.
**Çözüm:** HeroCardV2 + DailyMissionCard focal hierarchy (tur 1 implementasyonu).

### Tur 2 Dark Moment: Adım 8 "Başka seçenek var mı"
**Root cause:** Zehra hızla karar vermesi beklenir (metro, zamanı kısıtlı) — mission list scroll'u yavaş hissediliyor.
**Mitigator:**
- **A4 (Mission 4-chip render):** Scannability ↑ — domain + duration + location + difficulty = karar hızı ↑.
- **A3 (Featured algoritma):** Zehra'nın top-of-funnel önerisi uygunsa "başka aramam" confidence ↑.

**Aksiyonlar:**
1. DailyMissionCard algoritması test sonrası A/B (tur 3 pilot).
2. MissionCard 4-chip variant test (domain match + difficulty_level; ADR-007 dependent).

---

## 7. Tur 2 Önerilerinin Journey Map'e Etkisi

### Analyst'in 5 önerisi (A1–A5) — Zehra'nın 2. ziyaret journey'ine doğrudan test

| # | Öneri | Journey impact | Adım(lar) | Effect |
|---|---|---|---|---|
| A1 | Streak snapshot hero | Adım 3 skor +1 → +2 | 3, 10 | Peak moment amplify (motivational signal visible) |
| A2 | Leaderboard teaser (Q25) | Adım 4 skor +1 → +2 (if (a) frame) | 4 | Sosyal motivasyon (risk pending test) |
| A3 | Featured mission algoritma (Q34) | Adım 5 skor +2 keep (vs −1 random risk) | 5 | Seçim trust / cognitive ease (MVP MVP) |
| A4 | Mission 4-chip (difficulty) | Adım 8 skor 0 → +1 | 8 | Scannability ↑ (gerekirse tur 3'e) |
| A5 | Ödül rail | Adım 2 + Adım 10 context | 2, 10 | Karma → redemption bağlantı (Overhead → P1) |

**Öneriler combinatorial effect:**
- **A1 + A3:** Motivation (seri) + agency (algoritma) → Adım 2–7 peak zone kuvvetlendir.
- **A2 + A3:** Sosyal + selection = network retention loop.
- **A4:** Tur 1 dark moment'i çözdü; tur 2 dark moment'i mitigate (adım 8).

---

## 8. Tur 1 vs Tur 2 — Yapısal Farklılık

| Aspekt | Tur 1 (ilk ziyaret) | Tur 2 (3 ay sonra) | Zehra'nın psikoloji |
|---|---|---|---|
| Motivasyon | İlklik (dopamine spike) | Consistency (long-term retention) | "Devam edebilir miyim?" |
| Dark moment root | Cognitive overload ("çok şey") | Decision fatigue ("başka seçenek") | "Hızlı karar vermek istiyorum" |
| Peak moment | Celebration (first task done) | Accumulation (Karma visible + seri) | "İlerliyorum" hissi |
| Signal clarity | İçerik yoğunluğu karıştırıyor | Personalization + social = clarity ↑ | "Bana uygun mu?" hızlı cevabı |

---

## 9. Tur 2 Başarı Kriterleri (Tur 3'e hangover)

**Tur 2 defini (UX validation):**

- [ ] A1 (Streak snapshot) implement ve visible mi? (Adım 3 skor impact +2)
- [ ] A2 (Leaderboard) implement + Q25 tone test (Adım 4 skor impact, cultural sensitivity)
- [ ] A3 (Featured algoritma) spec yazılmış mı? (Adım 5 skor consistency)
- [ ] A4 (Mission 4-chip) variant ready mi veya tur 3 plan'da? (Adım 8 scannability)
- [ ] User test (5–10 Zehra-like persona, 3 ay+ active users) — tur 2 dark moment (Adım 8) vs tur 1 (Adım 3) A/B → friction reduction validate.

**Metric side (tur 2 → tur 3 engineering):**
- Week-0 → Week-4 retention cohort +3–5% (baseline vs A1+A2+A3 implement post).
- DailyMissionCard CTA hitrate ≥35% (tur 1 target maintain, A3 algoritma optimize).
- Leaderboard teaser click rate (A2) — track & Q25 tone sentiment (positive frame validation).
- Featured mission clickthrough A/B (tur 3) — random vs (a) algoritma impact.

---

## 10. Tur 3 Risk — Engagement Fatigue

**Tur 2 journey'den çıkan open question (tur 3 planning):**

Zehra 6–12 ay sonra "aynı şeyler devroluyor mu?" dark moment'e girmeyecek mi?
- **Adım 8 risk escalation:** Mission list stagnation (yeni görev sayısı düşüyor).
- **Peak moment deflation:** Leaderboard + seri = routine (dopamine fatigue).
- **Öneriler:**
  - Tur 3 A: Mission diversity (location-based + skill-based seçenek).
  - Tur 3 B: Leaderboard seasonal (+weekly → +monthly tier, noveL incentive).
  - Tur 3 C: STK subscription gamification (member-exclusive challenges).

---

## 11. Self-Audit — Journey Map Checklist

- [x] Persona etiketli + 3 ay sonra durumu açık.
- [x] Senaryo tek cümle + context (metro, zaman kısıtlı).
- [x] Adım sayısı 10 (3–10 range ✓).
- [x] Her adımda eylem + düşünce + duygu + fırsat.
- [x] Emotion curve ayrı bölümde (0 to +2 range).
- [x] Dark moment 1 (Adım 8 "başka seçenek") + peak moment 2 (Adım 2–3 combined).
- [x] Tur 1 referans ile karşılaştırma.
- [x] Tur 2 önerileri (A1–A5) impact mapping.
- [x] Kaynaklar listesi + skill usage.

✅ **Pass** — UX brief + audit'e devir edilebilir.

---

## 12. Kaynaklar

- [Kod] `app/dashboard/page.tsx` + `app/dashboard/dashboard-client.tsx` (tur 1 + tur 2 component'ler).
- [Referans] Tur 1 journey `docs/ux/02-journeys/2026-04-24-dashboard-ilk-acil-journey.md` (karşılaştırma base).
- [Kaynak] Skill `user-journey-mapping` (emotion curve + dark/peak moment).
- [Kaynak] Skill `mobile-app-polish-standards` (Duolingo retention pattern, Things 3 focus).
- [Hipotez] Zehra 3 ay user cohort retentiveness — analyst brief'ten MAKE (Monthly Active Karma Earner) metric.
- [Gözlem] Product-analyst tur 2 brief (A1–A5 öneriler) Zehra 2. ziyaret journey ile senkron.
- [Atlas] Bölüm 3 (rota), 4 (veri), 6 (DS), 8 (mobile).

---

## 13. Handoff Log

Bu journey'i alıp üreten agent'ların zinciri. Protokol: `.claude/skills/agent-communication-protocol/SKILL.md` Katman A.

- 2026-04-24 — **ux-researcher** ✅ — **tur2 journey**: bu dosya. Tur 1 dark moment vs tur 2 dark moment (Adım 8 "başka seçenek") + A1–A5 impact mapping.
- 2026-04-24 10:45 — **ui-designer** ✅ — **tur2 polish spec**: `docs/ui/01-specs/2026-04-24-dashboard-v2-tur2-polish-spec.md`. Journey adım 2–7 peak zone önerileri (A1 Streak, A2 Leaderboard, A3 featured mission algoritması) + adım 8 dark moment mitigator'ları (A4 4-chip scannability) spec'e integrate.

---

**Sonraki adım:** Frontend-engineer Zehra 2. ziyaret senyali (peakmodge + dark moment mitigation) implement.
