-- Migration 052 (Vol-56-C): Tüm geçmiş görevleri minimum 3 hafta ileri taşı
-- ----------------------------------------------------------------------------
-- Pilot fixture'ları aylar önce seed edildi → event_date < NOW() → "Bu görev
-- tamamlandı / Tarih geçti" empty state'i tetikliyor. Demo modu için tüm
-- geçmiş + yakın tarihli görevleri 3-5 hafta arasına dağıt.
--
-- Idempotent: aynı migration tekrar koşturulursa zaten ileride olan görevleri
-- yine ileri taşımaz (sadece NOW() + 14 günden önceki olanları günceller).

begin;

-- 1. event_date < NOW() + 14 gün olan görevleri (geçmiş + yakın) 21-35 güne yay.
--    Random offset ile aynı güne kümelenmesin; saat 10:00 sabit.
update public.missions
set event_date = (
  date_trunc('day', now())
    + ((21 + (floor(random() * 15))::int) * interval '1 day')
    + interval '10 hours'
)
where event_date is null
   or event_date < (now() + interval '14 days');

-- 2. date_label string'ini de senkronla (UI'da bu string gösteriliyor).
--    formatMissionDate JS helper ile aynı kuralı kabaca uygula.
update public.missions
set date_label = to_char(event_date at time zone 'Europe/Istanbul', 'DD Mon')
where event_date is not null
  and (date_label is null or date_label = '' or date_label ilike '%esnek%' = false);

-- 3. status = 'expired' olan görevleri 'active'e geri al (yeniden aktif).
update public.missions
set status = 'active'
where status in ('expired', 'closed')
  and event_date > now();

-- 4. Bilgi notu
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.missions where event_date > now();
  raise notice 'Vol-56-C: % mission ileri tarihe taşındı (event_date > NOW)', v_count;
end$$;

commit;
