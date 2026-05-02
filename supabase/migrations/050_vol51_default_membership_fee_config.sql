-- Vol-51 Migration 050: Önemli STK'lara default membership_fee_config seed.
--
-- Bağlam (Bahadır + live verify, 2026-05-02):
--   Kızılay membership sayfasında "Üyeliği henüz hazır değil" görünüyor.
--   Root cause: ngos.membership_fee_config NULL → membership-flow-client'taki
--   LegacyFallback tetikleniyor.
--
--   Backoffice'te (/admin/[ngoId]/membership-config) admin bunu doldurabilir
--   ama seed'lerde önemli STK'lar için default config yoktu. Bu migration
--   default basit aylık (25/50/100₺) tier yapısını seed eder.
--
-- ADR-007 MembershipFeeConfig schema:
--   { mode, currency, tiers[], registration_fee?, donation_based?, ... }
--
-- Hedef NGO'lar: TEMA, Kızılay, Haytap, ÇYDD, Kodluyoruz, İBB, LÖSEV, TEGV
-- Sadece config'i NULL olanları update et (zaten admin doldurmuşsa overwrite
-- ETME — admin tercihine saygı).

begin;

-- Tipik aylık tier yapısı (3 tier: temel/standart/destekçi)
update public.ngos
set membership_fee_config = '{
  "mode": "monthly",
  "currency": "TRY",
  "tiers": [
    {
      "id": "basic",
      "name": "Temel Üye",
      "amount": 25,
      "period": "monthly",
      "display_order": 1,
      "impact_statement": "Aylık 25₺ ile düzenli destek"
    },
    {
      "id": "standard",
      "name": "Standart Üye",
      "amount": 50,
      "period": "monthly",
      "display_order": 2,
      "impact_statement": "Aylık 50₺ ile daha geniş etki",
      "recommended": true
    },
    {
      "id": "supporter",
      "name": "Destekçi Üye",
      "amount": 100,
      "period": "monthly",
      "display_order": 3,
      "impact_statement": "Aylık 100₺ ile büyük fark"
    }
  ],
  "cooling_off_days": 14,
  "auto_renew_default": true
}'::jsonb
where id in (
  'kizilay',
  'haytap',
  'kodluyoruz',
  'ibb',
  'losev',
  'tegv',
  'cydd'
)
and membership_fee_config is null;

-- TEMA için fixed annual mevcut olabilir (Vol-26'da fee config eklendi mi?
-- güvenlik için sadece NULL ise dolduralım)
update public.ngos
set membership_fee_config = '{
  "mode": "annual",
  "currency": "TRY",
  "tiers": [
    {
      "id": "tema-annual",
      "name": "TEMA Yıllık Üyelik",
      "amount": 240,
      "period": "annual",
      "display_order": 1,
      "impact_statement": "Yıllık 240₺ ile TEMA gönüllülük",
      "recommended": true
    }
  ],
  "cooling_off_days": 14
}'::jsonb
where id = 'tema'
  and membership_fee_config is null;

commit;

-- DOĞRULAMA:
--   select id, name, membership_fee_config is not null as has_config
--   from public.ngos
--   order by name;
--   -- Beklenen: Tüm 8 NGO için has_config = true
