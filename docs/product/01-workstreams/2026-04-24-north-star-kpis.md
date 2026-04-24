# WS-01 — North-Star Metric + KPI Measurement Framework

**Durum:** scoping
**Sahip:** product-analyst
**Açıldı:** 2026-04-24
**Son güncelleme:** 2026-04-24
**Vizyon kaynağı:** `docs/strategy/06-memos/2026-04-23-stratejik-manzara-sentez.md`
**İlgili ADR:** ADR-001 (Proposed)

## 1. Kapsam (in / out)

**In:**
- MAKE (Monthly Active Karma Earner) tanım ve ölçüm.
- Secondary guardrail metrikler (W4 retention, Karma per MAKE, first-mission time).
- Supabase view + rolling calculation logic.
- Admin dashboard'da MAKE kartı.
- Haftalık otomatik rapor (email veya Slack webhook).

**Out (bu workstream dışı):**
- Real-time analytics dashboard (V1.1 aday).
- PostHog entegrasyonu (Faz 2+).
- A/B testing altyapısı (ayrı workstream).
- Sponsor marka analytics (R1 ile ilgili, ayrı).

## 2. Fonksiyonlar

1. **Event tracking altyapı** — `karma_transactions` yazılırken otomatik aktivite kaydı.
2. **MAKE view** — `public.make_monthly` view (rolling 30 gün, distinct user_id aggregation).
3. **Admin dashboard kartı** — `/admin` altına yeni section (yoksa); MAKE sayı + trend + ay karşılaştırma.
4. **Weekly report** — Cron (Supabase Edge Function) Pazartesi 09:00'da email tetikleyici.
5. **Cohort analysis** — kullanıcı kayıt ayı × W4 retention matrisi.
6. **Export CSV** — admin indirir.
7. **Alert** — MAKE %10+ hafta-üstü düşüş → warning email.

## 3. Kullanıcı değeri (JTBD)

- **Ürün ekibi (product-analyst, kullanıcı):** "Bu hafta MAKE kaç oldu, trend nasıl?" sorusuna 5 saniyede cevap → karar döngüsü hızlanır.
- **Strategy-consultant:** MAKE data ile stratejik varsayımları doğrular/çürütür.
- **Yatırımcı:** aylık rapor + traction sinyali.

## 4. Başarı kriterleri

- MAKE definition + tanım onaylandı (ADR-001 Accepted).
- View + event tracking 1 hafta içinde production'da.
- Admin dashboard kartı 2 hafta içinde canlı.
- Weekly report 3 hafta içinde otomatik.
- Year 1 hedef: **Ay 12 MAKE ≥ 10.000** (konservatif); orta senaryo 30.000.
- Guardrail: Karma per MAKE ≥ 200 (yani ortalama kullanıcı ayda en az 1 non-micro görev).

## 5. Bağımlılıklar

- **ADR-001 Accepted** (bloklayıcı).
- `karma_transactions` tablosu canlı (✅ var).
- Supabase Edge Functions deploy yetkisi (varsa ✅).
- Email servis (Supabase Auth email template veya Resend entegrasyonu).

## 6. Riskler

- **Metric gaming:** mikro görev spam. Mitigation: "Karma per MAKE" guardrail + mikro görev günlük limit.
- **Low volume early:** ilk aylarda sayı düşük, yanıltıcı. Mitigation: trend + cohort analysis, absolute değer değil.
- **Privacy:** anonymization if analytics shared. Mitigation: admin dashboard sadece aggregate; individual user drilling ayrı permission.

## 7. Açık kararlar

- **Q1 🔴** NSM tanımı (ADR-001 Proposed) — kullanıcı onayı bekliyor.
- **Yan Q:** Guardrail metriklerden Karma per MAKE threshold kaç olmalı (200? 300?) — başlangıç varsayım 200, veri geldikçe revize.

## 8. Öneri sırası (walking skeleton)

1. ADR-001 Accepted onayı → go signal.
2. **Adım 1 (3 gün):** Supabase view `make_monthly` yazılır + test.
3. **Adım 2 (5 gün):** Admin dashboard Next.js + Supabase client MAKE kartı.
4. **Adım 3 (5 gün):** Supabase Edge Function weekly report + cron.
5. **Adım 4 (3 gün):** Cohort view + admin UI.
6. **Adım 5 (2 gün):** Alert logic + export CSV.
7. **Walking skeleton:** Adım 1 + Adım 2 birleştiğinde minimum viable KPI framework canlı (ilk 1 hafta).

## 9. Teslim planı

- UX brief: gerek yok (admin-only, fonksiyonel UI).
- Eng brief: **WS-01-eng-brief-YYYY-MM-DD.md** (analist yazar sonra).
- İmplementasyon sahibi: supabase-backend (Faz 2'de kurulacak) veya şimdilik kullanıcı/strategy handoff.
- İlk demo: ADR onayından 2 hafta sonra.
- V1 release: ADR onayından 4 hafta sonra full automation.
