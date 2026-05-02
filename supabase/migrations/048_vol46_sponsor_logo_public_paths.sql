-- Vol-46 Migration 048: Sponsor logo URL'leri Clearbit → public PNG paths.
--
-- Bağlam (Bahadır + live verify, 2026-05-02):
--   Clearbit Logo API (logo.clearbit.com) sürekli 503 dönüyor — Patagonia
--   ve Eczacıbaşı eski URL'leri de aynı, yeni 5 marka için de büyük
--   olasılıkla aynı sorun. Public PNG'lere geçtik:
--   - public/sponsors/<id>.png — test fixture sponsor'lar için
--   - Production'da sponsor admin upload'u Supabase Storage'a yapar
--     (admin-image-upload component'i Migration 037'den beri var);
--     logo_url field her iki path tipini de destekler (string).
--
-- 6 sponsor için path mapping:
--   starbucks    → /sponsors/starbucks.png
--   migros       → /sponsors/migros.png
--   trendyol     → /sponsors/trendyolgo.png  (Trendyol Go pivot — name update)
--   nike         → /sponsors/nike.png
--   garanti-bbva → /sponsors/garanti-bbva.png  (mevcut /garanti-bbva-logo.svg
--                                                 yerine consolidated path)
--   cinemaximum  → /sponsors/cinemaximum.png

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Logo path'leri public PNG'ye çevir
-- ─────────────────────────────────────────────────────────────────

update public.sponsors
set logo_url = '/sponsors/starbucks.png'
where id = 'starbucks';

update public.sponsors
set logo_url = '/sponsors/migros.png'
where id = 'migros';

-- Trendyol Go pivot: kullanıcı "Trendyol Go" logosu yükledi, post içeriğini
-- de Trendyol Go bağlamına getiriyoruz (yemek/teslimat ekosistemi).
update public.sponsors
set logo_url = '/sponsors/trendyolgo.png',
    name = 'Trendyol Go',
    short_name = 'Trendyol Go',
    description = 'Türkiye''nin lider yemek ve market teslimat platformu. Kurye iyi koşulları, sürdürülebilir paketleme ve yerel restoran desteğiyle.',
    website = 'https://www.trendyolgo.com'
where id = 'trendyol';

update public.sponsors
set logo_url = '/sponsors/nike.png'
where id = 'nike';

update public.sponsors
set logo_url = '/sponsors/garanti-bbva.png'
where id = 'garanti-bbva';

update public.sponsors
set logo_url = '/sponsors/cinemaximum.png'
where id = 'cinemaximum';

-- ─────────────────────────────────────────────────────────────────
-- 2. Trendyol Go pivot — post içeriğini ekosisteme uygun değiştir
-- ─────────────────────────────────────────────────────────────────

update public.posts
set
  title = 'Kurye iyi koşulları için iklim protokolü',
  summary = 'Aşırı sıcak ve soğuk havalarda Trendyol Go kuryelerine ücretli durdurma hakkı: 35°C üzeri ve −5°C altı sıparişlerde hizmet otomatik kapanıyor.',
  content = E'Trendyol Go olarak bu yıl başlattığımız "İklim Protokolü" ile kuryelerimizin hava koşulu kaynaklı risklerini azaltıyoruz. Hava 35°C''nin üzerine çıktığında ya da −5°C''nin altına düştüğünde sipariş alma otomatik durduruluyor; kuryeler bu süreyi ücretli izinli sayılıyor.\n\nAyrıca tüm sipariş paketlemelerinde kompostlanabilir poşete geçtik; bu yıl 4,8 milyon plastik poşet kullanılmadı. Yerel restoran destek programıyla 2.300 küçük işletme ücretsiz dijitalleşme eğitimi aldı; bu işletmelerin platformdaki ortalama gelir artışı %38 oldu.'
where sponsor_id = 'trendyol'
  and title ilike '%esnaf%';

commit;

-- DOĞRULAMA:
--   select id, name, logo_url from public.sponsors
--     where is_active = true order by name;
--   -- Beklenen: 6 satır, tüm logo_url'ler /sponsors/*.png
--
--   select sponsor_id, title from public.posts
--     where author_type = 'sponsor' order by sponsor_id;
--   -- Beklenen: trendyol post'unun başlığı "Kurye iyi koşulları..."
