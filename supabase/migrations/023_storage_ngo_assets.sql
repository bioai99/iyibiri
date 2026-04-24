-- 023_storage_ngo_assets.sql
-- Supabase Storage bucket: ngo-assets
-- İçerik: STK logo, cover, görev görseli, blog cover, verification proof photo
-- Tarih: 2026-04-25 — supabase-backend

begin;

-- Bucket oluştur (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ngo-assets',
  'ngo-assets',
  true,  -- public read (STK logoları public)
  10485760,  -- 10 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- RLS: Anyone can read (public bucket)
-- Test: SELECT * FROM ngo-assets/ → public, authenticated, anon için true
drop policy if exists "Public read for ngo-assets" on storage.objects;
create policy "Public read for ngo-assets" on storage.objects
  for select
  using (bucket_id = 'ngo-assets');

-- RLS: NGO admin uploads to own folder (ngo-assets/{ngoId}/...)
-- Test: NGO admin ngo-assets/ngoId123/* yazabilir, başka admin yazamaz
drop policy if exists "NGO admins upload to own folder" on storage.objects;
create policy "NGO admins upload to own folder" on storage.objects
  for insert
  with check (
    bucket_id = 'ngo-assets'
    and (
      is_super_admin(auth.uid())
      or is_ngo_admin(auth.uid(), (string_to_array(name, '/'))[1])
    )
  );

-- RLS: NGO admin updates own folder files
-- Test: NGO admin kendi ngoId klasöründeki dosyaları güncelleyebilir
drop policy if exists "NGO admins update own folder" on storage.objects;
create policy "NGO admins update own folder" on storage.objects
  for update
  using (
    bucket_id = 'ngo-assets'
    and (
      is_super_admin(auth.uid())
      or is_ngo_admin(auth.uid(), (string_to_array(name, '/'))[1])
    )
  );

-- RLS: NGO admin deletes own folder files
-- Test: NGO admin kendi ngoId klasöründeki dosyaları silebilir
drop policy if exists "NGO admins delete own folder" on storage.objects;
create policy "NGO admins delete own folder" on storage.objects
  for delete
  using (
    bucket_id = 'ngo-assets'
    and (
      is_super_admin(auth.uid())
      or is_ngo_admin(auth.uid(), (string_to_array(name, '/'))[1])
    )
  );

-- RLS: Authenticated users upload verification proofs to own folder (ngo-assets/proofs/{user_id}/...)
-- Test: User ngo-assets/proofs/{user_id}/* yazabilir, başka user yazamaz
drop policy if exists "Users upload verification proofs" on storage.objects;
create policy "Users upload verification proofs" on storage.objects
  for insert
  with check (
    bucket_id = 'ngo-assets'
    and (string_to_array(name, '/'))[1] = 'proofs'
    and (string_to_array(name, '/'))[2] = auth.uid()::text
  );

commit;

-- Klasör konvansiyonu:
-- ngo-assets/
--   {ngoId}/
--     logo.{ext}
--     cover.{ext}
--     missions/{missionId}.{ext}
--     blog/{postId}.{ext}
--   proofs/
--     {userId}/
--       {userMissionId}.{ext}
