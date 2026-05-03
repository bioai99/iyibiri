-- Migration 054 (Vol-58.2): LÖSEV + TEGV logo URL'leri
-- ----------------------------------------------------------------------------
-- Bağış sayfasında bu iki STK'nın logo'su yoktu — listede sadece "L" / "T"
-- initial gradient gösteriyordu. /public/'e brand-uyumlu inline SVG asset
-- eklendi (losev-logo.svg, tegv-logo.svg). NgoListCard logo_url'i alıp render
-- ediyor (Vol-58 zaten yapıldı).
--
-- Bu migration sadece DB'de logo_url alanını set eder.
-- Idempotent: tekrar koşturulursa aynı değeri yazar.

begin;

update public.ngos
set logo_url = '/losev-logo.svg'
where (short_name ilike 'LÖSEV' or short_name ilike 'LOSEV' or name ilike '%LÖSEV%' or name ilike '%Lösemili%')
  and (logo_url is null or logo_url = '' or logo_url like '/losev%');

update public.ngos
set logo_url = '/tegv-logo.svg'
where (short_name ilike 'TEGV' or name ilike '%TEGV%' or name ilike '%Türkiye Eğitim Gönüllüleri%')
  and (logo_url is null or logo_url = '' or logo_url like '/tegv%');

-- Bilgi notu
do $$
declare
  v_losev_count int;
  v_tegv_count int;
begin
  select count(*) into v_losev_count from public.ngos where logo_url = '/losev-logo.svg';
  select count(*) into v_tegv_count from public.ngos where logo_url = '/tegv-logo.svg';
  raise notice 'Vol-58.2: LÖSEV % satır, TEGV % satır logo_url güncellendi', v_losev_count, v_tegv_count;
end$$;

commit;
