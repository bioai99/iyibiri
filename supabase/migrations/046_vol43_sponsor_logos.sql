-- Vol-43 Migration 046: Sponsor logo URL'leri + Patagonia post cover fix.
--
-- Migration 038'de Patagonia ve Eczacıbaşı sponsor seedi `logo_url: null`
-- ile geçmişti — dashboard'da SponsorPostsRail kartında "P" / "E" harf
-- gösteriliyordu.
--
-- Vol-43 review (2026-05-02): İlk denemede Wikipedia Commons URL'leri
-- kullandık ama Eczacıbaşı dosyası commons'ta yok (404). Clearbit Logo
-- API'ye geçiyoruz — public, free, brand domain'inden auto-fetch:
-- https://logo.clearbit.com/<domain>
--
-- Ek olarak Patagonia "Onarmak satın almaktan iyidir" post cover
-- (Unsplash photo-1551818014-...) live'da fail ediyordu. Daha güvenilir
-- bir Unsplash URL'iyle değiştir (sürdürülebilir moda / dikiş temalı).
--
-- on conflict pattern yok — sadece UPDATE; sponsor row'lar zaten var.

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Sponsor logo_url — Clearbit Logo API (public domain auto-fetch)
-- ─────────────────────────────────────────────────────────────────

update public.sponsors
set logo_url = 'https://logo.clearbit.com/patagonia.com'
where id = 'patagonia';

update public.sponsors
set logo_url = 'https://logo.clearbit.com/eczacibasi.com.tr'
where id = 'eczacibasi';

-- ─────────────────────────────────────────────────────────────────
-- 2. Patagonia post cover — fail eden Unsplash photo'yu değiştir
-- ─────────────────────────────────────────────────────────────────

update public.posts
set cover_image_url = 'https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?w=900&q=80'
where sponsor_id = 'patagonia'
  and title = 'Onarmak satın almaktan iyidir';

commit;

-- DOĞRULAMA:
--   select id, name, logo_url from public.sponsors
--     where id in ('patagonia', 'eczacibasi');
--   -- Beklenen: her iki satırın logo_url alanı 'https://logo.clearbit.com/...'
--
--   select sponsor_id, title, cover_image_url from public.posts
--     where sponsor_id = 'patagonia';
--   -- Beklenen: cover_image_url yeni Unsplash URL'i.
