-- 031_vol23_avatar_storage_and_m4_fixture.sql
-- Vol-23 MEGA paket:
-- (a) avatars storage RLS — user kendi avatar.{ext} dosyasına yazabilir
-- (b) M4 fixture: Sahil Temizliği event_date geçmiş tarihi geleceğe çek
--
-- Tarih: 2026-04-26 — test-engineer (Vol-23)

begin;

-- ---------------------------------------------------------------------------
-- (a) Avatar storage policy — ngo-assets bucket içinde users/{userId}/ klasörü
-- ---------------------------------------------------------------------------
-- Konvansiyon: ngo-assets/users/{userId}/avatar.{ext}
-- Public read için zaten "Public read for ngo-assets" policy var (023).
-- Yazma için kullanıcı kendi user_id klasörüne upload + update + delete yapabilir.

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
  for insert
  with check (
    bucket_id = 'ngo-assets'
    and (string_to_array(name, '/'))[1] = 'users'
    and (string_to_array(name, '/'))[2] = auth.uid()::text
  );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
  for update
  using (
    bucket_id = 'ngo-assets'
    and (string_to_array(name, '/'))[1] = 'users'
    and (string_to_array(name, '/'))[2] = auth.uid()::text
  );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
  for delete
  using (
    bucket_id = 'ngo-assets'
    and (string_to_array(name, '/'))[1] = 'users'
    and (string_to_array(name, '/'))[2] = auth.uid()::text
  );

-- profiles.avatar_url kolonu zaten mevcut (001_initial_schema). Sadece doğrula.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'avatar_url'
  ) then
    alter table public.profiles add column avatar_url text;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- (b) M4 fixture — Sahil Temizliği eventleri geleceğe taşı
-- ---------------------------------------------------------------------------
-- TEMA-2 ("Kilyos sahili temizlik") + TEMA-1 (orijinal Sahil Temizliği) için
-- event_date değerini gelecek 14 günlük pencereye çek. Test akışı (mission take +
-- complete + verification) ancak event_date >= now() ise düzgün çalışır.
--
-- date_label de güncellensin (UI'da gösterilen TR string).

update public.missions
set
  event_date = (now() + interval '14 days')::timestamptz,
  date_label = '10 May Cumartesi 09:00',
  spots_left = 12,
  status = 'active'
where id = 'm-tema-temizlik-full';

-- m-tema-fidan (TEMA Beykoz fidan dikimi) — gelecek 7 gün
update public.missions
set
  event_date = (now() + interval '7 days')::timestamptz,
  date_label = '3 May Cumartesi 10:00',
  status = 'active'
where id = 'm-tema-fidan';

-- m-tegv-okuma — gelecek 21 gün
update public.missions
set
  event_date = (now() + interval '21 days')::timestamptz,
  date_label = '17 May Cumartesi 14:00',
  status = 'active'
where id = 'm-tegv-okuma';

-- m-haytap-mama — gelecek 5 gün
update public.missions
set
  event_date = (now() + interval '5 days')::timestamptz,
  date_label = '1 May Perşembe 14:00',
  status = 'active'
where id = 'm-haytap-mama';

-- m-online-digital-literacy — gelecek 21 gün (online, esnek)
update public.missions
set
  event_date = (now() + interval '21 days')::timestamptz,
  date_label = 'Mayıs sonu — online',
  status = 'active'
where id = 'm-online-digital-literacy';

commit;

-- ---------------------------------------------------------------------------
-- Doğrulama:
-- select id, title, event_date, date_label, spots_left, status from missions
--   where event_date >= now() order by event_date;
-- ---------------------------------------------------------------------------
