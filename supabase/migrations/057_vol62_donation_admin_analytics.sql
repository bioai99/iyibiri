-- Vol-62 Migration 057: NGO Donation Analytics RLS + FK Index (P0)
-- Tarih: 2026-05-03
-- Sorun:
--   1. donations tablosuna NGO admin'leri kendi STK'larına yapılan bağışları göremez (RLS gap)
--   2. donations.campaign_id FK için composite index yok → Vol-59 trigger'daki campaign FK scan O(n)
-- Çözüm:
--   A) RLS policy: ngo_admins donations görüntüleyebilir (kendi STK'larına gelen bağışlar)
--   B) Composite FK index'ler (campaign + ngo cross-ref)
--   C) audit_log table (opsiyonel, backfill tracking için)
--
-- Kapsam:
--   1. donations tablosuna RLS policy (ngo_admins kendi bağışları görür)
--   2. Composite index: (campaign_id, status, created_at) — campaign progress query hızlatma
--   3. Composite index: (ngo_id, campaign_id, status) — admin "campaign summary" sorguları
--   4. audit_log table (opsiyonel) — backfill izleme

begin;

-- ──────────────────────────────────────────────────────────────────
-- A) RLS Policy: NGO admin'leri kendi STK'larına gelen bağışları görebilir
-- ──────────────────────────────────────────────────────────────────

drop policy if exists "ngo_admins_view_donations" on public.donations;

create policy "ngo_admins_view_donations"
  on public.donations
  for select
  to authenticated
  using (
    public.is_ngo_admin(auth.uid(), ngo_id)
  );

comment on policy "ngo_admins_view_donations" on public.donations is
  'Vol-62 Pkg-3: NGO adminleri kendi STK larına yapılan bagislari analytics panelinde goruntuleyebilir.';

-- ──────────────────────────────────────────────────────────────────
-- B) Composite FK Index: Campaign progress queries (raised_amount + donor list)
-- ──────────────────────────────────────────────────────────────────
-- Vol-59 Migration 055'teki campaign.raised_amount trigger'ı her donation INSERT'te
-- campaign'a JOIN yapıyor. Bu index O(n) scan'ı O(log n) yap.

create index if not exists idx_donations_campaign_status_created
  on public.donations (campaign_id, status, created_at desc)
  where campaign_id is not null and status = 'completed';

comment on index idx_donations_campaign_status_created is
  'Vol-62: Campaign progress queries (raised_amount update + donor list). PARTIAL: completed only.';

-- ──────────────────────────────────────────────────────────────────
-- C) Composite Index: NGO admin "campaign summary" queries (ngo x campaign cross-ref)
-- ──────────────────────────────────────────────────────────────────
-- Admin panelinde: "Bu kampanya → toplam bağış, kaç kişi, statüs dağılımı"

create index if not exists idx_donations_ngo_campaign_status
  on public.donations (ngo_id, campaign_id, status)
  where status = 'completed';

comment on index idx_donations_ngo_campaign_status is
  'Vol-62: Admin analytics (ngo_id × campaign_id × status breakdown). PARTIAL: completed only.';

-- ──────────────────────────────────────────────────────────────────
-- D) audit_log table (opsiyonel, backfill tracking için)
-- ──────────────────────────────────────────────────────────────────
-- Vol-61 önerisi: Migration 025, 026, 053, 056 retroactive işlemlerin izini tutmak.
-- Eğer backfill yapılırsa → audit_log'a record insert et (kim, ne zaman, kaç row etkilendi).

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  operation text not null,  -- 'backfill' | 'migration' | 'manual'
  affected_count int,
  details jsonb,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.audit_log enable row level security;

-- RLS: Sadece super-admin görür
drop policy if exists "super_admin_view_audit" on public.audit_log;

create policy "super_admin_view_audit"
  on public.audit_log
  for select
  to authenticated
  using (public.is_super_admin(auth.uid()));

comment on table public.audit_log is
  'Vol-62 Pkg-3: Backfill, migration, manual operations audit trail. super-admin only.';

-- ──────────────────────────────────────────────────────────────────
-- E) Validation: RLS policy + indexes oluşturuldu mu
-- ──────────────────────────────────────────────────────────────────

do $$
declare
  v_ngo_admin_policy_exists boolean;
  v_campaign_index_exists boolean;
  v_ngo_campaign_index_exists boolean;
  v_audit_log_exists boolean;
  v_audit_log_rls_enabled boolean;
begin
  -- Check ngo_admins_view_donations policy
  select exists(
    select 1 from pg_policies
    where tablename = 'donations'
    and policyname = 'ngo_admins_view_donations'
  ) into v_ngo_admin_policy_exists;

  -- Check campaign index
  select exists(
    select 1 from pg_indexes
    where tablename = 'donations'
    and indexname = 'idx_donations_campaign_status_created'
  ) into v_campaign_index_exists;

  -- Check ngo_campaign index
  select exists(
    select 1 from pg_indexes
    where tablename = 'donations'
    and indexname = 'idx_donations_ngo_campaign_status'
  ) into v_ngo_campaign_index_exists;

  -- Check audit_log table
  select exists(
    select 1 from information_schema.tables
    where table_name = 'audit_log'
    and table_schema = 'public'
  ) into v_audit_log_exists;

  -- Check audit_log RLS enabled
  select relrowsecurity into v_audit_log_rls_enabled
    from pg_class
    where relname = 'audit_log'
    and relnamespace = 'public'::regnamespace
    limit 1;

  raise notice '[057_vol62] RLS policy: %, campaign index: %, ngo_campaign index: %, audit_log: %, audit_log RLS: %',
    v_ngo_admin_policy_exists, v_campaign_index_exists, v_ngo_campaign_index_exists, v_audit_log_exists, v_audit_log_rls_enabled;
end $$;

commit;

-- ──────────────────────────────────────────────────────────────────
-- DOĞRULAMA SORGULARI:
-- ──────────────────────────────────────────────────────────────────
-- SELECT * FROM pg_policies WHERE tablename = 'donations' AND policyname = 'ngo_admins_view_donations';
-- SELECT * FROM pg_indexes WHERE tablename = 'donations' AND (indexname LIKE '%campaign%' OR indexname LIKE '%ngo%');
-- SELECT * FROM information_schema.tables WHERE table_name = 'audit_log' AND table_schema = 'public';
--
-- Test RLS:
--   SET session authorization '<ngo-admin-user-id>';
--   SELECT COUNT(*) FROM public.donations WHERE ngo_id = 'tema';
--   -- İlgili STK'nın bağışlarını görebilmeli
-- ──────────────────────────────────────────────────────────────────
