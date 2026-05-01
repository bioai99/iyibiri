# Çözülmüş Kararlar Arşivi

> ADR Accepted olunca open.md'den buraya taşınır. İş akışı referansı — geri giden argümanları hatırlamak için.

**Son güncelleme:** 2026-04-24 — 8 ADR Accepted, 13 soru çözüldü.

---

## Kabul Edilen ADR'ler (2026-04-24)

| Q# | Soru | Karar | ADR |
|---|---|---|---|
| Q1 | North-star metrik | **Aylık Karma Kazanan Kullanıcı (MAKE)** — distinct user başına `karma_transactions.type='mission_complete'` rolling 30d. | [ADR-001](../03-decisions/001-north-star-metric.md) |
| Q2 | Birincil ödeme sağlayıcı | **iyzico** (kendi gelir kolları: R1/R2/R6) + Marketplace mode. Craftgate Yıl 2. | [ADR-002](../03-decisions/002-odeme-saglayici-iyzico.md) |
| Q3 | Bağış V1'de var mı? | **Hayır, V2'de yönlendirici mod.** Mock 4 sayfa coming-soon olacak. | [ADR-006](../03-decisions/006-bagis-v2-yonlendirici.md) |
| Q4 | Pilot şehir | **İstanbul + online/remote.** V1.1 Ankara/İzmir. | [ADR-003](../03-decisions/003-pilot-istanbul.md) |
| Q5 | Dark-only mı light mode mı | **V1 dark-only. Light Yıl 2 opt-in.** | [ADR-004](../03-decisions/004-dark-only-v1.md) |
| Q12 | Statüsüz STK vergi uyarısı UI | ADR-006 içinde — statülü ise "Vergi indirimli ✓" etiketi. | [ADR-006](../03-decisions/006-bagis-v2-yonlendirici.md) |
| Q15 | Komisyon pilot müzakere | **Pilot 3 STK için 6 ay %0 komisyon.** 6 ay sonu müzakere. | [ADR-005](../03-decisions/005-pilot-3-stk.md) |
| Q23 | İlk 3 pilot STK | **TEMA + TEGV + LÖSEV.** | [ADR-005](../03-decisions/005-pilot-3-stk.md) |
| Q25 | Pilot paket kapsamı | 6 ay pilot, %0 fee, aylık raporlama, admin tool V0. | [ADR-005](../03-decisions/005-pilot-3-stk.md) |
| Q27 | Parametric fee | **`ngos.membership_fee_config` jsonb** — 5 mode (annual/monthly/one_time/donation_based/age_tiered). | [ADR-007](../03-decisions/007-parametric-ngo-fee-schema.md) |
| Q28 | Payment routing | **3-modlu hibrit: Embedded + Passthrough + Marketplace.** Marketplace fonzip-dışı default. | [ADR-008](../03-decisions/008-payment-routing-pass-through.md) |
| Q33 | Scope — fonzip parite mi? | **Yol F — Yol C (hibrit evrim) + Yol D.2 (silent technical) paralel; Yol D.1 ay 4+ opsiyonel.** | Yol F referansı — [05-focus memo](../../strategy/05-focus/2026-04-24-fonzip-positioning-koruma-stratejisi.md) |
| Q40 | Nihai yol | Q33 ile aynı cevap — Yol F onaylandı. | — |

---

## Uygulama durumu (2026-04-24 itibarıyla)

- ✅ Workstream WS-01 (NSM + KPI) ADR-001 onaylı, başlayabilir.
- ✅ Workstream WS-02 (STK pilot onboarding) ADR-005 + ADR-007 + ADR-008 onaylı, başlayabilir.
- ✅ Workstream WS-03 (Membership Payments) ADR-002 + ADR-007 + ADR-008 onaylı, başlayabilir.
- ✅ Dashboard `.dark` fix uygulandı (ADR-004).
- ✅ Bağış mock sayfalarına coming-soon banner eklendi (ADR-006).
- ✅ Migration 009 (`parametric_ngo_fee`) + 010 (`payment_routing`) yazıldı, apply bekliyor.
- 🔄 TEMA partnership pitch hazırlandı — sen iletmeyi onayladığında.
- 🔄 Faz 2 agent'ları (frontend-engineer + supabase-backend + design-system-keeper + auth-capacitor) kuruldu; çağırılmaya hazır.

## Devam açık sorular (open.md)

Hukuki mütalaa bekleyen: Q10 (BDDK/KDV), Q11 (makbuz veri akışı), Q13 (bağış cayma hakkı), Q37 (fonzip ToS), Q38 (trademark), Q39 (NDA).
Workstream içi kararlar: Q6 (domain migration), Q7 (Karma impact), Q16 (auto-renew), Q17 (STK admin kapsam), Q20 (vergi checkbox yeri), Q26 (TEGV pre-screening).
İleri zaman: Q8-Q9 (SDG/Karma geçmiş), Q14 (kurumsal bağış), Q18-Q19 (bundle/isim), Q21-Q22 (makbuz/muhasebeci), Q24 (Kızılay), Q29-Q30 (SaaS tier, attribution), Q31-Q32 (API key/mobile iframe), Q34-Q35 (admin kapsam/migration).

## 2026-04-26 — system-architect ADR Accept (3)

- ✅ Q45 — TIERS canonical naming + threshold — **ADR-014 Accepted** — 5 tier, Set A naming ("İyi Biri/Çok İyi Biri/Çoook İyi Biri/Gerçekten İyi Biri/İyiliğin Öncüsü"), karma-tabanlı threshold 500/2000/5000/10000. Canonical: `lib/tiers.ts`. TD-001 fix.
- ✅ Q46 — Server action defense-in-depth + auth template — **ADR-015 Accepted** — `lib/auth/guards.ts` + (opsiyonel) `createServerAction` template + 3 lint rule. 35 server action auth guard'a alınacak. TD-019/020/026 fix.
- ✅ Q47 — Migration template zorunluluğu — **ADR-016 Accepted** — `docs/eng/templates/migration-template.sql` baseline. Yeni migration'lar begin/commit + if-not-exists + RLS + index pattern'lerini takip eder. TD-014 fix.
