-- Vol-43 Migration 046: Sponsor logo URL'leri ekle.
--
-- Migration 038'de Patagonia ve Eczacıbaşı sponsor seedi `logo_url: null`
-- ile geçmişti — dashboard'da SponsorPostsRail kartında "P" / "E" harf
-- gösteriliyordu. Bu migration sponsor logo URL'lerini Wikipedia Commons'tan
-- (remotePatterns'da allow-listed) doldurur.
--
-- on conflict pattern: id sabit ('patagonia' / 'eczacibasi'), update set ile
-- mevcut satırı güncelle (yeni satır eklenmez).

begin;

update public.sponsors
set logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Patagonia_logo.svg/2560px-Patagonia_logo.svg.png'
where id = 'patagonia' and (logo_url is null or logo_url = '');

update public.sponsors
set logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Eczac%C4%B1ba%C5%9F%C4%B1_logo.svg/2560px-Eczac%C4%B1ba%C5%9F%C4%B1_logo.svg.png'
where id = 'eczacibasi' and (logo_url is null or logo_url = '');

commit;

-- DOĞRULAMA:
--   select id, name, logo_url from public.sponsors
--     where id in ('patagonia', 'eczacibasi');
--   -- Beklenen: her iki satırın logo_url alanı dolu (https://upload.wikimedia.org/...)
