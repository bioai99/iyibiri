-- 043_vol33_sponsor_admin_writes_complete.sql
-- Vol-33 hotfix: Migration 041 sponsors + sponsor_admin_users yazma policy'leri
-- yarım kalmıştı. approveSponsorRequest server action super-admin (t5) ile çağrılıp
-- sponsors INSERT yapmaya çalışınca "row violates row-level security policy for
-- table sponsors" hatası alındı (BUG-064).
--
-- Migration 041 mevcut policy'leri:
--   sponsors → sponsor_admin için sadece UPDATE policy (INSERT/DELETE yok, super-admin
--              override yok)
--   sponsor_admin_users → sadece SELECT policy (INSERT yok — super-admin başvuru
--              onaylarken admin atayamıyor)
--
-- Bu migration BUG-061 / Migration 042 pattern'inin birebir aynısını uygular:
-- sponsor_admin scope + super-admin manage all.
--
-- Tarih: 2026-04-29 — Vol-33 BUG-064 verify sırasında tespit edildi.

begin;

-- ============================================================
-- 1. sponsors — super-admin manage all + sponsor_admin scope
-- ============================================================
-- Existing: "Sponsor admin can update own sponsor" (Migration 041) — kalıyor.

drop policy if exists "Super admins manage all sponsors" on public.sponsors;
create policy "Super admins manage all sponsors"
  on public.sponsors
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ============================================================
-- 2. sponsor_admin_users — super-admin + sponsor admin yönetebilir
-- ============================================================
-- Existing: "Users view own sponsor admin records" (Migration 041 SELECT) — kalıyor.

-- Super-admin: tüm sponsor admin atamalarını yönetebilir (başvuru onayında insert)
drop policy if exists "Super admins manage all sponsor_admin_users" on public.sponsor_admin_users;
create policy "Super admins manage all sponsor_admin_users"
  on public.sponsor_admin_users
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- Sponsor admin: kendi sponsor'una başka admin/editor/viewer ekleyebilir
drop policy if exists "Sponsor admin can manage own sponsor_admin_users" on public.sponsor_admin_users;
create policy "Sponsor admin can manage own sponsor_admin_users"
  on public.sponsor_admin_users
  for all
  using (public.is_sponsor_admin(sponsor_id, auth.uid()))
  with check (public.is_sponsor_admin(sponsor_id, auth.uid()));

-- ============================================================
-- 3. posts + rewards — super-admin manage all (eksikti)
-- ============================================================
-- Migration 041 sponsor admin için FOR ALL yazmıştı ama super-admin override eksikti.
-- Super-admin sponsor adına post / reward düzenleme ihtiyacı (devtools) için.

drop policy if exists "Super admins manage all sponsor posts" on public.posts;
create policy "Super admins manage all sponsor posts"
  on public.posts
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists "Super admins manage all rewards" on public.rewards;
create policy "Super admins manage all rewards"
  on public.rewards
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

commit;

-- ============================================================
-- DOĞRULAMA
-- ============================================================
-- 1. Super-admin (t5) bir sponsor_signup_request onaylayabilmeli:
--    - sponsors INSERT (yeni marka entity'si)
--    - sponsor_admin_users INSERT (opsiyonel, eğer adminUserId verildiyse)
--    - sponsor_signup_requests UPDATE (status='approved')
--
-- 2. Bir sponsor admin başka birini kendi markasına admin atayabilmeli.
--
-- 3. Anonim user hâlâ sadece public sponsor profile read (Migration 037 policy).
