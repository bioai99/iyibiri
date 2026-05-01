-- migration 044_composite_indexes.sql
-- Tarih: 2026-04-26
-- Owner: supabase-backend
-- Bağlı: ADR-016 Accepted (Migration template), v2 audit P-003 + TD-023
--
-- Amaç: Sık kullanılan filter kombinasyonları için composite index'ler ekle.
-- v2 audit: 25 single-column index var, 0 composite. Aşağıdaki sorgu pattern'leri
-- `lib/supabase/queries/` taramasından çıkarıldı.
--
-- Rollback notu:
--   drop index if exists user_missions_user_status_idx;
--   drop index if exists missions_ngo_active_event_idx;
--   drop index if exists referrals_user_status_created_idx;
--   drop index if exists ngo_memberships_user_status_idx;
--   drop index if exists karma_transactions_user_type_date_idx;
--   drop index if exists posts_ngo_published_created_idx;
--   drop index if exists donations_user_status_created_idx;
--   drop index if exists campaigns_ngo_active_featured_idx;

begin;

-- 1. user_missions: kullanıcının tamamlanmış / aktif görevleri (Dashboard, Profile)
--    Sorgu: `.eq('user_id', X).eq('status', 'completed')`
create index if not exists user_missions_user_status_idx
  on public.user_missions (user_id, status);

-- 2. missions: STK'nın aktif görevleri tarih sırasıyla (NGO profile, Discover)
--    Sorgu: `.eq('ngo_id', X).eq('active', true).order('event_date')`
create index if not exists missions_ngo_active_event_idx
  on public.missions (ngo_id, active, event_date);

-- 3. referrals: kullanıcının onaylı/bekleyen ödeme referrals'ı tarih sırasıyla
--    Sorgu: `.eq('user_id', X).eq('status', 'confirmed').order('created_at desc')`
create index if not exists referrals_user_status_created_idx
  on public.referrals (user_id, status, created_at desc);

-- 4. ngo_memberships: kullanıcının aktif üyelikleri (Dashboard hub)
--    Sorgu: `.eq('user_id', X).eq('status', 'active')`
create index if not exists ngo_memberships_user_status_idx
  on public.ngo_memberships (user_id, status);

-- 5. karma_transactions: kullanıcının karma history'si (Karma timeline)
--    Sorgu: `.eq('user_id', X).eq('type', 'mission_complete').order('created_at desc')`
create index if not exists karma_transactions_user_type_date_idx
  on public.karma_transactions (user_id, type, created_at desc);

-- 6. posts: STK'nın yayınlanmış post'ları (Blog, Discover)
--    Sorgu: `.eq('ngo_id', X).eq('published', true).order('created_at desc')`
create index if not exists posts_ngo_published_created_idx
  on public.posts (ngo_id, published, created_at desc);

-- 7. donations: kullanıcının onaylanmış bağışları (Donation history)
--    Sorgu: `.eq('user_id', X).eq('status', 'completed').order('created_at desc')`
create index if not exists donations_user_status_created_idx
  on public.donations (user_id, status, created_at desc);

-- 8. campaigns: STK'nın aktif öne-çıkan kampanyaları (Donate hub)
--    Sorgu: `.eq('ngo_id', X).eq('status', 'active').eq('is_featured', true)`
create index if not exists campaigns_ngo_active_featured_idx
  on public.campaigns (ngo_id, status, is_featured);

commit;

-- Validation:
--   EXPLAIN ANALYZE select * from public.user_missions where user_id = '...' and status = 'completed';
--   Beklenen: Index Scan using user_missions_user_status_idx (cost ~= 0.5..N rows)
