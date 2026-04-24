-- 012_membership_karma_type.sql
-- NGO üyelik Karma bonus — karma_transactions.type enum'ına 'ngo_membership' ekle.
-- Tarih: 2026-04-24 — supabase-backend
--
-- NGO üyelik tamamlandığında +100 Karma veren flow (lib/membership/actions.ts)
-- karma_transactions insert yapar. Mevcut enum ('mission_complete','reward_redemption')
-- 'ngo_membership' içermiyor — bu migration ekliyor.
--
-- Trigger `update_karma_total` otomatik olarak profiles.karma_total artırır (001 migration).

begin;

-- Text check constraint — yeni değer eklenir
alter table public.karma_transactions
  drop constraint if exists karma_transactions_type_check;

alter table public.karma_transactions
  add constraint karma_transactions_type_check
    check (type in ('mission_complete', 'reward_redemption', 'ngo_membership'));

-- Partial index — ngo_membership karma events için analytics
create index if not exists karma_transactions_ngo_membership_idx
  on public.karma_transactions (user_id, created_at desc)
  where type = 'ngo_membership';

comment on index karma_transactions_ngo_membership_idx is
  'NGO üyelik Karma events — profile timeline + attribution analytics.';

commit;
