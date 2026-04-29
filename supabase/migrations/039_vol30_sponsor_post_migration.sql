-- Vol-30 Migration 039: BUG-057 fix — sponsor-category NGO postlarını sponsor entity'sine taşı.
--
-- Problem (Vol-30 verify):
--   public.ngos tablosunda category='sponsor' olan 3 kayıt vardı (eski "sponsor markaları
--   NGO gibi göstermek" hack'i): starbucks, migros, nike-tr. Bunlara bağlı postlar
--   author_type='ngo' olarak NGO Posts rail'inde görünüyordu, ki bu Vol-30.4'ün IA
--   ayrımını bozar.
--
-- Migration 037 sponsors tablosu yaratmış ve rewards.brand'dan id slug'larıyla
-- backfill etmişti. Bu migration:
--   1. Sponsor mapping garantile (starbucks→starbucks, migros→migros, nike-tr→nike)
--   2. Eski sponsor-NGO postlarını author_type='sponsor' + sponsor_id=mapping + ngo_id=null'a taşı
--   3. Eski sponsor-NGO kayıtlarını is_active=false yap (NGORail'de görünmesinler)

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Sponsor mapping (Migration 037 backfill'i ile uyumlu olmayan id'leri ekle)
-- ─────────────────────────────────────────────────────────────────
-- Migration 037 rewards.brand → slug ile entity yarattı. Mevcut:
--   - sponsors.starbucks (Starbucks)
--   - sponsors.migros (Migros)
--   - sponsors.nike (Nike)        ← NGO id'si "nike-tr", sponsor id'si "nike"
--   - sponsors.trendyol, cinemaximum, garanti-bbva (kullanılmıyor postlarda)
--
-- "nike-tr" NGO için sponsor entity yoksa garantile:

insert into public.sponsors (id, name, short_name, brand_color, is_active)
select 'nike', 'Nike Türkiye', 'Nike', '#111111', true
where not exists (select 1 from public.sponsors where id = 'nike')
on conflict (id) do nothing;

-- Aynı şekilde starbucks/migros zaten var olmalı ama defensive insert:
insert into public.sponsors (id, name, short_name, brand_color, is_active)
values
  ('starbucks', 'Starbucks Türkiye', 'Starbucks', '#00704A', true),
  ('migros', 'Migros', 'Migros', '#FF6600', true)
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  brand_color = excluded.brand_color,
  is_active = excluded.is_active;

-- ─────────────────────────────────────────────────────────────────
-- 2. Sponsor-NGO postlarını sponsor entity'sine taşı
-- ─────────────────────────────────────────────────────────────────
-- XOR check (posts_author_xor) ihlal etmemek için: önce sponsor_id + author_type set,
-- sonra ngo_id=null. Tek update'te yapamıyoruz çünkü constraint anlık değerlendirilir.
-- Çözüm: constraint'i deferrable yap-mıyoruz, single transaction içinde tek update yeter
-- (constraint commit'te kontrol edilir, ama default IMMEDIATE'tir).
--
-- DEFAULT IMMEDIATE constraint için tek bir UPDATE yeter çünkü row-level constraint
-- update'in tamamlanmasından sonra check edilir, satır içinde kolon sırası önemli değil.

update public.posts
set
  author_type = 'sponsor',
  sponsor_id = 'starbucks',
  ngo_id = null
where ngo_id = 'starbucks' and author_type = 'ngo';

update public.posts
set
  author_type = 'sponsor',
  sponsor_id = 'migros',
  ngo_id = null
where ngo_id = 'migros' and author_type = 'ngo';

update public.posts
set
  author_type = 'sponsor',
  sponsor_id = 'nike',     -- NGO id 'nike-tr' → sponsor id 'nike'
  ngo_id = null
where ngo_id = 'nike-tr' and author_type = 'ngo';

-- ─────────────────────────────────────────────────────────────────
-- 3. Yetim kontrol — geriye 'sponsor'-category NGO'ya bağlı NGO post kalmasın
-- ─────────────────────────────────────────────────────────────────
do $$
declare
  orphan_count int;
begin
  select count(*) into orphan_count
  from public.posts p
  join public.ngos n on n.id = p.ngo_id
  where p.author_type = 'ngo' and n.category = 'sponsor';

  if orphan_count > 0 then
    raise exception 'Vol-30 Migration 039: % post hala sponsor-NGO''ya baglı, mapping eksik.', orphan_count;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────
-- 4. Sponsor-category NGO'ları soft hide
-- ─────────────────────────────────────────────────────────────────
-- Not: public.ngos tablosunda is_active kolonu YOK. App tarafında
-- (app/dashboard/page.tsx getAllActiveNGOs) `category != 'sponsor'` filtresi
-- eklendi — DB'de değişiklik gerekli değil. Bu kayıtlar veri olarak kalır,
-- sadece UI'da NGORail'de görünmezler.

commit;

-- DOĞRULAMA:
--   select author_type, count(*) from public.posts group by author_type;
--   -- Beklenen: 'ngo': N, 'sponsor': 5+ (Patagonia + Eczacıbaşı + Starbucks + Migros + Nike)
--
--   select s.name, count(p.id) as post_count
--     from public.sponsors s
--     left join public.posts p on p.sponsor_id = s.id and p.author_type = 'sponsor'
--     group by s.name order by post_count desc;
--
--   select id, name, category, is_active from public.ngos where category = 'sponsor';
--   -- Beklenen: 3 satır, hepsi is_active=false
