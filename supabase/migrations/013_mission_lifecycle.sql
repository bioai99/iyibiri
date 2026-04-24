-- 013_mission_lifecycle.sql
-- P0 #3 Mission Detail State Machine — data model additions.
-- Tarih: 2026-04-24 — supabase-backend
--
-- State machine 9 state:
--   idle, full, expired, requires_membership, taken, verifying,
--   completed, failed_verification, cancelled
--
-- Bu migration state derive için gereken kolonları + Karma idempotent constraint'i ekler.
-- Aktarım: docs/ui/01-specs/2026-04-24-mission-detail-state-machine-ui-spec.md Bölüm 7.

begin;

-- ============================================================
-- 1. missions tablosuna state kolonları
-- ============================================================

alter table public.missions
  add column if not exists status text default 'active';

-- Mevcut rows için default
update public.missions set status = 'active' where status is null;

-- Check constraint (ayrı — mevcut row'ları boşta bırakmaya izin verdikten sonra)
do $$ begin
  alter table public.missions
    add constraint missions_status_check
      check (status in ('draft', 'active', 'cancelled', 'completed'));
exception
  when duplicate_object then null;
end $$;

comment on column public.missions.status is
  'Mission lifecycle — draft (admin hazırlıyor), active (kullanıma açık), cancelled (admin iptal etti), completed (admin manuel tamamlandı işaretledi, ör. tarih geçti)';

-- Event date — structured datetime (date_label string olarak kalır)
alter table public.missions
  add column if not exists event_date timestamptz default null;

comment on column public.missions.event_date is
  'Yapılandırılmış görev tarihi — expired state derive için. date_label UI metni için.';

-- Prep checklist — taken state için NGO admin gelecekte doldurur
alter table public.missions
  add column if not exists prep_checklist jsonb default null;

comment on column public.missions.prep_checklist is
  'Hazırlık checklist — taken state''te gösterilir. Format: [{text: string, required: boolean}, ...].';

-- ============================================================
-- 2. user_missions admin review fields
-- ============================================================

alter table public.user_missions
  add column if not exists admin_review_status text default 'auto_approved';

update public.user_missions set admin_review_status = 'auto_approved'
  where admin_review_status is null;

do $$ begin
  alter table public.user_missions
    add constraint user_missions_admin_review_check
      check (admin_review_status in ('auto_approved', 'pending_review', 'approved', 'rejected'));
exception
  when duplicate_object then null;
end $$;

comment on column public.user_missions.admin_review_status is
  'Admin moderasyon state — auto_approved (default, trust-first), pending_review (flag), approved (admin onayladı), rejected (failed_verification state''e geçiş).';

alter table public.user_missions
  add column if not exists admin_feedback text default null;

comment on column public.user_missions.admin_feedback is
  'Admin''in kullanıcıya gösterilen feedback mesajı — rejected durumunda "sebep" olarak UI''da gösterilir.';

-- ============================================================
-- 3. Status enum'ını genişlet — cancelled + failed_verification
-- ============================================================

alter table public.user_missions
  drop constraint if exists user_missions_status_check;

do $$ begin
  alter table public.user_missions
    add constraint user_missions_status_check
      check (status in ('taken', 'completed', 'cancelled'));
exception
  when duplicate_object then null;
end $$;

-- Not: failed_verification ayrı bir status değil — admin_review_status = 'rejected' +
-- user_missions.status = 'taken' kombinasyonu ile derive edilir (UI yeniden gönderebilsin diye).

-- ============================================================
-- 4. KARMA IDEMPOTENT — mission başına tek Karma
-- ============================================================
-- Race condition çözümü: `completeMission` server action karma_transactions insert'i
-- önce yapar; unique constraint 2. insert'i sessizce bloklar → idempotent.

create unique index if not exists karma_transactions_mission_unique
  on public.karma_transactions (user_id, reference_id, type)
  where type = 'mission_complete';

comment on index karma_transactions_mission_unique is
  'Her kullanıcı her mission için max 1 Karma alır. completeMission server action race condition koruması.';

-- ============================================================
-- 5. event_date index — expired derive için
-- ============================================================

create index if not exists missions_event_date_idx
  on public.missions (event_date)
  where event_date is not null;

-- ============================================================
-- 6. Pilot seed — mevcut TEMA fidan dikim örnek görevine event_date
-- ============================================================
-- (Production'da admin UI'dan doldurulacak, burada sadece test amaçlı mock.)

update public.missions
  set event_date = (now() + interval '3 days')::timestamptz
  where ngo_id = 'tema'
    and event_date is null
    and status = 'active'
    and title ilike '%fidan%';

commit;
