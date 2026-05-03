-- Vol-62 Migration 058: BUG-067 cleanup — duplicate donation karma transactions
-- Tarih: 2026-05-03
--
-- Sorun: Migration 056 trigger deploy edilmeden önce (ve/veya app code paralel insert ettiği sürece)
-- her bağış için 2 karma_transactions satırı oluşmuştu:
--   1. Application kodu insert'i: donation_id NULL, reference_id = donation.id (DUPLICATE)
--   2. Trigger insert'i: donation_id = donation.id (CANONICAL)
--
-- Bu migration:
--   1. Bir donation_id için hem NULL hem dolu satır varsa → NULL satırı sil (orphan duplicate)
--   2. Hiç trigger satırı yoksa (sadece NULL var) → backfill: NULL satırı UPDATE et donation_id ile
--   3. profiles.karma_total update_karma_total trigger sayesinde otomatik düzeltilir
--      (her DELETE → karma_total recompute)
--
-- Idempotent: Tekrar çalıştırılırsa 0 satır etkiler.

begin;

-- ──────────────────────────────────────────────────────────────────
-- 1. Audit: önce mevcut durumu say
-- ──────────────────────────────────────────────────────────────────

do $$
declare
  v_total_donation_kt int;
  v_with_donation_id int;
  v_without_donation_id int;
  v_orphans_to_delete int;
  v_to_backfill int;
begin
  select count(*) into v_total_donation_kt
    from public.karma_transactions where type = 'donation';

  select count(*) into v_with_donation_id
    from public.karma_transactions where type = 'donation' and donation_id is not null;

  select count(*) into v_without_donation_id
    from public.karma_transactions where type = 'donation' and donation_id is null;

  -- Orphan: NULL satır + aynı reference_id ile dolu satır varsa
  select count(*) into v_orphans_to_delete
    from public.karma_transactions kt_null
    where kt_null.type = 'donation'
      and kt_null.donation_id is null
      and exists (
        select 1 from public.karma_transactions kt_full
        where kt_full.type = 'donation'
          and kt_full.donation_id::text = kt_null.reference_id
      );

  -- Backfill: NULL satır var ama trigger satırı yok (donations'a join edilebilir)
  select count(*) into v_to_backfill
    from public.karma_transactions kt_null
    where kt_null.type = 'donation'
      and kt_null.donation_id is null
      and exists (select 1 from public.donations d where d.id::text = kt_null.reference_id)
      and not exists (
        select 1 from public.karma_transactions kt_full
        where kt_full.type = 'donation'
          and kt_full.donation_id::text = kt_null.reference_id
      );

  raise notice '[058_vol62 BUG-067 audit] total donation kt: %, with donation_id: %, without donation_id: %, orphans to delete: %, to backfill: %',
    v_total_donation_kt, v_with_donation_id, v_without_donation_id, v_orphans_to_delete, v_to_backfill;
end $$;

-- ──────────────────────────────────────────────────────────────────
-- 2. Orphan duplicate'ları sil (donation_id NULL + canonical satır var)
-- ──────────────────────────────────────────────────────────────────

delete from public.karma_transactions kt_null
where kt_null.type = 'donation'
  and kt_null.donation_id is null
  and exists (
    select 1 from public.karma_transactions kt_full
    where kt_full.type = 'donation'
      and kt_full.donation_id::text = kt_null.reference_id
  );

-- ──────────────────────────────────────────────────────────────────
-- 3. Backfill: NULL satır var ama trigger satırı yok → donation_id'yi doldur
-- (legacy: 056 trigger deploy'undan önce yazılan kayıtlar)
-- ──────────────────────────────────────────────────────────────────

update public.karma_transactions kt_null
set donation_id = d.id
from public.donations d
where kt_null.type = 'donation'
  and kt_null.donation_id is null
  and d.id::text = kt_null.reference_id
  and not exists (
    select 1 from public.karma_transactions kt_full
    where kt_full.type = 'donation'
      and kt_full.donation_id = d.id
  );

-- ──────────────────────────────────────────────────────────────────
-- 4. profiles.karma_total recompute (DELETE'ten sonra ihtiyaç olabilir)
-- update_karma_total trigger karma_transactions changes'a tepki vermeli, ama
-- DEFENSIVE: explicit recompute yap
-- ──────────────────────────────────────────────────────────────────

update public.profiles p
set karma_total = coalesce((
  select sum(amount) from public.karma_transactions kt where kt.user_id = p.id
), 0);

-- ──────────────────────────────────────────────────────────────────
-- 5. Post-cleanup audit
-- ──────────────────────────────────────────────────────────────────

do $$
declare
  v_remaining_null int;
  v_total_after int;
begin
  select count(*) into v_remaining_null
    from public.karma_transactions where type = 'donation' and donation_id is null;

  select count(*) into v_total_after
    from public.karma_transactions where type = 'donation';

  raise notice '[058_vol62 BUG-067 post-cleanup] total donation kt: %, NULL remaining: % (should be 0 if all donations had matching trigger satır)',
    v_total_after, v_remaining_null;
end $$;

commit;
