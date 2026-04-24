-- 011_make_analytics_views.sql
-- WS-01: North-Star Metric (MAKE — Monthly Active Karma Earner) + secondary analytics views
-- ADR-001 karar: NSM = Ay içinde en az 1 görev tamamlayarak en az 1 Karma kazanmış distinct kullanıcı.
-- Tarih: 2026-04-24 — supabase-backend

begin;

-- ============================================================
-- Index — karma_transactions için analytics query performance
-- ============================================================
create index if not exists karma_transactions_type_date_idx
  on public.karma_transactions (type, created_at desc)
  where type = 'mission_complete';

comment on index karma_transactions_type_date_idx is
  'MAKE view + karma_per_make + ay bazlı aggregations için. type filter partial index.';

-- ============================================================
-- VIEW 1: make_monthly — North-Star Metric
-- ============================================================
-- Rolling 12 ay geriye, ay bazlı distinct user count.
-- Kullanım: admin dashboard kartı, weekly report.

create or replace view public.make_monthly as
select
  date_trunc('month', kt.created_at)::date as month,
  count(distinct kt.user_id) as make_count,
  count(*) as total_mission_completions,
  sum(kt.amount) as total_karma_awarded
from public.karma_transactions kt
where kt.type = 'mission_complete'
  and kt.created_at >= date_trunc('month', now()) - interval '12 months'
group by 1
order by 1 desc;

comment on view public.make_monthly is
  'WS-01 NSM: Aylık Karma Kazanan Kullanıcı (MAKE). Rolling 12 ay geriye.';

-- ============================================================
-- VIEW 2: make_rolling_30d — son 30 gün kayan MAKE
-- ============================================================
-- Günlük bir değer olarak son 30 günün MAKE'ini hesaplar.
-- "Bu an" metriği — aylık değil sürekli.

create or replace view public.make_rolling_30d as
select
  count(distinct kt.user_id) as make_count,
  count(*) as total_mission_completions,
  now() - interval '30 days' as window_start,
  now() as window_end
from public.karma_transactions kt
where kt.type = 'mission_complete'
  and kt.created_at >= now() - interval '30 days';

comment on view public.make_rolling_30d is
  'Son 30 günün güncel MAKE sayısı. Dashboard kartı için anlık değer.';

-- ============================================================
-- VIEW 3: karma_per_make — engagement derinliği
-- ============================================================
-- Ortalama aktif kullanıcı başına Karma. Metric gaming guardrail:
-- düşük Karma-per-MAKE = mikro-görev spam; yüksek = derin engagement.

create or replace view public.karma_per_make as
select
  date_trunc('month', kt.created_at)::date as month,
  count(distinct kt.user_id) as make_count,
  sum(kt.amount) as total_karma,
  round(sum(kt.amount)::numeric / nullif(count(distinct kt.user_id), 0), 0) as avg_karma_per_make
from public.karma_transactions kt
where kt.type = 'mission_complete'
  and kt.created_at >= date_trunc('month', now()) - interval '6 months'
group by 1
order by 1 desc;

comment on view public.karma_per_make is
  'MAKE başına ortalama Karma. Engagement derinlik guardrail — target ≥ 200.';

-- ============================================================
-- VIEW 4: first_mission_time — activation hızı
-- ============================================================
-- Kayıt → ilk görev tamamlama süresi. Dashboard ana ekran tasarım kalitesi için.

create or replace view public.first_mission_time as
select
  p.id as user_id,
  p.created_at as signup_at,
  min(um.completed_at) as first_mission_at,
  extract(epoch from (min(um.completed_at) - p.created_at)) / 3600 as hours_to_first_mission
from public.profiles p
left join public.user_missions um
  on um.user_id = p.id
  and um.status = 'completed'
where p.created_at >= now() - interval '3 months'
group by p.id, p.created_at;

comment on view public.first_mission_time is
  'Kayıt → ilk görev tamamlama süresi. Onboarding UX kalitesi göstergesi.';

-- ============================================================
-- VIEW 5: w4_retention_cohort — 4. hafta retention
-- ============================================================
-- Ay başına kayıt olanların 4. hafta aktif kalma oranı.
-- Duolingo benchmark %30-40 (gamified engagement).

create or replace view public.w4_retention_cohort as
with cohorts as (
  select
    date_trunc('month', p.created_at)::date as cohort_month,
    p.id as user_id,
    p.created_at as signup_at
  from public.profiles p
  where p.created_at >= date_trunc('month', now()) - interval '6 months'
),
retained as (
  select
    c.cohort_month,
    count(distinct c.user_id) as cohort_size,
    count(distinct case
      when exists (
        select 1 from public.karma_transactions kt
        where kt.user_id = c.user_id
          and kt.type = 'mission_complete'
          and kt.created_at >= c.signup_at + interval '21 days'
          and kt.created_at < c.signup_at + interval '28 days'
      ) then c.user_id
    end) as retained_w4
  from cohorts c
  group by 1
)
select
  cohort_month,
  cohort_size,
  retained_w4,
  round(retained_w4::numeric * 100 / nullif(cohort_size, 0), 1) as w4_retention_pct
from retained
order by cohort_month desc;

comment on view public.w4_retention_cohort is
  'Ay cohort × W4 retention. Duolingo benchmark %30-40. Gamified engagement göstergesi.';

-- ============================================================
-- RLS — View'lara doğrudan select kısıtı
-- ============================================================
-- View'lar admin-only kullanım için (admin middleware + ADMIN_SECRET cookie).
-- Public RLS yok çünkü view'lar altındaki karma_transactions zaten user-own RLS'e sahip.
-- Admin dashboard'dan bypass için `lib/supabase/server.ts` service role client
-- kullanılır (middleware guard sonrası).

commit;
