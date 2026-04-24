-- 009_parametric_ngo_fee.sql
-- ADR-007 — Parametric NGO fee schema
-- Tarih: 2026-04-24
--
-- Her STK'nın kendi fee modelini tanımlayabileceği jsonb yapısı ekler.
-- 5 mode desteklenir: annual, monthly, one_time, donation_based, age_tiered.
-- Mevcut ngo_memberships.tier enum korunur (backward compat).

-- Payment mode enum ADR-008 ile birlikte tanımlanacak; burada sadece fee config
begin;

alter table public.ngos
  add column if not exists membership_fee_config jsonb default null;

comment on column public.ngos.membership_fee_config is
  'Per-NGO parametric üyelik fee config — ADR-007. Mode + tiers + registration_fee + donation_based + cooling_off_days. Boş ise membership kapalı ya da tarih-önü STK.';

-- Basit schema validation (postgres jsonb_typeof):
-- tam schema validation uygulamada (ts + zod) yapılır; DB'de minimum kontrol.
alter table public.ngos
  add constraint valid_fee_config_mode check (
    membership_fee_config is null
    or (membership_fee_config ? 'mode'
        and jsonb_typeof(membership_fee_config -> 'mode') = 'string'
        and (membership_fee_config ->> 'mode') in ('annual', 'monthly', 'one_time', 'donation_based', 'age_tiered'))
  );

-- Pilot 3 STK için seed config (admin daha sonra detayları doldurur)
-- TEMA: age_tiered — 0-13 ₺10-15, 14-24 ₺15, yetişkin büyükşehir ₺256 + yıllık aidat
update public.ngos
  set membership_fee_config = jsonb_build_object(
    'mode', 'age_tiered',
    'currency', 'TRY',
    'tiers', jsonb_build_array(
      jsonb_build_object(
        'id', 'yas_0_13',
        'name', '0-13 yaş',
        'amount', 15,
        'period', 'annual',
        'age_min', 0,
        'age_max', 13,
        'display_order', 1
      ),
      jsonb_build_object(
        'id', 'yas_14_24',
        'name', '14-24 yaş',
        'amount', 15,
        'period', 'annual',
        'age_min', 14,
        'age_max', 24,
        'display_order', 2
      ),
      jsonb_build_object(
        'id', 'yetiskin_buyuksehir',
        'name', 'Yetişkin (büyükşehir)',
        'amount', 256,
        'period', 'annual',
        'age_min', 25,
        'region', 'metropolitan',
        'display_order', 3
      )
    ),
    'registration_fee', jsonb_build_object(
      'amount', 0,
      'one_time', true,
      'description', 'Kayıt ücreti dahil'
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false,
    'has_installments', false
  )
  where id = 'tema' and membership_fee_config is null;

-- LÖSEV: donation_based
update public.ngos
  set membership_fee_config = jsonb_build_object(
    'mode', 'donation_based',
    'currency', 'TRY',
    'tiers', jsonb_build_array(),
    'donation_based', jsonb_build_object(
      'min_amount', null,
      'suggested_amounts', jsonb_build_array(50, 100, 250, 500),
      'note', 'Her bağış üyelik kaydı doğurur; tanışma toplantısı daveti 15 günde bir.'
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false
  )
  where id = 'losev' and membership_fee_config is null;

-- TEGV: donation-focused (benzer LÖSEV'e)
update public.ngos
  set membership_fee_config = jsonb_build_object(
    'mode', 'donation_based',
    'currency', 'TRY',
    'tiers', jsonb_build_array(),
    'donation_based', jsonb_build_object(
      'min_amount', 100,
      'suggested_amounts', jsonb_build_array(100, 250, 500, 1000),
      'note', 'Her bağış çocuk eğitimine katkıdır; gönüllü olmak için ayrıca başvuru.'
    ),
    'cooling_off_days', 14,
    'auto_renew_default', false
  )
  where id = 'tegv' and membership_fee_config is null;

-- RLS: ngos herkes okuyabilir (zaten mevcut policy).
-- membership_fee_config da görünür — kullanıcı UI'da ücret yapısını öğrenir.

commit;
