-- Vol-49 Migration 049: missions tablosuna created_at + updated_at ekle.
--
-- Bağlam (Bahadır + live verify, 2026-05-02):
--   NGO profile sayfasında "Açık görevler: 0" gösteriliyor ama TEMA'nın 8
--   aktif görevi var. Root cause: getNGOWithMissions sorgusu
--   `.order('created_at', { ascending: true })` yapıyor — created_at kolonu
--   missions tablosunda 001_initial_schema.sql'den beri YOK. Supabase JS
--   client silently fail ediyor (data:null) — Vol-36.1'deki featured order
--   bug'ının aynısı.
--
--   Fix iki katmanlı:
--   1. (bu migration) created_at + updated_at kolonları ekle, default now()
--      ile mevcut satırlar şu an tarihini alır
--   2. (kod tarafında) frontend order('created_at') artık çalışır
--
-- Eski satırlar için: default now() ile bu migration koşulduğu zaman'ın
-- değerini alırlar. İdeal değil ama deterministic + sorting çalışır.
-- Yeni insert'ler now() default'tan otomatik gerçek timestamp alır.

begin;

alter table public.missions
  add column if not exists created_at timestamptz not null default now();

alter table public.missions
  add column if not exists updated_at timestamptz not null default now();

-- Updated_at için trigger: row update edildiğinde otomatik now() yaz
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists missions_set_updated_at on public.missions;
create trigger missions_set_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

commit;

-- DOĞRULAMA:
--   select column_name, data_type, column_default from information_schema.columns
--     where table_schema = 'public' and table_name = 'missions'
--       and column_name in ('created_at', 'updated_at');
--   -- Beklenen: 2 satır, both timestamptz, default now()
--
--   select count(*) from public.missions where created_at is null;
--   -- Beklenen: 0 (default now() ile dolu)
