# 007. STK üyelik fee yapısı parametric jsonb schema ile modellenir

**Tarih:** 2026-04-24
**Durum:** **Accepted (2026-04-24)** ✅ — anlamı ADR-008 ile güncel: fee config Embedded/Passthrough modda bilgi amaçlı, Marketplace modda tahsilat bazlı.
**Önerici:** product-analyst (Q27 çözümü — TEMA ₺256 tespiti sonrası)

> **⚠️ Revizyon notu (2026-04-24, ADR-008 sonrası):**
> Bu ADR hala geçerli — `ngos.membership_fee_config` jsonb schema ve fee yapısı. Ancak **payment routing ADR-008 ile pass-through default oldu.** Bu, `membership_fee_config` verisinin İyiBiri için **bilgi amaçlı** (kullanıcıya STK'nın fee yapısını göstermek, filtrele, compare) olduğu anlamına geliyor — İyiBiri o ödemeyi tahsil etmiyor. Marketplace modu opt-in olduğunda bu schema tahsilat için de kullanılır. Schema özü değişmedi, ama "kim tahsil ediyor" sorusu artık `ngos.payment_mode` ile kontrol ediliyor.

## Bağlam

Kullanıcı tespiti (2026-04-24) + doğrulama araştırması gösterdi ki her STK'nın üyelik fee modeli farklı:

| STK | Fee modeli |
|---|---|
| **TEMA** | Yaş-tier: 0-13 ₺10-15, 14-24 ₺15, yetişkin büyükşehir ₺256 kayıt + yıllık aidat |
| **HAYTAP** | Aylık ₺30 (günlük ₺1) veya kart |
| **ÇYDD** | Genel kurul belirler — yıllık aidat değişken |
| **LÖSEV** | Bağış-tabanlı, min tutar yok + tanışma toplantısı gereksinimi |
| **TEGV** | Donation-focused, membership fee net değil |

Mevcut DB (atlas Bölüm 4):
- `ngo_memberships.tier` enum `'free' | 'basic' | 'premium'` — hardcoded 3 tier, gerçek dünya karşılamıyor.
- `ngo_memberships.form_data` jsonb — var ama fee yapısı değil, form alanları için.
- Ücret, periyot, kayıt fee, tier isim tamamen hardcoded eksik.

Kısa vadede "en büyük 3 STK'ya özel kod yaz" yaklaşımı ölçeklenemez. Parametric schema gerekir.

## Karar

**`ngos` tablosuna `membership_fee_config jsonb` kolonu eklenir. `ngo_memberships.tier` enum mevcut kullanıma devam (basit pazarlama etiketi), ama asıl fee bilgisi `ngos.membership_fee_config`'te yaşar.**

Önerilen jsonb yapısı:

```json
{
  "mode": "one_time" | "monthly" | "annual" | "donation_based" | "age_tiered",
  "currency": "TRY",
  "tiers": [
    {
      "id": "yas_14_24",
      "name": "14-24 yaş",
      "amount": 15,
      "period": "annual",
      "age_min": 14,
      "age_max": 24,
      "region": null,
      "display_order": 1
    },
    {
      "id": "yetiskin_buyuksehir",
      "name": "Yetişkin (büyükşehir)",
      "amount": 256,
      "period": "annual",
      "age_min": 25,
      "age_max": null,
      "region": "metropolitan",
      "display_order": 2
    }
  ],
  "registration_fee": {
    "amount": 0,
    "one_time": true,
    "description": "Kayıt ücreti"
  },
  "donation_based": {
    "min_amount": null,
    "suggested_amounts": [50, 100, 250],
    "note": "Her bağış bir üyelik anlamına gelir"
  },
  "has_installments": false,
  "auto_renew_default": false,
  "cooling_off_days": 14
}
```

**Kurallar:**
- `mode` primary ayrım — UI form'u bu alana göre render eder.
- `tiers` array — her mode için uygulanır; age/region filtreleri var.
- `registration_fee` opsiyonel — TEMA gibi ek one-time fee modelleri için.
- `donation_based` sadece `mode='donation_based'` ise doldurulur.
- `cooling_off_days` TR tüketici kanunu gereği (Madde 48, 14 gün) zorunlu olarak 14 — STK override edemez.

## Sonuçlar

**İyi:**
- Her STK kendi fee modelini tanımlayabilir — platform sınırlaması yok.
- Admin UI bu config'i yönetir (Workstream 2 kapsamında).
- Yeni STK eklemek kod değişikliği gerektirmez.
- Mevcut `ngo_memberships.tier` bozulmuyor — backward compat.

**Kötü:**
- Validation karmaşıklaşır — jsonb schema validation (zod + supabase RLS).
- UI form render logic'i karmaşık — her mode için farklı komponent.
- Migration: mevcut 3-tier data model → jsonb; veri kaybı yok ama dönüşüm testi lazım.
- Admin'in jsonb editör yazması UX zorlu — form-based editor UI gerek.

**Uygulama:**

**Migration (Workstream 3 kapsamı):**

```sql
-- 009_parametric_ngo_fee.sql

alter table public.ngos
  add column membership_fee_config jsonb default null;

-- Opsiyonel: schema validation check constraint (postgres jsonb_path_match)
-- alter table public.ngos
--   add constraint valid_fee_config check (
--     membership_fee_config is null or
--     jsonb_typeof(membership_fee_config -> 'mode') = 'string'
--   );

-- Mevcut 3 tier'lı STK'lar için default config:
update public.ngos
  set membership_fee_config = jsonb_build_object(
    'mode', 'annual',
    'currency', 'TRY',
    'tiers', jsonb_build_array(
      jsonb_build_object('id', 'basic', 'name', 'Temel', 'amount', 0, 'period', 'annual')
    )
  )
  where membership_fee_config is null;
```

**İlk 3 STK için seed (Workstream 2):**
- TEMA → `age_tiered` mode, 3 tier + ₺256 registration_fee.
- HAYTAP → `monthly` mode, tek tier ₺30.
- LÖSEV → `donation_based` mode, suggested_amounts=[50, 100, 250].

**UI/UX implikasyon (UX/UI brief):**
- `/dashboard/ngos/[id]/membership` sayfa membership_fee_config okur → ilgili form render eder.
- Age filter JavaScript tarafında: kullanıcının `profiles.age_range` ile tiers.age_min/max cross-check.
- Region filter: `profiles.city` büyükşehir mi kontrol.

**Bağlı kararlar:**
- ADR-002 iyzico Marketplace → split payment `membership_fee_config.tiers[].amount` kullanır.
- Workstream 3 (Membership Payments + Parametric Fee) bu ADR'nin implementasyon.
- Workstream 2 (STK pilot onboarding) 3 STK'nın ilk config'ini seed eder.

## Referanslar

- Strateji: `docs/strategy/04-value-prop/2026-04-23-oncelikli-stk-gonullu-toplama-analizi.md` STK fee karşılaştırma
- Strateji: `docs/strategy/04-value-prop/2026-04-23-uyelik-akisi-kullanici-platform-stk.md` para akışı
- Atlas: `docs/project-atlas.md` Bölüm 4 (ngo_memberships schema)
- Doğrulama: TEMA resmi sayfa + HAYTAP SSS + ÇYDD tüzük (S36 ekleme adayı)

**İlgili soru:** Q27 — yeni bulgu. Proposed, kullanıcı onayı bekliyor.

**Kritiklik:** Bu ADR onaylanmadan Workstream 2 ve 3 ilerleyemez.
