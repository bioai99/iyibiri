-- 042_vol32_campaigns_admin_rls.sql
-- Vol-32 hotfix: campaigns tablosuna NGO admin yazma policy'leri eksik.
-- Migration 040 sadece "Anyone can view active campaigns" SELECT policy ekledi;
-- INSERT/UPDATE/DELETE için ngo_admin_users / super_admin scope'u yok → admin
-- panelinden kampanya oluşturulamıyor (RLS reddediyor).
--
-- Bu migration, missions için kullanılan pattern'in (021) campaigns'a uygulanmış halidir.
-- Tarih: 2026-04-29 — Vol-32 verify sırasında tespit edildi.

begin;

-- Mevcut policy'leri (idempotent) kaldır
drop policy if exists "NGO admins insert campaigns" on public.campaigns;
drop policy if exists "NGO admins update campaigns" on public.campaigns;
drop policy if exists "NGO admins delete campaigns" on public.campaigns;
drop policy if exists "Super admins manage all campaigns" on public.campaigns;

-- Insert: admin kendi STK'sının kampanyasını oluşturabilir
create policy "NGO admins insert campaigns" on public.campaigns
  for insert
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

-- Update: admin kendi STK'sının kampanyasını düzenleyebilir
create policy "NGO admins update campaigns" on public.campaigns
  for update
  using (public.is_ngo_admin(auth.uid(), ngo_id))
  with check (public.is_ngo_admin(auth.uid(), ngo_id));

-- Delete: admin kendi STK'sının kampanyasını silebilir (soft-delete via status='archived' tercih edilir)
create policy "NGO admins delete campaigns" on public.campaigns
  for delete
  using (public.is_ngo_admin(auth.uid(), ngo_id));

-- Super-admin: tüm kampanyaları yönetebilir
create policy "Super admins manage all campaigns" on public.campaigns
  for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

commit;

-- ============================================================
-- Doğrulama
-- ============================================================
-- 1. NGO admin kampanya oluşturabilmeli:
--    insert into campaigns (id, ngo_id, title, status) values ('test-x', 'tema', 'Test', 'draft');
--
-- 2. Başka STK'nın kampanyasına yazamamalı:
--    insert into campaigns (id, ngo_id, title) values ('test-y', 'wwf', 'WWF', 'draft');
--    -- ERROR: row-level security policy violation
--
-- 3. Public hâlâ aktif kampanyaları görebilmeli (Migration 040 policy'si korunur).
