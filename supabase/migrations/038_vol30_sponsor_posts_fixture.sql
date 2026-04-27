-- Vol-30 Migration 038: Sponsor postları fixture (Patagonia + Eczacıbaşı).
--
-- Bağlam: Migration 037 sponsors entity'sini kurdu ve mevcut 6 reward brand'ini
-- otomatik sponsor'a çevirdi. Bu migration Vol-30.4 SponsorPostsRail'i canlı
-- gösterebilmek için iki "blogpost yazan" sponsor markayı + sample postları seed eder.
--
-- Vol-31'de sponsor admin backoffice geldikten sonra bu fixture'ı silebiliriz —
-- sponsorlar kendileri post yazmaya başlayınca seed verisine ihtiyaç kalmaz.

begin;

-- ─────────────────────────────────────────────────────────────────
-- 1. Sponsor markalar
-- ─────────────────────────────────────────────────────────────────
insert into public.sponsors (
  id, name, short_name, brand_color, logo_url, cover_url,
  description, website, is_active
) values
  (
    'patagonia',
    'Patagonia',
    'Patagonia',
    '#3D6A4E',          -- doğa yeşili
    null,
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
    'Doğa için iş yapan outdoor markası. Kazandığının yüzde birini gezegene bağışlar.',
    'https://www.patagonia.com.tr',
    true
  ),
  (
    'eczacibasi',
    'Eczacıbaşı Topluluğu',
    'Eczacıbaşı',
    '#8B2D3E',          -- bordo
    null,
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=900&q=80',
    'Türkiye''nin en köklü topluluklarından biri. Sağlık, eğitim ve kültür alanlarında 80 yılı aşkın sosyal yatırım.',
    'https://www.eczacibasi.com.tr',
    true
  )
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  brand_color = excluded.brand_color,
  cover_url = excluded.cover_url,
  description = excluded.description,
  website = excluded.website,
  is_active = excluded.is_active;

-- ─────────────────────────────────────────────────────────────────
-- 2. Sponsor postları (XOR check: ngo_id null + sponsor_id dolu)
-- ─────────────────────────────────────────────────────────────────
insert into public.posts (
  id, ngo_id, author_type, sponsor_id,
  title, summary, content,
  cover_image_url, category, read_time, published, created_at
) values
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'patagonia',
    'Onarmak satın almaktan iyidir',
    'Eski montunu çöpe atmadan önce: Patagonia ücretsiz onarım merkezleri ile fast fashion''a karşı duruşunu büyütüyor.',
    E'Patagonia için en sürdürülebilir ürün, şu anda dolabınızda olan ve bir süre daha giyebileceğiniz üründür. Bu yıl Türkiye''de açtığımız üç onarım noktasında 3.200 parça kıyafet ikinci ömrüne kavuştu. Markamızdan bağımsız, hangi marka olursa olsun yırtık montunuzu, açılmış fermuarı veya sökülmüş dikişi ücretsiz tamir ediyoruz.\n\nWorn Wear programı, gezegenimizin en önemli kaynağının zaten ürettiğimiz şeyler olduğu fikrine dayanıyor. Onarım, yeniden satış ve bağış üçlüsü ile bir ürünün ömrünü iki katına çıkardığımızda, çevresel etkisini de yarıya düşürmüş oluyoruz.',
    'https://images.unsplash.com/photo-1551818014-7c8ce7e0a131?w=900&q=80',
    'story',
    4,
    true,
    now() - interval '2 days'
  ),
  (
    gen_random_uuid(),
    null,
    'sponsor',
    'eczacibasi',
    'Çağdaş Yaşam''la 35 yıllık yol arkadaşlığı',
    'Eczacıbaşı Topluluğu, kız çocuklarının okullaşması için ÇYDD ile birlikte 12 ilde burs ve mentorluk programı sürdürüyor.',
    E'Eczacıbaşı Topluluğu olarak 1989''dan bu yana Çağdaş Yaşamı Destekleme Derneği ile birlikte yürüttüğümüz burs ve mentorluk programı, bu yıl 12. ilde de açıldı. Programın açık verilerine göre bursiyerlerin yüzde 87''si üniversiteyi tamamlıyor, yüzde 41''i lisansüstü eğitime devam ediyor.\n\nBu yıl programa eklenen ‘‘İlk işime hazırım’’ modülü ile bursiyerlere CV yazımı, mülakat hazırlık ve sektör mentorluğu sunuluyor. Topluluk şirketlerinde staj imkânı ile birlikte düşünüldüğünde, kız çocuklarının iş gücüne katılımı için somut bir köprü kurmuş oluyoruz.',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
    'update',
    5,
    true,
    now() - interval '4 days'
  );

commit;

-- DOĞRULAMA:
--   select id, name, brand_color from public.sponsors order by created_at desc;
--   -- Beklenen: en az 8 sponsor (6 mevcut reward brand + Patagonia + Eczacıbaşı)
--
--   select author_type, count(*) from public.posts group by author_type;
--   -- Beklenen: ngo: N, sponsor: 2
--
--   select s.name, p.title
--     from public.posts p
--     join public.sponsors s on s.id = p.sponsor_id
--     where p.author_type = 'sponsor'
--     order by p.created_at desc;
